# tasks/ingestion_tasks.py
from crewai import Task
from agents import (
    file_classifier, pdf_agent, docx_agent, image_agent,
    text_agent, csv_agent, store_agent
)
from tools import (
    process_pdf, process_docx, process_image,
    process_text, process_csv
)
import os

# Dispatch based on extension
def get_preprocessor(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    return {
        ".pdf": (pdf_agent, process_pdf),
        ".docx": (docx_agent, process_docx),
        ".png": (image_agent, process_image),
        ".jpg": (image_agent, process_image),
        ".jpeg": (image_agent, process_image),
        ".txt": (text_agent, process_text),
        ".csv": (csv_agent, process_csv),
    }.get(ext, (None, None))

# Ingestion pipeline

def create_ingestion_tasks(file_path: str, chat_id: str):
    agent, processor = get_preprocessor(file_path)
    if not agent or not processor:
        raise ValueError(f"Unsupported file type: {file_path}")

    markdown = processor(file_path)

    process_task = Task(
        description=f"Convert file {os.path.basename(file_path)} into Markdown.",
        expected_output="Cleaned and readable markdown.",
        agent=agent,
        async_execution=False,
        context=[
            {
                "key": "markdown", 
                "value": markdown, 
                "description": "Raw markdown content from file", 
                "expected_output": "Processed content"
            }, 
            {
                "key": "chat_id", 
                "value": chat_id,
                "description": "Chat session identifier", 
                "expected_output": "Session tracking ID"
            }
        ]
    )

    store_task = Task(
        description=f"Store the markdown in ChromaDB under chat {chat_id}.",
        expected_output="Acknowledgement of successful storage",
        agent=store_agent,
        async_execution=False,
        context=[
            {
                "key": "markdown", 
                "value": markdown, 
                "description": "Markdown to be stored", 
                "expected_output": "Content for database"
            }, 
            {
                "key": "chat_id", 
                "value": chat_id,
                "description": "Chat session identifier", 
                "expected_output": "Database namespace"
            }
        ]
    )

    return [process_task, store_task]
