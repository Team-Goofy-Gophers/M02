import pytesseract
from PIL import Image

def process_image(file_path: str) -> str:
    img = Image.open(file_path)
    text = pytesseract.image_to_string(img)
    return f"""### Image OCR Extracted Text\n\n{text.strip()}"""
    