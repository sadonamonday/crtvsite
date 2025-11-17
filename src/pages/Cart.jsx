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
      <div className="h-24"></div>

      <div className="flex-grow pt-24 px-6 text-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-700 mb-4">Your cart is empty.</p>
            <button
              onClick={() => navigate("/merch")}
              className="bg-[#06d6a0] hover:bg-[#05b88c] text-black font-semibold px-6 py-2 rounded transition"
            >
              Go to Shop
            </button>
          </div>
        ) : (
          <>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li
                  key={item.cartId || `${item.id}-${item.selectedSize}`}
                  className="bg-white rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center shadow-md"
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-start gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold text-lg">{item.title}</p>
                        {/* Display selected size */}
                        {item.selectedSize && (
                          <p className="text-gray-600 mt-1">
                            Size: <span className="font-medium text-[#06d6a0]">{item.selectedSize}</span>
                          </p>
                        )}
                        <p className="text-gray-600">
                          R{item.price} × {item.quantity} = <span className="font-semibold">R{item.price * item.quantity}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                      <button
                        onClick={() => decreaseQuantity(item.cartId || item.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center transition"
                      >
                        -
                      </button>
                      <span className="font-semibold min-w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.cartId || item.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartId || item.id)}
                      className="bg-red-400 hover:bg-red-500 text-black px-4 py-2 rounded-lg font-medium transition"
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
