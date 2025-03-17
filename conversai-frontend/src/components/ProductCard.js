import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    // Hide the message after 2 seconds
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white">
      <img
        src={product.picture_url}
        alt={product.p_name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="font-bold text-xl mb-2">{product.p_name}</h2>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <p className="text-gray-800 font-bold mb-2">${product.price}</p>
        <a
          href={product.product_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline block mb-2"
        >
          View on Site
        </a>
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add to Cart
        </button>
        {added && <p className="text-green-600 mt-2">Added to cart!</p>}
      </div>
    </div>
  );
}

export default ProductCard;
