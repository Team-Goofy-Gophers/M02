from crewai import Agent, LLM
import os

llm = LLM(model="gemini/gemini-2.0-flash")


file_classifier = Agent(
    role="File Type Classifier",
    goal="Determine the type of file (PDF, DOCX, Image, Text, CSV) to decide processing path",
    backstory="You are a smart classifier responsible for understanding file types based on their names and content.",
    verbose=True,
    llm=llm
)

pdf_agent = Agent(
    role="PDF Processor",
    goal="Extract and clean content from PDF files",
    backstory="You are skilled at parsing PDF documents and turning them into readable markdown.",
    verbose=True,
    llm=llm
)

docx_agent = Agent(
    role="DOCX Processor",
    goal="Extract content from DOCX files and convert it to clean markdown",
    backstory="You handle Microsoft Word files and structure them in markdown for easy querying.",
    verbose=True,
    llm=llm
)

image_agent = Agent(
    role="Image OCR Agent",
    goal="Extract text from image files using OCR and prepare it for storage",
    backstory="You specialize in understanding scanned images or screenshots by converting them into usable text.",
    verbose=True,
    llm=llm
)

text_agent = Agent(
    role="Text File Processor",
    goal="Handle plain .txt files and format them into clean markdown",
    backstory="You deal with raw text and organize it for analysis.",
    verbose=True,
    llm=llm
)

csv_agent = Agent(
    role="CSV Processor",
    goal="Parse CSV files and convert their data into markdown tables",
    backstory="You are an expert in handling structured tabular data from CSVs.",
    verbose=True,
    llm=llm
)

store_agent = Agent(
    role="ChromaDB Storage Agent",
    goal="Store markdown content in the right namespace in ChromaDB",
    backstory="You're responsible for storing processed data in a vector DB for efficient retrieval.",
    verbose=True,
    llm=llm
)

query_classifier = Agent(
    role="Query Classifier",
    goal="Analyze the user's query and categorize it for better downstream processing",
    backstory="You determine what type of question a user is asking to guide retrieval logic.",
    verbose=True,
    llm=llm
)

schema_agent = Agent(
    role="Schema Generator",
    goal="Create a plan or schema to fulfill the query",
    backstory="You work with Gemini to break the query down into what data is needed and how it should be used.",
    verbose=True,
    llm=llm
)

retrieval_agent = Agent(
    role="Data Retriever",
    goal="Retrieve information ONLY from the explicitly provided document sources",
    backstory="You examine the provided documents and extract relevant information. You NEVER reference documents that aren't in the authorized source list.",
    verbose=True,
    llm=llm
)

synthesis_agent = Agent(
    role="Answer Synthesizer",
    goal="Create answers using ONLY the provided documents and ONLY reference the exact authorized file names",
    backstory="You synthesize answers based on the retrieved documents. In your 'Files Used:' section, you ONLY list files from the authorized source list. You NEVER mention files that aren't in this list.",
    verbose=True,
    llm=llm
)