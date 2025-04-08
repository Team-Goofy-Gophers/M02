from flask import Flask, request, jsonify
import chromadb
from uuid import uuid4

chroma_client = chromadb.PersistentClient(path="./database")
# collection = chroma_client.get_or_create_collection(name="test_collection")

app = Flask(__name__)



@app.before_request
def log_request():
    print(f"[{request.method}] {request.path} - Body: {request.get_json(silent=True)}")

@app.post('/createCollection')
def create_collection():
    # data = request.json
    # if not data or 'name' not in data:
    #     return jsonify({"status": "error", "message": "Collection name is required"}), 400
    # if not isinstance(data['name'], str) or not data['name']:
    #     return jsonify({"status": "error", "message": "Collection name must be a non-empty string"}), 400

    # collection_name = data['name']
    collection_name = uuid4().hex
    # Check if the collection already exists
    existing_collections = chroma_client.list_collections()
    for collection in existing_collections:
        if collection['name'] == collection_name:
            return jsonify({"status": "error", "message": "Collection already exists"}), 400
    new_collection = chroma_client.get_or_create_collection(name=collection_name)
    return jsonify({"status": "success", "message": "Collection created successfully", "collection_id": collection_name}), 201

@app.post('/addData')
def add_data():
    data = request.json
    if not data or 'collection_id' not in data:
        return jsonify({"status": "error", "message": "Collection ID is required"}), 400
    if not data:
        print("No data provided")
        return jsonify({"status": "error", "message": "No data provided"}), 400
    if not isinstance(data, dict):
        print("Data must be a dictionary")
        return jsonify({"status": "error", "message": "Data must be a dictionary"}), 400
    if 'id' not in data or 'text' not in data:
        print("Data must contain 'id' and 'text' keys")
        return jsonify({"status": "error", "message": "Data must contain 'id' and 'text' keys"}), 400
    if not isinstance(data['text'], str):
        print("Text must be a string")
        return jsonify({"status": "error", "message": "Text must be a string"}), 400
    if not isinstance(data['id'], str):
        print("ID must be a string")
        return jsonify({"status": "error", "message": "ID must be a string"}), 400

    collection_id = data['collection_id']
    collection = chroma_client.get_or_create_collection(name=collection_id)

    existing = collection.get(ids=[data['id']])
    if existing['ids']:
        return jsonify({"status": "error", "message": "Data with this ID already exists"}), 400

    metadata = data.get("meta", {})
    collection.add(documents=[data['text']], ids=[data['id'] or str(uuid4())], metadatas=[metadata])

    return jsonify({"status": "success", "message": "Data added successfully", "data": data}), 201

@app.get('/getDataById/<string:data_id>')
def get_data(data_id):
    collection_id = request.args.get('collection_id')
    if not collection_id:
        return jsonify({"status": "error", "message": "Collection ID is required"}), 400
    collection = chroma_client.get_or_create_collection(name=collection_id)
    result = collection.get(ids=[data_id])
    if not result['ids']:
        return jsonify({"status": "error", "message": "Data not found"}), 404
    return jsonify({"status": "success", "data": {"id": result['ids'][0], "text": result['documents'][0]}}), 200

@app.post('/searchData')
def search_data():
    query = request.json
    if not query or 'collection_id' not in query:
        return jsonify({"status": "error", "message": "Collection ID is required"}), 400
    if not query or 'text' not in query or 'n_results' not in query:
        return jsonify({"status": "error", "message": "Request must contain 'text' and 'n_results'"}), 400
    if not isinstance(query['text'], str) or not query['text']:
        return jsonify({"status": "error", "message": "Search text must be a non-empty string"}), 400
    if not isinstance(query['n_results'], int) or query['n_results'] <= 0:
        return jsonify({"status": "error", "message": "n_results must be a positive integer"}), 400

    collection_id = query['collection_id']
    collection = chroma_client.get_or_create_collection(name=collection_id)

    results = collection.query(query_texts=[query['text']], n_results=query['n_results'])
    data = [
        {"id": id_, "text": doc}
        for id_, doc in zip(results['ids'][0], results['documents'][0])
    ]
    return jsonify({"status": "success", "results": data}), 200

@app.get('/allData')
def all_data():
    collection_id = request.args.get('collection_id')
    if not collection_id:
        return jsonify({"status": "error", "message": "Collection ID is required"}), 400
    collection = chroma_client.get_or_create_collection(name=collection_id)
    results = collection.get()
    data = [
        {"id": id_, "text": doc, "meta": meta}
        for id_, doc, meta in zip(results["ids"], results["documents"], results["metadatas"])
    ]
    return jsonify({"status": "success", "results": data}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9876, debug=True)