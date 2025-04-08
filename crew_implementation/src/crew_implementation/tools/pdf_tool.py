from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from PyPDF2 import PdfReader

class PdfToMarkdownInput(BaseModel):
    """Input schema for PdfToMarkdownTool."""
    file_path: str = Field(..., description="Path to the PDF file.")

class PdfToMarkdownTool(BaseTool):
    name: str = "pdf_to_markdown"
    description: str = "Extracts text from a PDF file and converts it to Markdown format."
    args_schema: type = PdfToMarkdownInput

    def _run(self, file_path: str) -> str:
        reader = PdfReader(file_path)
        markdown_content = []
        for page in reader.pages:
            markdown_content.append(page.extract_text())
        return "\n\n".join(markdown_content)
