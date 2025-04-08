# utils/ocr.py
import pytesseract
from PIL import Image
import io

def extract_text_from_image(image_bytes: bytes) -> str:
    """
    Extract text from an image using Tesseract OCR.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        return f"Error extracting text: {str(e)}"
