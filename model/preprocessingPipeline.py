import mimetypes
import pdfplumber
import pytesseract
from PIL import Image
import pandas as pd
import json
from google import genai
import os
import dotenv
import re
import requests
import uuid
from docx import Document 

dotenv.load_dotenv()

BLOCK_SIZE = 8

def extract_and_chunk(file_path):
    filetype = mimetypes.guess_type(file_path)[0]

    if filetype == 'application/pdf':
        return chunk_pdf(file_path)
    elif filetype == 'text/plain':
        with open(file_path) as f:
            return chunk_text(f.read())
    elif filetype == 'text/csv':
        return chunk_text(pd.read_csv(file_path).to_string(index=False))
    elif filetype == 'application/json':
        return chunk_text(json.dumps(json.load(open(file_path)), indent=2))
    elif filetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':  # Handle .docx
        return chunk_docx(file_path)
    elif filetype and filetype.startswith('image/'):
        return [handle_image(file_path)]
    else:
        raise ValueError("Unsupported file type.")

def chunk_pdf(file_path):
    with pdfplumber.open(file_path) as pdf:
        pages = [page.extract_text() or "" for page in pdf.pages]
        return ["\n".join(pages[i:i+BLOCK_SIZE]) for i in range(0, len(pages), BLOCK_SIZE)]

def chunk_text(text):
    paras = text.split("\n\n")
    return ["\n\n".join(paras[i:i+BLOCK_SIZE]) for i in range(0, len(paras), BLOCK_SIZE)]

def chunk_docx(file_path):
    document = Document(file_path)
    paragraphs = [p.text for p in document.paragraphs if p.text.strip()]
    return ["\n\n".join(paragraphs[i:i+BLOCK_SIZE]) for i in range(0, len(paragraphs), BLOCK_SIZE)]

def handle_image(file_path):
    text = pytesseract.image_to_string(Image.open(file_path)).strip()
    if len(text.split()) > 10:
        return text 
    else:
        return f"[IMAGE]{file_path}"
    
def detect_and_extract_text(file_path):
    filetype = mimetypes.guess_type(file_path)[0]

    if filetype == 'application/pdf':
        return extract_text_from_pdf(file_path)
    elif filetype == 'text/plain':
        return extract_text_from_txt(file_path)
    elif filetype == 'text/csv':
        return extract_text_from_csv(file_path)
    elif filetype == 'application/json':
        return extract_text_from_json(file_path)
    elif filetype and filetype.startswith('image/'):
        return extract_text_from_image(file_path)
    else:
        raise ValueError("Unsupported file type.")
    
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def sanitize_sensitive_data(text):
    text = re.sub(r'(?i)(api[_-]?key\s*[:=]\s*)([^\s\'"]+)', r'\1[MASKED API KEY]', text)
    text = re.sub(r'(?i)(secret|password|token)\s*[:=]\s*([^\s\'"]+)', r'\1: [MASKED PASSWORD OR SECRET]', text)
    text = re.sub(r'(?i)(AWS|GCP|Azure)[-_ ]?(key|secret|token)[^\n]*', '[MASKED CLOUD CREDENTIAL]', text)
    return text

def convert_to_markdown_with_gemini(content):
    if content.startswith("[IMAGE]"):
        path = content.replace("[IMAGE]", "").strip()
        image = Image.open(path)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                image,
                """Generate a single-line caption for the image in plain text. 
                Do not include any Markdown formatting or image syntax—only output the caption itself."""
            ]
        )
        caption = response.text.strip()
        print(f"Generated caption for image: {caption}")
        return f"{caption}"
    else:
        safe_content = sanitize_sensitive_data(content)
        prompt = (
            "Respond with only valid Markdown — do not include any explanations, apologies, or introductions. "
            "Only output the Markdown content, and redact any confidential data such as passwords, API keys, tokens, or secrets using [MASKED]. "
            "Preserve proper line breaks and formatting exactly as needed for Markdown to render correctly."
        )
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[safe_content, prompt]
        )
        return response.text.strip()
    
##Pipeline

def pipeline(file_path, type, collection_id=None):
    metadata = {}
    metadata["type"] = type
    if not collection_id:
        collection_id = uuid.uuid4().hex
    metadata["collection_id"] = collection_id
    if type == "docContent":
        try:
            content_blocks = extract_and_chunk(file_path)
            markdown_blocks = [convert_to_markdown_with_gemini(block) for block in content_blocks]
            full_markdown = "\n\n".join(markdown_blocks)

            filetype = mimetypes.guess_type(file_path)[0]
            total_chunks = len(content_blocks)

            
            metadata["source"] = os.path.basename(file_path)
            metadata["filetype"] = filetype
            metadata["total_chunks"] = total_chunks

            response = requests.post(
                f"{os.getenv('DATABASE_URL')}/addData",
                json={
                    "id": uuid.uuid4().hex,
                    "text": full_markdown,
                    "meta": metadata,
                    "collection_id": collection_id,
                    type: "docContent"
                }
            )
            response.raise_for_status()
            print("Uploaded to server:", response.json())

            with open(f"{os.path.splitext(file_path)[0]}.md", "w") as f:
                f.write(full_markdown)
            return full_markdown
        except Exception as e:
            print(f"[Error] {e}")
            return None
    elif type == "chatContext":
        try:
            response = requests.post(
                f"{os.getenv('DATABASE_URL')}/addData",
                json={
                    "id": uuid.uuid4().hex,
                    "text": full_markdown,
                    "meta": metadata,
                    "collection_id": collection_id,
                    type: "chatContext"
                }
            )
            response.raise_for_status()
            print("Uploaded to server:", response.json())
        except Exception as e:
            print(f"[Error] {e}")
            return None

pipeline(file_path='../testData/letter.docx', type='docContent', collection_id="34664749ef4545a1b94f70fb82ee04c0")
# pipeline(file_path='../testData/cat.jpg', type='docContent', collection_id="34664749ef4545a1b94f70fb82ee04c0")
# pipeline(file_path='../testData/test-123.pdf', type='docContent', collection_id="34664749ef4545a1b94f70fb82ee04c0")
# pipeline(file_path='../testData/emc-2.csv', type='docContent', collection_id="34664749ef4545a1b94f70fb82ee04c0")
# pipeline(file_path='../testData/ss.png', type='docContent', collection_id="34664749ef4545a1b94f70fb82ee04c0")
# pipeline(file_path='../testData/emc-2.json', type='docContent', collection_id="34664749ef4545a1b94f70fb82ee04c0")
# pipeline(file_path='../testData/env.txt', type='docContent', collection_id="34664749ef4545a1b94f70fb82ee04c0")


