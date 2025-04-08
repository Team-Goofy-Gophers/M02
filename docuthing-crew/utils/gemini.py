import os
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def gemini_generate_schema(query: str, context: str) -> str:
    """
    Use Gemini to generate a schema or plan based on the user query and the given context.
    """
    model = genai.GenerativeModel("gemini-pro")
    prompt = f"""
    Given the user query:
    "{query}"

    and the following context:
    "{context}"

    Generate a clear schema that defines:
    - What data should be extracted
    - How it should be structured in the response
    - Any assumptions or filters to apply

    Return the schema in a concise bullet-point format.
    """
    response = model.generate_content(prompt)
    return response.text.strip()