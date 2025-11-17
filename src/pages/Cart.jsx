import React from "react"; 
import { useCart } from "../context/CartContext.jsx";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    total,
  } = useCart();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full text-gray-900">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center mt-20 mb-20">
            <p className="text-gray-700 text-lg mb-6">Your cart is empty.</p>
            <button
              onClick={() => navigate("/merch")}
              className="bg-[#06d6a0] hover:bg-[#05b88c] text-black font-semibold px-8 py-3 rounded transition"
            >
              Go to Shop
            </button>
          </div>
        ) : (
          <>
            <ul className="space-y-6 mb-8">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="bg-white rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-md gap-6"
                >
                  <div className="flex items-center gap-4 flex-grow">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-lg mb-1">{item.title}</p>
                      <p className="text-gray-600">
                        R{item.price} × {item.quantity} = R{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-3 py-1 rounded font-semibold"
                    >
                      -
                    </button>
                    <span className="font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-3 py-1 rounded font-semibold"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                <div className="text-2xl font-bold text-[#06d6a0]">
                  R{total}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <button
                  onClick={clearCart}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-6 py-3 rounded transition w-full md:w-auto"
                >
                  Clear Cart
                </button>
                
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => navigate("/merch")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-6 py-3 rounded transition flex-1"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => navigate("/checkout")}
                    className="bg-[#06d6a0] hover:bg-[#05b88c] text-black font-semibold px-6 py-3 rounded transition flex-1"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
