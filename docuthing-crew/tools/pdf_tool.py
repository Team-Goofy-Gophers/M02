import fitz  # PyMuPDF

def process_pdf(file_path: str) -> str:
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return f"### PDF Document\n\n{text.strip()}"
