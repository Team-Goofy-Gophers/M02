from utils.ocr import extract_text_from_pdf
import os

def process_pdf(file_path: str) -> str:
    """
    Process a PDF file and return its content as markdown.
    """
    try:
        # Extract text from the PDF
        text = extract_text_from_pdf(file_path)
        
        # Format as markdown
        filename = os.path.basename(file_path)
        markdown = f"### PDF Document: {filename}\n\n{text}"
        
        # Add debug info
        print(f"📄 Extracted {len(text)} characters from PDF: {filename}")
        print(f"Preview: {text[:150]}..." if len(text) > 150 else f"Preview: {text}")
        
        return markdown
    except Exception as e:
        error_message = f"### Error Processing PDF\n\nFailed to process {os.path.basename(file_path)}: {str(e)}"
        print(f"❌ PDF processing error: {str(e)}")
        return error_message
