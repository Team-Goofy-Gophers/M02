import chromadb
from chromadb.config import Settings
from chromadb.utils.embedding_functions import GoogleGenerativeAiEmbeddingFunction
import os

CHROMA_DIR = os.getenv("CHROMA_DIR", "./chroma")
# Use the dedicated API key for ChromaDB embeddings
GOOGLE_API_KEY = os.getenv("CHROMA_GOOGLE_GENAI_API_KEY", os.getenv("GEMINI_API_KEY"))

embedding_fn = GoogleGenerativeAiEmbeddingFunction(api_key=GOOGLE_API_KEY)


def get_chroma_client():
    return chromadb.Client(Settings(persist_directory=CHROMA_DIR))


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
        print(f"\n📃 Retrieving data for query: {query}")
        print(f"🔍 Looking in collection: {chat_id}")
        
        # Get all collections and check if our chat_id exists
        collections = client.list_collections()
        collection_names = [c.name for c in collections]
        print(f"📚 Available collections: {collection_names}")
        
        if chat_id not in collection_names:
            return [], [], f"No documents found in collection '{chat_id}'. Please upload documents first."
            
        collection = client.get_collection(name=chat_id, embedding_function=embedding_fn)
        
        # Get counts of documents in collection
        count = collection.count()
        print(f"📊 Found {count} documents in collection '{chat_id}'")
        
        # First, get all documents to show what's available
        all_docs = collection.get()
        print(f"📄 All available documents: {[metadata['source'] for metadata in all_docs.get('metadatas', [])]}")
        
        # Now perform the query
        results = collection.query(query_texts=[query], n_results=n_results)
        documents = results.get("documents", [[]])
        metadatas = results.get("metadatas", [[]])
        
        print("\n🔎 Retrieved documents:")
        for i, (doc, meta) in enumerate(zip(documents[0], metadatas[0])):
            print(f"\n📑 Document {i+1} from {meta.get('source')}:")
            print(f"{doc[:200]}..." if len(doc) > 200 else doc)
        
        # Check if any meaningful results were found
        if not documents[0] or all(not doc.strip() for doc in documents[0]):
            return [], [], "No relevant information was found in the uploaded documents."
            
        return documents[0], metadatas[0], None
    except Exception as e:
        # Handle case where collection doesn't exist (no documents uploaded)
        print(f"❌ Error during retrieval: {str(e)}")
        if "Collection not found" in str(e):
            return [], [], f"No documents found in collection '{chat_id}'. Please upload documents first."
        return [], [], f"Error retrieving documents: {str(e)}"