from langgraph.graph import StateGraph, END, START
from typing import TypedDict, Literal, Optional, Union
from model.ai.agents.crew import interface_agent, user_message_classifier
from model.ai.state import SessionState

graph_builder = StateGraph(SessionState)

graph_builder.add_node(
    "interface_agent", interface_agent
)
graph_builder.add_node(
    "user_message_classifier", user_message_classifier
)

graph_builder.add_edge(START, "interface_agent")
graph_builder.add_edge("interface_agent", "user_message_classifier")
graph_builder.add_edge("user_message_classifier", END)
graph_builder.add_edge("user_message_classifier", "interface_agent")
graph_builder.add_edge("interface_agent", END)

graph = graph_builder.compile()

sample_input = {
    "id": "33dc47d9b2ed42f4b769c3d225ea2d4c",
    "session_name": "Test Session",
    "files": [],
    "messages": [
        {"role": "user", "content": "suggest a schema for extraction teams data with their ideas"},
    ],
    "invoke": "message"
}