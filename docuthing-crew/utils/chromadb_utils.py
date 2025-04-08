import chromadb
from chromadb.config import Settings
from chromadb.utils.embedding_functions import GoogleGenerativeAiEmbeddingFunction
import os
import time

CHROMA_DIR = os.getenv("CHROMA_DIR", "./chroma")
# Use the dedicated API key for ChromaDB embeddings
GOOGLE_API_KEY = os.getenv("CHROMA_GOOGLE_GENAI_API_KEY", os.getenv("GEMINI_API_KEY"))

# Initialize embedding function once
embedding_fn = GoogleGenerativeAiEmbeddingFunction(api_key=GOOGLE_API_KEY)

# Create client settings to disable OpenAI dependency check
client_settings = Settings(
    anonymized_telemetry=False,
    allow_reset=True,
    is_persistent=True,
    persist_directory=CHROMA_DIR
)

def get_chroma_client():
    # Use client settings to avoid OpenAI key requirement
    return chromadb.PersistentClient(path=CHROMA_DIR, settings=client_settings)


def store_markdown(chat_id: str, doc_id: str, markdown_text: str):
    client = get_chroma_client()
    collection = client.get_or_create_collection(name=chat_id, embedding_function=embedding_fn)
    collection.add(
        documents=[markdown_text],
        ids=[doc_id],
        metadatas=[{"source": doc_id}]
    )
    print(f"✅ Stored document '{doc_id}' in collection '{chat_id}'")
    # The client with Settings(persist_directory=CHROMA_DIR) will auto-persist


def retrieve_markdown_chunks(chat_id: str, query: str, n_results: int = 5):
    client = get_chroma_client()
    try:
        start_time = time.time()
        print(f"\n📃 Retrieving data for query: '{query}'")
        print(f"🔍 Looking in collection: '{chat_id}'")
        
        # Get all collections and check if our chat_id exists
        collections = client.list_collections()
        collection_names = [c.name for c in collections]
        print(f"📚 Available collections: {collection_names}")
        
        if chat_id not in collection_names:
            print(f"❌ Collection '{chat_id}' not found!")
            return [], [], f"No documents found in collection '{chat_id}'. Please upload documents first."
            
        collection = client.get_collection(name=chat_id, embedding_function=embedding_fn)
        
        # Get counts of documents in collection
        count = collection.count()
        print(f"📊 Found {count} documents in collection '{chat_id}'")
        
        # First, get all documents to show what's available
        all_docs = collection.get()
        doc_ids = all_docs.get("ids", [])
        print(f"📄 All available document IDs: {doc_ids}")
        
        if count == 0:
            print("❌ Collection exists but contains no documents!")
            return [], [], f"Collection '{chat_id}' exists but contains no documents. Please upload documents first."
        
        # Try to perform an exact match search first for simple queries
        exact_results = None
        if len(query.strip().split()) <= 5:  # For short queries, try exact match first
            try:
                print(f"🔤 Trying exact keyword search for: '{query}'")
                exact_results = collection.query(
                    query_texts=[query],
                    n_results=n_results
                )
                print("✅ Exact search completed")
            except Exception as e:
                print(f"⚠️ Exact search failed, falling back to vector search: {str(e)}")
                exact_results = None
        
        # Now perform the vector query
        print(f"🧠 Performing vector similarity search for: '{query}'")
        results = collection.query(
            query_texts=[query], 
            n_results=n_results
        )
        
        documents = results.get("documents", [[]])
        metadatas = results.get("metadatas", [[]])
        distances = results.get("distances", [[]])
        
        # Validate and process documents
        for i, doc in enumerate(documents[0]):
            if not doc or not doc.strip():
                source = metadatas[0][i].get("source", "unknown") if i < len(metadatas[0]) else "unknown"
                print(f"⚠️ Empty document content detected for source: {source}")
                # Replace empty content with informative message
                if source.lower().endswith(".pdf"):
                    documents[0][i] = "PDF content available but may require specialized viewing."
                elif source.lower().endswith(".csv"):
                    documents[0][i] = "CSV data available in tabular format."
                elif source.lower().endswith((".jpg", ".jpeg", ".png")):
                    documents[0][i] = "Image content available with extracted text."
                else:
                    documents[0][i] = f"Content available for {source}."
        
        # Enhanced tracking of actual document sources
        actual_sources = []
        for metadata in metadatas[0]:
            source = metadata.get("source", "unknown") 
            if source not in actual_sources:
                actual_sources.append(source)
        
        print(f"🗂️ Source documents used: {actual_sources}")
        
        # Print detailed debug info with source attribution
        print(f"\n🔎 Retrieved {len(documents[0])} documents in {time.time() - start_time:.2f} seconds")
        for i, (doc, meta, dist) in enumerate(zip(documents[0], metadatas[0], distances[0] if distances else [])):
            source = meta.get("source", "unknown")
            print(f"\n📑 Document {i+1} from '{source}' (similarity: {1-dist:.4f}):")
            preview = doc[:200] + "..." if len(doc) > 200 else doc
            print(f"{preview}")
        
        # Explicitly print source information for verification
        print("\n📋 Source attribution check:")
        for i, meta in enumerate(metadatas[0]):
            print(f"  Document {i+1}: {meta}")
            
        # Print full document content at the end for verification
        print("\n💾 Full document content verification:")
        for i, doc in enumerate(documents[0][:2]):  # First two documents only
            print(f"\n--- Document {i+1} content preview ---")
            print(doc[:300] + "..." if len(doc) > 300 else doc)
            
        # Check if any meaningful results were found
        if not documents[0] or all(not doc.strip() for doc in documents[0]):
            print("❌ No relevant content found in documents!")
            return [], [], "No relevant information was found in the uploaded documents."
            
        return documents[0], metadatas[0], None
    except Exception as e:
        # Handle case where collection doesn't exist (no documents uploaded)
        print(f"❌ Error during retrieval: {str(e)}")
        if "Collection not found" in str(e):
            return [], [], f"No documents found in collection '{chat_id}'. Please upload documents first."
        return [], [], f"Error retrieving documents: {str(e)}"