from crewai import Task
from agents import query_classifier, schema_agent, retrieval_agent, synthesis_agent
from utils.chromadb_utils import retrieve_markdown_chunks

# Input: query string and chat_id for context filtering
def create_query_tasks(query: str, chat_id: str):
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
            }
        ]
    )

    schema_task = Task(
        description=f"Generate a structured schema/plan for answering: '{query}'",
        expected_output="Schema outlining what info is needed and how to fetch/format it",
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
            }
        ]
    )

    # Pre-fetch documents for debugging and direct use
    print("\n🔄 Pre-fetching documents for debugging...")
    documents, metadatas, error_message = retrieve_markdown_chunks(chat_id, query)
    
    # Include pre-fetched documents in the task context
    debug_info = {
        "documents_found": len(documents),
        "document_sources": [m.get("source", "unknown") for m in metadatas] if metadatas else [],
        "error_message": error_message
    }
    
    retrieval_task = Task(
        description=f"Retrieve relevant documents for: '{query}' from chat {chat_id}",
        expected_output="Chunks of relevant markdown text from ChromaDB, along with their source file names. If no relevant information is found, report this clearly.",
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
                "key": "pre_fetched_debug", 
                "value": str(debug_info),
                "description": "Debug information from pre-fetched documents", 
                "expected_output": "Debug information"
            }
        ]
    )

    synthesis_task = Task(
        description=f"Synthesize answer to: '{query}'. Also, identify the files used to generate the answer and rank them based on their contribution to the result.",
        expected_output="Final structured output/answer, along with a ranked list of source files.",
        agent=synthesis_agent,
        async_execution=False,
        context=[
            {
                "key": "query", 
                "value": query, 
                "description": "User query to synthesize answer for", 
                "expected_output": "Final answer"
            },
            {
                "key": "chat_id", 
                "value": chat_id,
                "description": "Chat session identifier", 
                "expected_output": "Session tracking ID"
            },
            {
                "key": "debug_info", 
                "value": str(debug_info),
                "description": "Debug information about document retrieval", 
                "expected_output": "Debug information"
            }
        ]
    )

    return [classify_task, schema_task, retrieval_task, synthesis_task]