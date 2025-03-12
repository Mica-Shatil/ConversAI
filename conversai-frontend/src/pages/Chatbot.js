import { useState } from "react";
import axios from "axios";
import { PaperAirplaneIcon } from "@heroicons/react/solid";

function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "👋 Hello! What are you looking for today?", sender: "bot", images: [] },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user", images: [] };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/chat", { message: input });

      const botResponse = {
        text: response.data.response,
        sender: "bot",
        images: response.data.images || [], // Now images are full URLs
      };

      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, botResponse]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages((prevMessages) => [
        { text: "❌ Oops! Something went wrong.", sender: "bot", images: [] }
      ]);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white">
      <div className="max-w-2xl w-full bg-gray-800 shadow-lg rounded-lg overflow-hidden mt-10">
        <div className="p-5 bg-gray-900 text-center text-xl font-semibold">🛍️ ConversAI Shopping Assistant</div>
        <div className="h-96 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}>
              {msg.sender === "bot" && (
                <img src="https://i.imgur.com/8Km9tLL.png" alt="Bot" className="w-8 h-8 rounded-full mr-2" />
              )}
              <div className={`p-3 rounded-lg max-w-xs ${msg.sender === "bot" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-900"}`}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Display Images for Bot Responses */}
          {messages.map((msg, index) =>
            msg.sender === "bot" && msg.images.length > 0 ? (
              <div key={`img-${index}`} className="flex flex-wrap mt-2">
                {msg.images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={image}
                    alt="Suggested Product"
                    className="w-24 h-24 object-cover rounded-lg m-1 border border-gray-500"
                  />
                ))}
              </div>
            ) : null
          )}

          {isTyping && (
            <div className="flex items-center space-x-2">
              <img src="https://i.imgur.com/8Km9tLL.png" alt="Bot" className="w-8 h-8 rounded-full" />
              <div className="animate-pulse bg-blue-500 px-3 py-1 rounded-lg">...</div>
            </div>
          )}
        </div>
        <div className="p-3 bg-gray-900 flex">
          <input
            type="text"
            className="flex-grow p-2 rounded-l-lg bg-gray-700 text-white border-none outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} className="bg-blue-500 p-3 rounded-r-lg">
            <PaperAirplaneIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
