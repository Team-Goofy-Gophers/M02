import pandas as pd

def process_csv(file_path: str) -> str:
    df = pd.read_csv(file_path)
    return f"""### CSV File\n\n{df.to_markdown(index=False)}"""
