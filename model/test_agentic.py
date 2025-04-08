from typing import Annotated
from typing_extensions import TypedDict

from langchain.schema import BaseMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.tools import DuckDuckGoSearchResults

import json

# Define the state with both messages and context
class State(TypedDict):
    messages: Annotated[list, add_messages]
    context: str

# Initialize the state graph
graph_builder = StateGraph(State)

# Initialize the Gemini model
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

search_tool = DuckDuckGoSearchResults(output_format="list")

# Node 1: Chatbot interaction
def chatbot(state: State) -> State:
    print("\n[🧠 Chatbot Node] Generating response...")
    response = llm.invoke(state["messages"])
    print("[💬 AI Response]", response.content)
    return {"messages": [response]}

# Node 2: Update context summary
def update_context(state: State) -> State:
    print("[📄 Context Node] Updating context summary...")
    
    summary_prompt = [
        {"role": "system", "content": "Summarize the conversation so far in a few sentences to capture key points. This will help carry forward context."},
        *state["messages"]
    ]

    summary = llm.invoke(summary_prompt)
    print("[📝 Updated Context]", summary.content)
    return {"context": summary.content}

def check_knowledge(state: State) -> State:
    print("\n[🧐 Check Knowledge Node] Evaluating user query...")

    check_prompt = [
        {"role": "system", "content": "You are an intelligent agent. Identify which parts of the user query might require external or real-time information to answer accurately. Be concise. Respond with a short list of keywords or phrases that may need external knowledge. If none, say 'None'."},
        {"role": "user", "content": f"User asked: '{state['messages'][-1].content}'\nCan you confidently answer this without external help and justify by giving a reason."}
    ]

    confidence_reply = llm.invoke(check_prompt).content
    print("[🔎 Confidence Check Reply]:", confidence_reply)

    if "none"  not in confidence_reply.lower():
        query = state["messages"][-1].content
        print("[🌐 DuckDuckGo] Searching for info on:", query)

        raw_results = search_tool.invoke(query)
        if not isinstance(raw_results, list):
            raw_results = [raw_results]  # make sure it's a list

        summaries = [r["snippet"] for r in raw_results if isinstance(r, dict) and "snippet" in r]
        external_info = "\n\n".join(summaries[:3])  # Only use first 3 snippets

        print("[📄 External Info Fetched]:", external_info[:500], "...")

        return {
            "messages": [{
                "role": "assistant",
                "content": f"I checked and found this information that might help:\n\n{external_info}"
            }]
        }

    print("[✅ Model is confident. Proceeding without external help.]")
    return {}

# Add nodes and edges to the graph
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_node("update_context", update_context)
graph_builder.add_node("check_knowledge", check_knowledge)

graph_builder.add_edge(START, "check_knowledge")
graph_builder.add_edge("check_knowledge", "chatbot")
graph_builder.add_edge("chatbot", "update_context")
graph_builder.add_edge("update_context", END)

# Compile the graph
graph = graph_builder.compile()

# Initialize full conversation state
conversation_state = {
    "messages": [],
    "context": ""
}

def serialize_messages(messages):
    return [
        {"role": m.type, "content": m.content}
        if isinstance(m, BaseMessage)
        else m
        for m in messages
    ]


# Function to run the graph and log events
def stream_graph_updates(user_input: str):
    conversation_state["messages"].append({"role": "user", "content": user_input})

    print("\n\n=== 🔄 New Cycle Start ===")
    print("[👤 User Input]", user_input)
    print("[📥 Messages Going In]:", json.dumps(serialize_messages(conversation_state["messages"]), indent=2))

    for event in graph.stream(conversation_state):
        print("\n[📡 Stream Event]", event)
        for value in event.values():
            if value is None:
                continue
            if isinstance(value, dict):
                if "messages" in value:
                    conversation_state["messages"].extend(value["messages"])
                if "context" in value:
                    conversation_state["context"] = value["context"]


    print("[✅ Final Context]:", conversation_state["context"])
    print("=== 🟢 Cycle End ===\n")

# Main loop
while True:
    try:
        print("Conversation State:", conversation_state)
        print("Context:", conversation_state["context"])
        print("\n\n=== 🌀 New Interaction ===")
        user_input = input("User: ")
        if user_input.lower() in ["quit", "exit", "q"]:
            print("Goodbye!")
            break
        elif user_input.lower() in ["context", "summary"]:
            print("\n🧠 Current Context Summary:\n", conversation_state["context"])
        else:
            stream_graph_updates(user_input)
    except KeyboardInterrupt:
        print("Goodbye!")
        break
