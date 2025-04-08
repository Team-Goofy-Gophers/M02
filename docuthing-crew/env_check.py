#!/usr/bin/env python
import os
import sys

# Check environment variables
required_vars = [
    "GEMINI_API_KEY", 
    "CHROMA_GOOGLE_GENAI_API_KEY", 
    "CHROMA_DIR",
    "CHROMA_OPENAI_API_KEY"  # Added this since CrewAI seems to require it
]

# Load .env file manually for testing
env_file = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_file):
    print(f"Loading environment from {env_file}")
    with open(env_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                key, value = line.split('=', 1)
                os.environ[key.strip()] = value.strip().strip('"')

# Check each variable
missing = []
for var in required_vars:
    value = os.environ.get(var)
    if value:
        print(f"✅ {var} is set")
        if var.endswith("API_KEY"):
            # Only show first few chars of API keys
            masked = value[:4] + "..." + value[-4:] if len(value) > 8 else "[too short to mask]"
            print(f"   Value: {masked}")
    else:
        print(f"❌ {var} is NOT set")
        missing.append(var)

if missing:
    print("\n⚠️ Missing environment variables:")
    for var in missing:
        print(f"  - {var}")
    print("\nPlease add these to your .env file")
    sys.exit(1)
else:
    print("\n✨ All required environment variables are set!")

# Test ChromaDB client creation
try:
    print("\n🔍 Testing ChromaDB client creation...")
    from utils.chromadb_utils import get_chroma_client
    client = get_chroma_client()
    print(f"✅ ChromaDB client created successfully at: {os.environ.get('CHROMA_DIR', 'unknown')}")
    collections = client.list_collections()
    print(f"📚 Found {len(collections)} collections")
except Exception as e:
    print(f"❌ Error creating ChromaDB client: {str(e)}")
    sys.exit(1)

print("\n🎉 Environment check completed successfully!")
