from typing import TypedDict, List, Annotated
from langgraph.graph.message import add_messages

class SessionState(TypedDict):
    id: str ## unique identifier for the session as well as collection name
    session_name: str ## name of the session
    
    files: List[dict]
    messages: Annotated[dict, add_messages]
    
    invoke: str