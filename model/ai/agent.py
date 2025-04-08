import os
import mimetypes
import pdfplumber
from typing import Any, Dict, List, TypedDict
from PIL import Image
import easyocr
from docx import Document
from langgraph.graph import StateGraph, START, END
from google import genai
from google.genai import types
import dotenv
import json
import uuid
import concurrent.futures

# Import the chroma_client from db.py
from model.db import chroma_client

dotenv.load_dotenv()

BLOCK_SIZE = 8  # Chunk size for splitting text

class PreprocessingAgent:
    def __init__(self):
        self.supported_extensions = ['.pdf', '.png', '.jpg', '.jpeg', '.docx', '.txt', '.csv', '.json']
        self.ocr_reader = easyocr.Reader(['en'])  # Initialize EasyOCR reader for English

        # Use the chroma_client from db.py
        self.chroma_client = chroma_client
        self.collection_name = "file_repository"
        self.collection = self.chroma_client.get_or_create_collection(name=self.collection_name)

        # Initialize Google GenAI client
        self.genai_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.genai_model = "gemini-2.0-flash"

    def preprocess_repository(self, file_paths: List[str]) -> Dict[str, Any]:
        """
        Preprocess multiple files and treat them as a data repository.
        Store metadata and preprocessed data in ChromaDB.
        :param file_paths: List of file paths to preprocess.
        :return: Dictionary with file paths as keys and preprocessed data as values.
        """
        repository = {}
        with concurrent.futures.ThreadPoolExecutor() as executor:
            results = list(executor.map(self._process_file, file_paths))
        for file_path, result in zip(file_paths, results):
            repository[file_path] = result
        return repository

    def _process_file(self, file_path: str) -> Any:
        """
        Process a single file, extract text, and store metadata in ChromaDB.
        :param file_path: Path to the file to process.
        :return: Preprocessed data.
        """
        try:
            preprocessed_data = self._extract_and_chunk(file_path)
            metadata = {
                "file_name": os.path.basename(file_path),
                "file_path": file_path,
                "file_type": os.path.splitext(file_path)[1].lower(),
                "total_chunks": len(preprocessed_data)
            }
            # Add data and metadata to ChromaDB
            self._store_in_chromadb(file_path, preprocessed_data, metadata)
            return preprocessed_data
        except Exception as e:
            return f"Error: {e}"

    def _extract_and_chunk(self, file_path: str) -> List[str]:
        """
        Extract and chunk text from a file based on its type.
        :param file_path: Path to the file.
        :return: List of text chunks.
        """
        filetype = mimetypes.guess_type(file_path)[0]

        if filetype == 'application/pdf':
            return self._chunk_pdf(file_path)
        elif filetype == 'text/plain':
            with open(file_path) as f:
                return self._chunk_text(f.read())
        elif filetype == 'text/csv':
            return self._chunk_text(pd.read_csv(file_path).to_string(index=False))
        elif filetype == 'application/json':
            return self._chunk_text(json.dumps(json.load(open(file_path)), indent=2))
        elif filetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':  # Handle .docx
            return self._chunk_docx(file_path)
        elif filetype and filetype.startswith('image/'):
            return [self._handle_image(file_path)]
        else:
            raise ValueError("Unsupported file type.")

    def _chunk_pdf(self, file_path: str) -> List[str]:
        with pdfplumber.open(file_path) as pdf:
            pages = [page.extract_text() or "" for page in pdf.pages]
            return ["\n".join(pages[i:i + BLOCK_SIZE]) for i in range(0, len(pages), BLOCK_SIZE)]

    def _chunk_text(self, text: str) -> List[str]:
        paras = text.split("\n\n")
        return ["\n\n".join(paras[i:i + BLOCK_SIZE]) for i in range(0, len(paras), BLOCK_SIZE)]

    def _chunk_docx(self, file_path: str) -> List[str]:
        document = Document(file_path)
        paragraphs = [p.text for p in document.paragraphs if p.text.strip()]
        return ["\n\n".join(paragraphs[i:i + BLOCK_SIZE]) for i in range(0, len(paragraphs), BLOCK_SIZE)]

    def _handle_image(self, file_path: str) -> str:
        result = self.ocr_reader.readtext(file_path, detail=0)  # Extract text without bounding box details
        text = '\n'.join(result)
        return text if len(text.split()) > 10 else f"[IMAGE]{file_path}"

    def _store_in_chromadb(self, file_path: str, preprocessed_data: List[str], metadata: Dict[str, Any]):
        """
        Store preprocessed data and metadata in ChromaDB.
        :param file_path: Path to the file.
        :param preprocessed_data: Preprocessed data to store.
        :param metadata: Metadata about the file.
        """
        for i, chunk in enumerate(preprocessed_data):
            self.collection.add(
                documents=[chunk],
                ids=[f"{file_path}_chunk_{i}"],
                metadatas=[{**metadata, "chunk_index": i}]
            )

    def query_repository(self, query: str) -> List[Dict[str, Any]]:
        """
        Query the repository to retrieve structured data based on the user's query.
        :param query: The user's query.
        :return: List of matching documents with metadata.
        """
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=5  # Retrieve top 5 results
            )
            return results
        except Exception as e:
            raise RuntimeError(f"Error querying repository: {e}")


# LangGraph Integration
def interface_agent(state: Dict[str, Any]):
    """
    Interface agent to handle user input and determine the next action.
    """
    if state.get("invoke") == "preprocess":
        agent = PreprocessingAgent()
        file_paths = state.get("file_paths", [])
        repository = agent.preprocess_repository(file_paths)
        state["repository"] = repository
        state["invoke"] = "query"
        return {"next_nodes": ["query_agent"], "state": state}

    if state.get("invoke") == "query":
        agent = PreprocessingAgent()
        query = state.get("query", "")
        results = agent.query_repository(query)
        state["results"] = results
        state["invoke"] = "done"
        return {"next_nodes": [END], "state": state}

    return {"next_nodes": [END], "state": state}


class SessionState(TypedDict):
    invoke: str
    file_paths: List[str]
    query: str
    repository: Dict[str, Any]
    results: List[Dict[str, Any]]

graph_builder = StateGraph(SessionState)  # Pass the state schema here
graph_builder.add_node("interface_agent", interface_agent)
graph_builder.set_entry_point("interface_agent")
graph = graph_builder.compile()

# Example Usage
if __name__ == "__main__":
    sample_state = {
        "invoke": "preprocess",
        "file_paths": ["pdf.pdf", "image.png"],
        "query": "Extract event name and date from the documents."
    }
    output = graph.invoke(sample_state)
    print("Final Output:", json.dumps(output, indent=2))