from google import genai
import dotenv, os

dotenv.load_dotenv()

client = genai.Client(api_key="YOU_API_KEY")
MODEL = "gemini-2.0-flash"