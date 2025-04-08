from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import csv

class CsvToMarkdownInput(BaseModel):
    """Input schema for CsvToMarkdownTool."""
    file_path: str = Field(..., description="Path to the CSV file.")

class CsvToMarkdownTool(BaseTool):
    name: str = "csv_to_markdown"
    description: str = "Converts a CSV file to a Markdown table."
    args_schema: type = CsvToMarkdownInput

    def _run(self, file_path: str) -> str:
        with open(file_path, newline='') as csvfile:
            reader = csv.reader(csvfile)
            rows = list(reader)
        
        markdown_table = []
        for i, row in enumerate(rows):
            markdown_table.append("| " + " | ".join(row) + " |")
            if i == 0:  # Add header separator
                markdown_table.append("|" + " --- |" * len(row))
        return "\n".join(markdown_table)
