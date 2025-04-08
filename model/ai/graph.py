from typing import TypedDict, List, Annotated, Union
from langgraph.graph.message import add_messages
from google import genai
import dotenv, os
from langgraph.graph import StateGraph, END, START
from model.db import chroma_client
from google.genai import types
import requests, json
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage

dotenv.load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "gemini-2.0-flash"
llm = ChatOllama(
    model="llama3.2", temperature=0.7,
)
server_url = "http://147.93.29.19:9876"

class SessionState(TypedDict):
    id: str  # unique identifier for the session as well as collection name
    session_name: str  # name of the session
    feedback: Annotated[List[dict], add_messages]
    messages: Annotated[List[dict], add_messages]
    invoke: str

def interface_agent(state: SessionState):
    print(state.get("invoke"))
    if state.get("invoke") == "message":
        state["invoke"] = "classify"
        return {
            "next_nodes": ["user_message_classifier"],
            "state": state
        }
    if state.get("invoke") == "ExtractData":
        state["invoke"] = "schema_definer"
        return {
            "next_nodes": ["schema_definer"],
            "state": state
        }
    if state.get("invoke") == "extract_data":
        return {
            "next_nodes": ["extract_data"],
            "state": state
        }
    if state.get("invoke") == "done":
        return {
            "next_nodes": [END],
            "state": state
        }
    if state.get("invoke") == "SuggestOrCreateSchema":
        return {
            "next_nodes": ["suggest_schema"],
            "state": state
        }
    return {
        "next_nodes": [END],
        "state": state
    }

def user_message_classifier(state: SessionState):
    system_prompt = '''Classification Categories:
...existing prompt content...
'''
    query = state["messages"][-1].content
    response = client.models.generate_content(
        model=MODEL,
        config=types.GenerateContentConfig(system_instruction=system_prompt),
        contents=query
    )
    response = response.text
    response = json.loads(response[7:-3])
    val = response["classification"]
    state["invoke"] = val
    result = "create a schema to extract event name and date"
    if state["invoke"] == "UpdateContext":
        result = response["update_context"]
    elif state["invoke"] == "SuggestOrCreateSchema":
        result = response["reason"]
    elif state["invoke"] == "SummarizeContext":
        result = response["reason"]
    elif state["invoke"] == "ExtractData":
        result = response["schema"]
    return {**state, "invoke": state["invoke"], "feedback": [{"role": "assistant", "content": result}]}

def schema_definer(state: SessionState):
    system_prompt = '''Role: You are a Schema Design Agent...
...existing prompt content...
'''
    response = requests.post(
        server_url + "/searchData",
        headers={"Content-Type": "application/json"},
        data=json.dumps({
            "collection_id": state["id"],
            "text": state["feedback"][-1].content,
            "n_results": 3,
        }),
    )
    message = {
        "context": response.json()["results"][0]["text"],
        "user": state["feedback"][-1].content,
    }
    result = client.models.generate_content(
        model=MODEL,
        config=types.GenerateContentConfig(system_instruction=system_prompt),
        contents=str(message)
    )
    result = result.text[7:-3].replace("\n", ' ')
    state["invoke"] = "extract_data"
    return {**state, "invoke": state["invoke"], "feedback": [{"role": "assistant", "content": result}]}

def extract_data(state: SessionState):
    system_prompt = '''Role: You are a Data Extraction Agent...
...existing prompt content...
'''
    response = requests.post(
        server_url + "/searchData",
        json={
            "collection_id": state["id"],
            "text": state["feedback"][-1].content,
            "n_results": 3,
        }
    )
    response = response.json()
    extracted_data = [doc["text"] for doc in response["results"]]
    result = client.models.generate_content(
        model=MODEL,
        config=types.GenerateContentConfig(system_instruction=system_prompt),
        contents=str({
            "context": extract_data,
            "user": state["feedback"][-1].content,
        })
    )
    result = result.text[7:-3].replace("\n", ' ')
    state["invoke"] = "done"
    return {
        **state,
        "invoke": state["invoke"],
        "message": [{"role": "assistant", "content": result}],
    }

def suggest_schema(state: SessionState):
    system_prompt = '''Role: You are a Schema Suggestion Agent...
...existing prompt content...
'''
    response = requests.post(
        server_url + "/searchData",
        json={
            "collection_id": state["id"],
            "text": state["feedback"][-1].content,
            "n_results": 3,
        }
    )
    response = response.json()
    extracted_data = [doc["text"] for doc in response["results"]]
    result = client.models.generate_content(
        model=MODEL,
        config=types.GenerateContentConfig(system_instruction=system_prompt),
        contents=str({
            "context": extract_data,
            "user": state["messages"][-1].content,
        })
    )
    result = result.text[7:-3].replace("\n", ' ')
    state["invoke"] = "extract_data"
    return {**state, "invoke": state["invoke"], "messages": [{"role": "assistant", "content": result}]}

graph_builder = StateGraph(SessionState)
graph_builder.add_node("interface_agent", interface_agent)
graph_builder.add_node("user_message_classifier", user_message_classifier)
graph_builder.add_node("schema_definer", schema_definer)
graph_builder.add_node("extract_data", extract_data)
graph_builder.add_node("suggest_schema", suggest_schema)

graph_builder.set_entry_point("interface_agent")
graph_builder.add_conditional_edges(
    "interface_agent",
    lambda state: interface_agent(state)["next_nodes"],
    {
        "user_message_classifier": "user_message_classifier",
        "schema_definer": "schema_definer",
        "extract_data": "extract_data",
        "suggest_schema": "suggest_schema",
        END: END
    },
)
graph_builder.add_edge("user_message_classifier", "interface_agent")
graph_builder.add_edge("schema_definer", "interface_agent")
graph_builder.add_edge("extract_data", "interface_agent")
graph_builder.add_edge("suggest_schema", "interface_agent")

graph = graph_builder.compile()

