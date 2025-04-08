from crewai import Task
from agents import query_classifier, schema_agent, retrieval_agent, synthesis_agent
from utils.chromadb_utils import retrieve_markdown_chunks
import json

# Input: query string and chat_id for context filtering
def create_query_tasks(query: str, chat_id: str):
    # Pre-fetch documents for debugging and direct use
    print("\n🔄 Pre-fetching documents for query debugging...")
    documents, metadatas, error_message = retrieve_markdown_chunks(chat_id, query, n_results=10)
    
    # Extract and validate actual source document names
    actual_sources = []
    for metadata in metadatas:
        source = metadata.get("source", "unknown")
        if source not in actual_sources:
            actual_sources.append(source)
    
    # Create document-source pairs with explicit validation
    formatted_docs = []
    for i, (doc, meta) in enumerate(zip(documents, metadatas)):
        source = meta.get("source", "unknown")
        formatted_docs.append(f"===== DOCUMENT {i+1} =====\nSOURCE FILE: {source}\n\nCONTENT:\n{doc}\n\n")
    
    # Join formatted documents with clear separators
    all_docs_text = "\n\n".join(formatted_docs)
    
    # Strict source list as a separate context item
    strict_source_list = "AUTHORIZED SOURCE FILES (ONLY these may be referenced):\n" + "\n".join([f"- {s}" for s in actual_sources])
    
    # Include pre-fetched documents in the task context
    debug_info = {
        "documents_found": len(documents),
        "document_sources": actual_sources,
        "error_message": error_message,
    }
    print(f"Debug info: {debug_info}")
    
    # Start with query classification
    classify_task = Task(
        description=f"Classify the query: '{query}'",
        expected_output="Type of query (e.g., factual, comparative, summary, tabular, etc.)",
        agent=query_classifier,
        async_execution=False,
        context=[
            {
                "key": "query", 
                "value": query, 
                "description": "User query to be classified", 
                "expected_output": "Query type"
            },
            {
                "key": "chat_id", 
                "value": chat_id,
                "description": "Chat session identifier", 
                "expected_output": "Session tracking ID"
            },
            {
                "key": "available_sources", 
                "value": str(actual_sources),
                "description": "List of available document sources", 
                "expected_output": "Available document sources"
            }
        ]
    )

    # Retrieval task with explicit source validation
    retrieval_task = Task(
        description=f"Retrieve relevant documents for: '{query}'. ONLY reference documents from this EXACT list of authorized sources: {actual_sources}",
        expected_output="Relevant document chunks with their exact source filenames",
        agent=retrieval_agent,
        async_execution=False,
        context=[
            {
                "key": "query", 
                "value": query, 
                "description": "User query to retrieve documents for", 
                "expected_output": "Relevant document chunks or error message"
            },
            {
                "key": "chat_id", 
                "value": chat_id,
                "description": "Chat session identifier", 
                "expected_output": "Session tracking ID"
            },
            {
                "key": "strict_source_list",
                "value": strict_source_list,
                "description": "The ONLY file sources that may be referenced - no exceptions",
                "expected_output": "Verified source list"
            },
            {
                "key": "document_content",
                "value": all_docs_text,
                "description": "Pre-fetched document content with sources",
                "expected_output": "Document content with sources"
            }
        ],
        dependencies=[classify_task]
    )

    # Synthesis task with strict source validation
    synthesis_task = Task(
    description=f"""
    Synthesize a response to the query: '{query}'.

    ⚠️ IMPORTANT:
    - You MUST only use the content provided in the 'docs' context below.
    - DO NOT use any external or prior knowledge not found in the provided documents.
    - Cite source filenames (if relevant) from the AUTHORIZED SOURCE LIST ONLY: {actual_sources}
    """,
    expected_output="A precise, accurate answer based only on the fetched document content",
    agent=synthesis_agent,
    async_execution=False,
    context=[
        {
            "key": "query",
            "value": query,
            "description": "The original query to be answered",
            "expected_output": "A restatement or refined version of the query"
        },
        {
            "key": "docs",
            "value": all_docs_text,
            "description": "The full content of documents retrieved from the database",
            "expected_output": "Chunks of text relevant to the query"
        },
        {                
            "key": "authorized_sources",
            "value": "\n".join(actual_sources),
            "description": "The only files allowed to be referenced",
            "expected_output": "List of filenames"
        }
    ]
)

    
    if "complex" in query.lower() or "compare" in query.lower() or "analyze" in query.lower() or "statistics" in query.lower():
        schema_task = Task(
            description=f"Generate a structured schema for answering: '{query}'",
            expected_output="Schema outlining what info is needed",
            agent=schema_agent,
            async_execution=False,
            context=[
                {
                    "key": "query", 
                    "value": query, 
                    "description": "User query to create schema for", 
                    "expected_output": "Answer schema"
                },
                {
                    "key": "chat_id", 
                    "value": chat_id,
                    "description": "Chat session identifier", 
                    "expected_output": "Session tracking ID"
                },
                {
                    "key": "available_sources",
                    "value": str(actual_sources),
                    "description": "Available document sources",
                    "expected_output": "Available document sources"
                }
            ],
            dependencies=[classify_task]
        )
        return [classify_task, schema_task, retrieval_task, synthesis_task]
    else:
        # For simple queries, skip schema generation
        return [classify_task, retrieval_task, synthesis_task]