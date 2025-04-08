from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import openpyxl

class XlsxToMarkdownInput(BaseModel):
    """Input schema for XlsxToMarkdownTool."""
    file_path: str = Field(..., description="Path to the Excel file.")

class XlsxToMarkdownTool(BaseTool):
    name: str = "xlsx_to_markdown"
    description: str = "Converts an Excel file to a Markdown table."
    args_schema: type = XlsxToMarkdownInput

    def _run(self, file_path: str) -> str:
        workbook = openpyxl.load_workbook(file_path)
        sheet = workbook.active
        markdown_table = []
        for i, row in enumerate(sheet.iter_rows(values_only=True)):
            markdown_table.append("| " + " | ".join(map(str, row)) + " |")
            if i == 0:  # Add header separator
                markdown_table.append("|" + " --- |" * len(row))
        return "\n".join(markdown_table)
