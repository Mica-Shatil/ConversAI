import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi there! I'm ConversAI, your personal fashion assistant. How can I help you today?",
      images: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (sender, text, images = []) => {
    setMessages((prev) => [...prev, { sender, text, images }]);
  };

  // Use user input as the query for recommendations
  const extractQuery = (text) => text.toLowerCase();

  // Fetch matching product recommendations from backend
  const fetchRecommendations = async (query) => {
    try {
      const res = await axios.get("http://127.0.0.1:5050/api/recommendations", {
        params: { query },
      });
      if (res.data && res.data.products) {
        setRecommendedProducts(res.data.products);
      } else {
        setRecommendedProducts([]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendedProducts([]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userInput = input;
    setInput(""); // Clear input immediately

    addMessage("user", userInput);
    setIsTyping(true);
    try {
      const res = await axios.post("http://127.0.0.1:5050/chat", {
        message: userInput,
      });
      const { response, images } = res.data;
      addMessage("bot", response, images);

      // Use the user input as the query to filter available products.
      const query = extractQuery(userInput);
      if (query) {
        await fetchRecommendations(query);
      } else {
        setRecommendedProducts([]);
      }
    } catch (error) {
      console.error("Error contacting backend:", error);
      addMessage("bot", "❌ Sorry, something went wrong on my end.", []);
      setRecommendedProducts([]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center p-6 font-bold text-2xl">
        ConversAI Fashion Chat
      </div>

      {/* Chat Messages */}
      <div className="p-6 space-y-4 h-[800px] overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}
          >
            {msg.sender === "bot" && (
              <img
                src="https://i.imgur.com/8Km9tLL.png"
                alt="Bot Avatar"
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div
              className={`rounded-lg p-4 max-w-xs break-words ${
                msg.sender === "bot"
                  ? "bg-blue-600 text-white rounded-tl-none"
                  : "bg-gray-200 text-gray-800 rounded-tr-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center mt-2">
            <img
              src="https://i.imgur.com/8Km9tLL.png"
              alt="Bot Avatar"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg animate-pulse">
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Recommended Products Section */}
      {recommendedProducts.length > 0 && (
        <div className="p-6 bg-gray-100 border-t border-gray-300">
          <h2 className="text-xl font-bold mb-4">Recommended Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-4 border p-4 rounded shadow">
                <img
                  src={product.picture_url}
                  alt={product.p_name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <h3 className="text-2xl font-semibold">{product.p_name}</h3>
                  <p className="text-gray-700">{product.description}</p>
                  <p className="text-gray-800 font-bold mt-2">${product.price}</p>
                  <button
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => alert("Product added to cart!")}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-gray-100 p-4 flex border-t border-gray-200">
        <input
          type="text"
          className="flex-grow p-3 rounded-l-lg focus:outline-none"
          placeholder="Ask about outfits, styles, or product details..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 rounded-r-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
