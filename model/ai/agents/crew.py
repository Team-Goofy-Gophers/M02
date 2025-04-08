from model.ai.state import SessionState
from model.ai.agents.gemini import client, MODEL
from google.genai import types
from model.db import chroma_client

def interface_agent(state: SessionState):
    # if state.get("invoke") == "file_input":
    #     pass
    # print("Interface agent invoked")
    # print(state["messages"])
    # return state
    if state.get("invoke") == "message":
        state["invoke"] = "classify"
        return "user_message_classifier"
    

def user_message_classifier(state: SessionState):
    system_prompt = '''Role: You are a classifier agent in an agentic AI system. Your task is to analyze user queries and determine the correct action the system should take. You must classify the intent of each user message into one of the following categories:

    🔹 Classification Categories:
    UpdateContext
    The user wants to store information in the agent's internal state for future reference.
    ➤ Examples:

    "The client's name is John."

    "We're organizing a conference on June 5th."

    "Add this to our team knowledge."

    SuggestOrCreateSchema
    The user is requesting help designing a schema or structured format to extract information.
    ➤ Examples:

    "Can you create a schema for extracting details from job applications?"

    "Suggest a structure to capture meeting notes."

    "What format should I use to store bug report info?"

    UseProvidedSchema
    The user provides a schema and wants you to apply it to extract structured data from text.
    ➤ Examples:

    "Here's a schema: {name, date, location}. Extract this from the paragraph below."

    "Use this format and pull details from the email."

    "Apply this structure: {title, author, summary} to the following.
    
    ## Output Format:
Return your response as a JSON object with the following fields:

{
  "classification": "UpdateContext" | "SuggestOrCreateSchema" | "UseProvidedSchema",
  "reason": "Brief explanation to use it as a prompt for the next agent",
}
'''

    context = chroma_client.query(
        query=state["messages"],
        top_results=10,
        collection_name=state["id"],
    )
    query = state["messages"][-1]["content"]
    
    client.models.generate_content(
        model=MODEL,
        config=types.GenerateContentConfig(system_instruction=system_prompt),
        contents="\{ 'user_query': 'f{query}', 'context': 'f{context}' \}"
    )
    
    return state