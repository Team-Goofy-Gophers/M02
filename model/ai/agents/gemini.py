from google import genai
import dotenv, os

dotenv.load_dotenv()

client = genai.Client(api_key="AIzaSyCX-rrrvmm9jrXsx0JMj-coxoSiooxt-wQ")
MODEL = "gemini-2.0-flash"