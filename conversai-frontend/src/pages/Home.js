import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-gray-900">ConversAI: AI Shopping Assistant</h1>
      <p className="mt-4 text-gray-600">
        Revolutionizing online shopping with AI-powered recommendations.
      </p>
      <Link to="/chat">
        <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Try the Demo
        </button>
      </Link>
      
      {/* Logo Section */}
      <img
        src="images/ConversAI.webp"  // <-- Replace with your actual logo path
        alt="ConversAI Logo"
        className="mt-8 w-40 sm:w-52 md:w-64 lg:w-72"
      />
    </div>
  );
}

export default Home;
