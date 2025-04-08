from model.ai.state import SessionState
from model.db import chroma_client

def load_previous_state(chat_id:str):
    state_db = chroma_client.get_or_create_collection(name="chat_states")
    result = state_db.get(ids=[chat_id])
    
    return result['documents'][0] if result['documents'] else None

def save_state(state: SessionState, chat_id:str):
    state_db = chroma_client.get_or_create_collection(name="chat_states")
    existing = state_db.get(ids=[chat_id])
    if existing['ids']:
        state_db.delete(ids=[chat_id])
    state_db.add(documents=[state], ids=[chat_id])
    state_db.persist()
    return state