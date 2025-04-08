def process_text(file_path: str) -> str:
    with open(file_path, 'r') as f:
        content = f.read()
    return f"### Text File\n\n{content.strip()}"
