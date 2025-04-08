from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import docx

class DocxToMarkdownInput(BaseModel):
    """Input schema for DocxToMarkdownTool."""
    file_path: str = Field(..., description="Path to the DOCX file.")

class DocxToMarkdownTool(BaseTool):
    name: str = "docx_to_markdown"
    description: str = "Converts a DOCX file to Markdown format."
    args_schema: type = DocxToMarkdownInput

    def _run(self, file_path: str) -> str:
        doc = docx.Document(file_path)
        markdown_content = []
        for paragraph in doc.paragraphs:
            markdown_content.append(paragraph.text)
        return "\n\n".join(markdown_content)
