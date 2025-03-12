from flask import Flask, request, jsonify
from flask_cors import CORS
import cohere
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Cohere API from .env file
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

co = cohere.Client(COHERE_API_KEY)

app = Flask(__name__)
CORS(app)  # Allows frontend to call API

# Product data with images
products = [
    {
        "picture_name": ["/images/fem_t-shirt1.avif"],
        "p_name": "Tight Fit Beauty T",
        "id": 1,
        "description": "A classic women's t-shirt in a soft cotton blend. Features a slim fit design with a round neckline and short sleeves. Solid-colored with a minimalistic, clean design, ideal for casual wear or layering."
    },
    {
        "picture_name": ["/images/fem_t-shirt2.avif"],
        "p_name": "Loose Crop",
        "id": 2,
        "description": "A relaxed-fit women's t-shirt made of lightweight, breathable fabric. Designed with a V-neckline and slightly longer sleeves for a comfortable, stylish look. Features a subtle heathered texture for added depth."
    },
    {
        "picture_name": ["/images/mal_jean1.avif"],
        "p_name": "slim fit light jeans",
        "id": 3,
        "description": "A pair of men's slim-fit jeans made from durable denim with a slight stretch for comfort. Features a classic five-pocket design, zip fly, and a tapered leg opening. The denim has a slightly faded wash for a modern, worn-in look."
    },
    {
        "picture_name": ["/images/mal_pant1_1.avif", "/images/mal_pant1_2.avif"],
        "p_name": "light colour mens pants",
        "id": 4,
        "description": "Men's tailored pants crafted from a polyester-cotton blend for a refined yet comfortable fit. Features a straight-leg cut, belt loops, and button closure for a polished look. Solid-colored with a slight sheen, making it suitable for formal and business-casual settings."
    },
    {
        "picture_name": ["/images/mal_shirt1.avif"],
        "p_name": "Classic black T",
        "id": 5,
        "description": "A men's button-down shirt made from lightweight cotton. Features a classic collar, long sleeves, and a structured fit, perfect for both business and casual settings. Comes in a checkered pattern for a stylish, timeless appeal."
    },
    {
        "picture_name": ["/images/mal_sweater1.avif"],
        "p_name": "Cream Basic Hoodie",
        "id": 6,
        "description": "A men's pullover sweater made from a wool-acrylic blend for warmth and softness. Features a ribbed crew neckline, cuffs, and hem for a snug fit. The fabric has a fine-knit texture with a subtle geometric pattern."
    },
    {
        "picture_name": ["/images/fem_dress1.avif"],
        "p_name": "Bright Dress",
        "id": 7,
        "description": "A women's midi dress made from flowy chiffon fabric. Features a fitted waist, V-neckline, and short flutter sleeves for an elegant yet relaxed look. Decorated with a delicate floral print for a soft, feminine style."
    },
    {
        "picture_name": ["/images/fem_dress2.avif"],
        "p_name": "Floral Dress",
        "id": 8,
        "description": "A bodycon women's dress made from a stretchy polyester-spandex blend. Features a square neckline and sleeveless design, perfect for a night out or formal occasions. Solid-colored with a sleek, smooth finish for a bold, minimalist aesthetic."
    },
    {
        "picture_name": ["/images/fem_jeans1.avif"],
        "p_name": "Classic Womens Jeans",
        "id": 9,
        "description": "A pair of women's high-waisted skinny jeans made from soft, stretch denim. Features a classic five-pocket design and a flattering fit that hugs the curves. Lightly distressed with subtle whiskering at the hips for a trendy, worn-in appearance."
    },
    {
        "picture_name": ["/images/fem_pants1.avif"],
        "p_name": "Hippie Pants",
        "id": 10,
        "description": "A pair of women's wide-leg trousers crafted from a lightweight linen blend. Features a high waist, pleated front, and side pockets for a chic, comfortable style. Solid-colored with a textured weave pattern for an effortlessly sophisticated look."
    },
    {
        "picture_name": ["/images/belt1.avif"],
        "p_name": "Classic Black Leather Belt",
        "id": 11,
        "description": "A classic leather belt with a sleek, polished finish. Features a sturdy metal buckle with a minimalist design, making it versatile for both casual and formal wear. The belt has a smooth, solid-colored strap with reinforced stitching along the edges for durability."
    }
]

chat_histories = []

def chatbot_response(user_input):
    """Fetches AI-generated response from Cohere API."""

    chat_histories.append(f"User: {user_input}")

    chat_context = "\n".join(chat_histories[-5:])

    response = co.generate(
        model='command',
        prompt=f"You are an AI shopping assistant for a chat-based e-commerce store. Maintain conversation context and recommend products from the list below. Only reccomend products when relevant, if you need more context on the user (for example, gender), do not reccomend a product in this specific response and ask the user for more context. You may also present multiple options from the list to the user.\n\n{chat_context}\n\nProducts:\n" + "\n".join([f"\n{p['id']}, {p['p_name']}. {p['description']}" for p in products]) + "\n\nMake sure your response includes the product name of each product you are reccomending.\n\nResponse:",
        max_tokens=150
    )

    ai_response = response.generations[0].text.strip()
    images = []
    for item in products:
        if item['p_name'] in ai_response:
            images += item['picture_name']

    chat_histories.append(f"AI: {ai_response}") 
    
    return ai_response, images

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    bot_response, images = chatbot_response(user_message)
    return jsonify({
                        "response": bot_response,
                        "images": images
                    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)