#!/usr/bin/env python
import os
import sys
import warnings
from datetime import datetime
from pathlib import Path
import json

from dotenv import load_dotenv
load_dotenv() 

# Change this import to use your local module
from crew.main_crew import CrewFactory

# Define constants
UPLOAD_DIR = "uploads"
CHAT_ID = "chat_001"

def run_ingestion():
    """
    Process all files in the upload directory.
    """
    ingested_files = []
    
    for file in os.listdir(UPLOAD_DIR):
        file_path = os.path.join(UPLOAD_DIR, file)
        if os.path.isfile(file_path):
            print(f"\n📥 Ingesting: {file}")
            try:
                # Import and use the appropriate tool directly
                ext = os.path.splitext(file_path)[1].lower()
                
                if ext == ".pdf":
                    from tools.pdf_tool import process_pdf
                    markdown = process_pdf(file_path)
                elif ext == ".docx":
                    from tools.docx_tool import process_docx
                    markdown = process_docx(file_path)
                elif ext == ".txt":
                    from tools.text_tool import process_text
                    markdown = process_text(file_path)
                elif ext == ".csv":
                    from tools.csv_tool import process_csv
                    markdown = process_csv(file_path)
                elif ext in [".jpg", ".jpeg", ".png"]:
                    from tools.image_tool import process_image
                    markdown = process_image(file_path)
                else:
                    print(f"❌ Unsupported file type: {ext}")
                    continue
                
                # Store the markdown in ChromaDB
                from utils.chromadb_utils import store_markdown
                # Use the correct parameter order: chat_id, doc_id, markdown_text
                doc_id = os.path.basename(file_path)
                store_markdown(CHAT_ID, doc_id, markdown)
                
                print("✅ Ingestion complete.")
                print(markdown[:200] + "..." if len(markdown) > 200 else markdown)
                
                ingested_files.append(file)
                
            except Exception as e:
                print(f"❌ Ingestion failed: {e}")
                
    if ingested_files:
        print(f"\n📚 Successfully ingested {len(ingested_files)} files:")
        for file in ingested_files:
            print(f"  - {file}")
    else:
        print("\n⚠️ No files were ingested.")

def list_db_contents():
    """
    List all collections and documents in the ChromaDB.
    """
    try:
        from utils.chromadb_utils import get_chroma_client
        client = get_chroma_client()
        collections = client.list_collections()
        
        if not collections:
            print("\n⚠️ No collections found in the database.")
            return
            
        print(f"\n📊 Found {len(collections)} collections in the database:")
        
        for collection in collections:
            try:
                coll = client.get_collection(collection.name)
                count = coll.count()
                print(f"\n📁 Collection '{collection.name}': {count} documents")
                
                if count > 0:
                    # Get all documents in this collection
                    all_docs = coll.get()
                    metadatas = all_docs.get("metadatas", [])
                    ids = all_docs.get("ids", [])
                    
                    print("  Documents:")
                    for i, (doc_id, metadata) in enumerate(zip(ids, metadatas)):
                        source = metadata.get("source", "unknown")
                        print(f"    {i+1}. {source} (ID: {doc_id})")
            except Exception as e:
                print(f"  ❌ Error accessing collection '{collection.name}': {e}")
    except Exception as e:
        print(f"\n❌ Error listing database contents: {e}")

