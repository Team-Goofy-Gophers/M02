from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import pytesseract
from PIL import Image

class ImageToMarkdownInput(BaseModel):
    """Input schema for ImageToMarkdownTool."""
    file_path: str = Field(..., description="Path to the image file.")

class ImageToMarkdownTool(BaseTool):
    name: str = "image_to_markdown"
    description: str = "Extracts text from an image file and converts it to Markdown format."
    args_schema: type = ImageToMarkdownInput

    def _run(self, file_path: str) -> str:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        return text
