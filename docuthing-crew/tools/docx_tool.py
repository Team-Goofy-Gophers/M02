from docx import Document

def process_docx(file_path: str) -> str:
    doc = Document(file_path)
    full_text = "\n".join([para.text for para in doc.paragraphs])
    return f"### DOCX Document\n\n{full_text.strip()}"