def run_query():
    """
    Run a query against the knowledge base.
    """
    # First, list what's in the database
    list_db_contents()
    
    while True:
        query = input("\n🧠 Ask a question (or type 'exit' to return to menu): ")
        if not query.strip():
            continue
            
        if query.lower() == 'exit':
            return
        
        print("\n🔍 Processing your query...")
        try:
            # First, do a direct test retrieval for debugging
            from utils.chromadb_utils import retrieve_markdown_chunks
            from utils.source_validator import validate_sources
            
            print("\n🔬 Debug retrieval before crew processing:")
            docs, metas, error = retrieve_markdown_chunks(CHAT_ID, query)
            
            # Extract actual sources for validation
            actual_sources = []
            for meta in metas:
                source = meta.get("source", "unknown")
                if source not in actual_sources:
                    actual_sources.append(source)
            
            if error:
                print(f"⚠️ Debug retrieval encountered an error: {error}")
            else:
                print(f"✅ Debug retrieval found {len(docs)} documents")
                print("\n📄 Document sources:")
                for i, meta in enumerate(metas):
                    print(f"  {i+1}. {meta.get('source', 'unknown')}")
                print("\n📝 First document preview:")
                if docs:
                    preview = docs[0][:200] + "..." if len(docs[0]) > 200 else docs[0]
                    print(preview)
            
            # Check if we're just debugging or actually running the query
            if "--debug-only" in query:
                continue
                
            # Now proceed with the crew-based processing
            print("\n⏳ Starting crew processing with pre-fetched data...")
            factory = CrewFactory()
            crew = factory.create_query_crew(query, CHAT_ID)
            
            # Add explicit debugging statement
            print("\n📤 Sending data to crew agents...")
            
            result = crew.kickoff()
            
            # Add validation step after getting result
            if not "No relevant information was found" in result and not "No documents found" in result:
                is_valid, corrected_result = validate_sources(result, actual_sources)
                if not is_valid:
                    print("\n⚠️ Found unauthorized sources in response. Correcting...")
                    result = corrected_result
                    
                print("\n💡 Final Answer:\n", result)

                # Extract file attributions from the result
                if "Files Used:" in result:
                    files_used_section = result.split("Files Used:")[1].strip()
                    ranked_files = [file.strip() for file in files_used_section.split("\n") if file.strip()]

                    print("\n📚 Files Used (Ranked):")
                    for i, file in enumerate(ranked_files):
                        print(f"{i+1}. {file}")
                else:
                    print("\nℹ️  File attribution data not found in the answer.")

        except Exception as e:
            print(f"❌ Query failed: {e}")
            import traceback
            traceback.print_exc()

def view_file_content():
    """
    View the entire content of a specific file in the database.
    """
    try:
        from utils.chromadb_utils import get_chroma_client
        client = get_chroma_client()
        collections = client.list_collections()
        
        if not collections:
            print("\n⚠️ No collections found in the database.")
            return
            
        # List collections for selection
        print("\n📁 Available collections:")
        for idx, collection in enumerate(collections):
            print(f"  {idx+1}. {collection.name}")
        
        # Select collection
        while True:
            try:
                coll_idx = input("\nSelect collection number (or 'back' to return): ")
                if coll_idx.lower() == 'back':
                    return
                    
                coll_idx = int(coll_idx) - 1
                if 0 <= coll_idx < len(collections):
                    selected_collection = collections[coll_idx]
                    break
                else:
                    print("❌ Invalid selection. Please try again.")
            except ValueError:
                print("❌ Please enter a valid number.")
        
        # Get documents in the selected collection
        try:
            coll = client.get_collection(selected_collection.name)
            count = coll.count()
            
            if count == 0:
                print(f"\n⚠️ Collection '{selected_collection.name}' is empty.")
                return
                
            # Display documents in the collection
            all_docs = coll.get()
            metadatas = all_docs.get("metadatas", [])
            ids = all_docs.get("ids", [])
            documents = all_docs.get("documents", [])
            
            print(f"\n📄 Documents in '{selected_collection.name}':")
            for i, (doc_id, metadata) in enumerate(zip(ids, metadatas)):
                source = metadata.get("source", "unknown")
                print(f"  {i+1}. {source} (ID: {doc_id})")
            
            # Select document to view
            while True:
                try:
                    doc_idx = input("\nSelect document number to view content (or 'back' to return): ")
                    if doc_idx.lower() == 'back':
                        return
                        
                    doc_idx = int(doc_idx) - 1
                    if 0 <= doc_idx < len(ids):
                        # Display full content of the selected document
                        print("\n" + "="*80)
                        print(f"📝 Full content of '{metadatas[doc_idx].get('source', 'unknown')}':")
                        print("="*80)
                        print(documents[doc_idx])
                        print("="*80)
                        
                        input("\nPress Enter to continue...")
                        break
                    else:
                        print("❌ Invalid selection. Please try again.")
                except ValueError:
                    print("❌ Please enter a valid number.")
                    
        except Exception as e:
            print(f"\n❌ Error accessing collection: {str(e)}")
    except Exception as e:
        print(f"\n❌ Error listing database contents: {str(e)}")

if __name__ == "__main__":
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    while True:
        print("""
        =========================================
                        DocuThing
        =========================================
        1. Ingest documents
        2. Query the knowledge base
        3. View database contents
        4. View file content
        5. Exit
        """)

        choice = input("Enter your choice (1-5): ")
        
        if choice == '1':
            run_ingestion()
        elif choice == '2':
            run_query()
        elif choice == '3':
            list_db_contents()
        elif choice == '4':
            view_file_content()
        elif choice == '5':
            print("Goodbye!")
            break
        else:
            print("Invalid choice, please try again.")