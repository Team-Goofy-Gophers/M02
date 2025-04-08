import pandas as pd
import os

def process_csv(file_path: str) -> str:
    """
    Process a CSV file and return its content as markdown.
    """
    try:
        # Read CSV with pandas
        df = pd.read_csv(file_path)
        
        # Get basic stats for debugging
        row_count = len(df)
        col_count = len(df.columns)
        print(f"📊 CSV file has {row_count} rows and {col_count} columns")
        
        # Generate markdown table - handle large files by limiting output
        if row_count > 20:
            print(f"⚠️ Large CSV file detected ({row_count} rows). Limiting preview to 20 rows.")
            preview_df = df.head(20)
            markdown_table = preview_df.to_markdown(index=False)
            footer_note = f"\n\n*Table truncated: Showing 20 of {row_count} rows*"
        else:
            markdown_table = df.to_markdown(index=False)
            footer_note = ""
        
        # If to_markdown is not available (older pandas versions), fallback to a simpler approach
        if markdown_table is None:
            # Get headers
            headers = df.columns.tolist()
            header_row = "| " + " | ".join(headers) + " |"
            separator = "| " + " | ".join(["-" * len(h) for h in headers]) + " |"
            
            # Get rows - limit to 20 if large
            rows = []
            for i, (_, row) in enumerate(df.iterrows()):
                if i >= 20:
                    break
                rows.append("| " + " | ".join([str(v) for v in row.values]) + " |")
            
            # Combine into markdown table
            markdown_table = header_row + "\n" + separator + "\n" + "\n".join(rows)
            
            if row_count > 20:
                footer_note = f"\n\n*Table truncated: Showing 20 of {row_count} rows*"
        
        filename = os.path.basename(file_path)
        return f"### CSV Data: {filename}\n\n{markdown_table}{footer_note}"
    except Exception as e:
        error_message = f"### Error Processing CSV\n\nFailed to process {os.path.basename(file_path)}: {str(e)}"
        print(f"❌ CSV processing error: {str(e)}")
        return error_message
