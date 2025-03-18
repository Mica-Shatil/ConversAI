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

filtered_products = [
    {
        "p_name": product["p_name"],
        "description": product["description"],
        "price": product["price"],
    }
    for product in products
]

product_texts = [
    f'{product["p_name"]}' for product in products
    ]
#: {product["description"]}

# In-memory conversation history (for demonstration purposes)
conversation_history = []

def getImage(user_message):
    ai_text = "Sure!"
    conversation_history.append(f"AI: {ai_text}")

    rerank_response = co.rerank(
        query=user_message,
        documents=product_texts,
        top_n=5
    )

    print(rerank_response)
    top_docs = [rerank_response.results[i].index for i in range(0, 5) if rerank_response.results[i].relevance_score > 0.8]
    matching_products = [item for item in products if item['id'] in top_docs] or []

    print(matching_products)
    # Return the AI response and the recommended products
    return jsonify({
        "response": ai_text,
        "recommendedProducts": matching_products
    })

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "").strip()
    if not user_message:
        return jsonify({"response": "No message received.", "images": [], "recommended_products": []}), 400

    conversation_history.append(f"User: {user_message}")

    if "show me" in user_message.lower():
        return getImage(user_message)

    system_prompt = (
        "You are ConversAI, an AI fashion stylist and shopping assistant. "
        "Provide friendly, concise fashion advice and product recommendations based on the user's input. "
        "If more details are needed, ask clarifying questions. "
        "Keep the tone modern and aligned with a high-end eCommerce brand. "
        f"Here are the products you may recommend: {filtered_products}"
        "You MUST include the EXACT p_name of any product you recommend in your response"
        "Here is the conversation so far:"
    )
    conversation_context = "\n".join(conversation_history[-10:])
    final_prompt = f"{system_prompt}\n{conversation_context}\n\nOnly recommend one outfit if making a recommendation, so dont recommend multiple shirts or multiple pants. Ask for the shopper's gender if it is not provided. Do not make a recommendation until the user has given you all the info you need to make a good recommendation.\nRecall, be concise and if more details are needed to be aligned with a high-end eCommerce shopping assistance, ask clarifying questions.\nDO NOT RECOMMEND MEN WOMENS CLOTHING\nAI:"

    response = co.generate(
        model="command",  # Change to your desired model if needed
        prompt=final_prompt,
        max_tokens=250,
        temperature=0
    )
    ai_text = response.generations[0].text.strip()
    conversation_history.append(f"AI: {ai_text}")

    # rerank_response = co.rerank(
    #     query=ai_text,
    #     documents=product_texts,
    #     top_n=5
    # )

    # print(rerank_response)
    # top_docs = [rerank_response.results[i].index for i in range(0, 5) if rerank_response.results[i].relevance_score > 0.8]
    # matching_products = [item for item in products if item['id'] in top_docs] or []

    # print(matching_products)
    # # Return the AI response and the recommended products
    # return jsonify({
    #     "response": ai_text,
    #     "recommendedProducts": matching_products
    # })

    matching_products = []
    # Return the AI response and the recommended products
    return jsonify({
        "response": ai_text,
        "recommendedProducts": matching_products
    })

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
