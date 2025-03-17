import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import cohere
import os
from dotenv import load_dotenv

# Load environment variables from .env file (ensure .env is in the same folder)
load_dotenv()

# Get the Cohere API key from environment variables
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
if not COHERE_API_KEY:
    raise ValueError("COHERE_API_KEY is not set in your .env file.")

# Initialize Cohere client
co = cohere.Client(COHERE_API_KEY)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load product data from a JSON file
with open("products.json", "r") as f:
    products = json.load(f)

# In-memory conversation history (for demonstration purposes)
conversation_history = []

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "").strip()
    if not user_message:
        return jsonify({"response": "No message received.", "images": [], "recommended_products": []}), 400

    conversation_history.append(f"User: {user_message}")

    system_prompt = (
        "You are ConversAI, an AI fashion stylist and shopping assistant. "
        "Provide friendly, concise fashion advice and product recommendations based on the user's input. "
        "If more details are needed, ask clarifying questions. "
        "Keep the tone modern and aligned with a high-end eCommerce brand. "
        "Here is the conversation so far:"
    )
    conversation_context = "\n".join(conversation_history[-10:])
    final_prompt = f"{system_prompt}\n{conversation_context}\n\nAI:"

    response = co.generate(
        model="command",  # Change to your desired model if needed
        prompt=final_prompt,
        max_tokens=150,
        temperature=0.7
    )
    ai_text = response.generations[0].text.strip()
    conversation_history.append(f"AI: {ai_text}")

    # Filter products based on the user's query (using user_message as the filter)
    query = user_message.lower()
    matching_products = []
    for product in products:
        if (query in product["p_name"].lower() or 
            query in product["description"].lower() or 
            query in str(product["price"])):
            matching_products.append({
                "id": product["id"],
                "p_name": product["p_name"],
                "description": product["description"],
                "price": product["price"],
                "picture_url": product["picture_name"][0] if product["picture_name"] else "",
                "product_link": product["product_link"]
            })

    # Return the AI response and the recommended products
    return jsonify({
        "response": ai_text,
        "images": [],  # Optionally, you can also include any images from the AI response here
        "recommended_products": matching_products
    })

@app.route("/api/recommendations", methods=["GET"])
def recommendations():
    """
    Filters available products based on a query string.
    The query is matched against product name, description, or price.
    """
    query = request.args.get("query", "").strip().lower()
    if not query:
        return jsonify({"products": []})
    
    recommended = []
    for product in products:
        if (query in product["p_name"].lower() or 
            query in product["description"].lower() or 
            query in str(product["price"])):
            recommended.append({
                "id": product["id"],
                "p_name": product["p_name"],
                "description": product["description"],
                "price": product["price"],
                "picture_url": product["picture_name"][0] if product["picture_name"] else "",
                "product_link": product["product_link"]
            })
    return jsonify({"products": recommended})

@app.route("/api/products", methods=["GET"])
def get_products():
    """Returns the full product list."""
    return jsonify({"products": products})

@app.route("/static/images/<path:filename>")
def serve_image(filename):
    """Serves static images from the static/images folder."""
    return send_from_directory(os.path.join(app.root_path, "static", "images"), filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
