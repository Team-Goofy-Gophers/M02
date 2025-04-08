from crewai.tools import BaseTool
from pydantic import BaseModel, Field

class PlaintextToMarkdownInput(BaseModel):
    """Input schema for PlaintextToMarkdownTool."""
    file_path: str = Field(..., description="Path to the plain text file.")

class PlaintextToMarkdownTool(BaseTool):
    name: str = "plaintext_to_markdown"
    description: str = "Reads a plain text file and returns its content as Markdown."
    args_schema: type = PlaintextToMarkdownInput

    def _run(self, file_path: str) -> str:
        with open(file_path, 'r') as file:
            return file.read()
