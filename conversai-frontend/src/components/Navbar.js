import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-white text-lg font-bold">
          ConversAI
        </Link>
        <div className="space-x-4">
          <Link to="/products" className="text-gray-300 hover:text-white">
            Products
          </Link>
          <Link to="/chat" className="text-gray-300 hover:text-white">
            Chatbot
          </Link>
          <Link to="/cart" className="text-gray-300 hover:text-white">
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
