import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            ConversAI: Your Smart Chat-Based Shopping Assistant
          </h1>
          <p className="text-2xl mb-8">
            Revolutionizing online shopping with AI-driven personalization.
          </p>
          <Link
            to="/chat"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-full shadow-lg transition duration-300 hover:bg-gray-100"
          >
            Chat with ConversAI
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-semibold mb-4">Seamless Inventory Integration</h3>
              <p className="text-gray-600">
                eCommerce stores can easily upload and organize their inventory, including descriptions, images, sizes, and reviews.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-semibold mb-4">Intelligent Chat-Powered Shopping</h3>
              <p className="text-gray-600">
                Customers interact with a chat assistant that understands natural language, offering tailored product recommendations in real time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-semibold mb-4">Personalized Experience</h3>
              <p className="text-gray-600">
                The assistant learns from user behavior and preferences, refining suggestions and even automating cart generation for unique needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Shopping Experience?</h2>
          <p className="text-xl mb-8">
            Upgrade your online store with ConversAI and offer your customers an immersive, personalized shopping journey.
          </p>
          <Link
            to="/chat"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-full shadow-lg transition duration-300 hover:bg-gray-100"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
