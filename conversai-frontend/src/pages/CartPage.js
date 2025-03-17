import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useContext(CartContext);

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const handleQuantityChange = (id, delta) => {
    updateQuantity(id, delta);
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout...");
    // Here you can navigate to a payment page or trigger further checkout logic.
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-5">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p className="text-center">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center border-b pb-4">
                  <img
                    src={item.picture_url}
                    alt={item.p_name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div className="flex-grow">
                    <h2 className="font-semibold text-gray-800">{item.p_name}</h2>
                    <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                    <div className="flex items-center mt-2">
                      <button
                        className="px-2 py-1 bg-gray-300 rounded-l"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="px-3 border-y border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        className="px-2 py-1 bg-gray-300 rounded-r"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      className="text-red-500 underline text-sm mt-2"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right mt-6">
              <p className="text-xl">
                Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span>
              </p>
              <button
                className="mt-3 px-4 py-2 bg-blue-600 text-white font-semibold rounded shadow transition hover:bg-blue-700"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
