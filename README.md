# DocuThing Crew

A powerful document processing and query system powered by CrewAI and Large Language Models.

## 📑 Overview

DocuThing Crew is an intelligent document management and query system that can process multiple file formats (PDF, DOCX, Images, Text, CSV), extract their content, store it in a vector database, and provide accurate answers to user queries based solely on the document content.

## ✨ Features

- **Multi-format document processing**: Handles PDF, DOCX, images (via OCR), plain text, and CSV files
- **Intelligent query processing**: Understands user queries and retrieves relevant information
- **Vector database storage**: Uses ChromaDB for efficient document storage and retrieval
- **Source attribution**: All answers include references to the exact source files used
- **Specialized agent system**: Utilizes a crew of specialized AI agents for each task

## 🏗️ Architecture

The system is built using the CrewAI framework with specialized agents:

### Document Processing Agents
- **File Type Classifier**: Determines the type of uploaded files
- **PDF Processor**: Extracts and cleans content from PDF files
- **DOCX Processor**: Handles Microsoft Word documents
- **Image OCR Agent**: Extracts text from images using OCR
- **Text File Processor**: Processes plain text files
- **CSV Processor**: Converts CSV data into markdown tables

### Query Processing Agents
- **Store Agent**: Manages ChromaDB storage operations
- **Query Classifier**: Categorizes user queries for better processing
- **Schema Generator**: Creates retrieval plans for answering queries
- **Retrieval Agent**: Extracts relevant information from documents
- **Synthesis Agent**: Creates comprehensive answers from retrieved information

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/docuthing-crew.git
cd docuthing-crew

# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## ⚙️ Configuration

1. Make sure you have appropriate API keys set in your environment:
```bash
export GEMINI_API_KEY=your_api_key_here
```

2. Configure ChromaDB settings (if applicable) in your environment variables.

## 🚀 Usage

### Document Processing

```python
from crews.document_crew import DocumentCrew

# Initialize the document processing crew
doc_crew = DocumentCrew()

# Process a document
result = doc_crew.process("/path/to/document.pdf")
print(f"Document processed and stored with ID: {result['document_id']}")
```

### Query Processing

```python
from crews.query_crew import QueryCrew

# Initialize the query processing crew
query_crew = QueryCrew()

# Ask a question about your documents
answer = query_crew.ask("What are the key points in the quarterly report?")
print(answer)
```

## 📚 Dependencies

- CrewAI
- Gemini AI (gemini-2.0-flash)
- ChromaDB 
- Python 3.9+
- Various document processing libraries (PyPDF2, python-docx, pytesseract, etc.)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
