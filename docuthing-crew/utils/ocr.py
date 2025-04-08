# utils/ocr.py
import pytesseract
from PIL import Image
import io
import os
import fitz  # PyMuPDF for PDF handling
import pandas as pd
import csv

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

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text directly from PDF files using PyMuPDF.
    """
    try:
        text = ""
        # Open the PDF
        with fitz.open(file_path) as pdf_doc:
            # Process each page
            for page_num in range(len(pdf_doc)):
                page = pdf_doc[page_num]
                text += page.get_text()
        
        if not text.strip():
            return "No text content could be extracted from the PDF. The file may be scanned or contain only images."
        
        return text.strip()
    except Exception as e:
        return f"Error extracting text from PDF: {str(e)}"

def extract_text_from_file(file_path: str) -> str:
    """
    Extract text from a file based on its extension.
    """
    ext = os.path.splitext(file_path)[1].lower()
    
    try:
        if ext == ".pdf":
            return extract_text_from_pdf(file_path)
        elif ext in [".png", ".jpg", ".jpeg"]:
            with open(file_path, "rb") as f:
                image_bytes = f.read()
            return extract_text_from_image(image_bytes)
        elif ext == ".csv":
            # Basic CSV handling
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                rows = list(reader)
                if rows:
                    return "\n".join([",".join(row) for row in rows])
                return "No data found in CSV file"
        elif ext == ".txt":
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read().strip()
        else:
            return f"Unsupported file type: {ext}"
    except Exception as e:
        return f"Error processing {os.path.basename(file_path)}: {str(e)}"
