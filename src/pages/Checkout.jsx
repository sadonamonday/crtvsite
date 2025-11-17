import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext.jsx";

const Checkout = () => {
  const { cartItems, total, clearCart } = useCart();
  const { user } = useContext(UserContext); // Logged-in user
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const shippingRate = 110;

  // Initialize form with user info if available
  useEffect(() => {
    if (user) {
      setShippingInfo({
        name: user.firstname || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
    setLoading(false);
  }, [user]);

  const handlePlaceOrder = async () => {
    // ✅ Require login
    if (!user) {
      alert("You must be logged in to place an order.");
      navigate("/login");
      return;
    }

    const { name, email, address } = shippingInfo;

    if (!name || !email || !address) {
      alert("Please fill in your name, email, and shipping address.");
      return;
    }

    const finalTotal = total + shippingRate;
    const orderData = {
      name,   // Must match database column
      email,  // Must match database column
      address,// Must match database column
      items: cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
      })),
      subtotal: parseFloat(total),
      shipping: parseFloat(shippingRate),
      total: parseFloat(finalTotal),
    };

    try {
      setSubmitting(true);
      const response = await fetch(
        "https://crtvshotss.atwebpages.com/orders/place_order.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        alert("Server returned invalid response. Check console.");
        return;
      }

      if (data.success) {
        alert("Order placed successfully!");
        clearCart();
        navigate("/");
      } else {
        alert("Error placing order: " + (data.message || "Unknown error"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-900">
        Loading checkout...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <div className="h-24"></div>
      <div className="flex-grow pt-5 px-6 text-gray-900 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-700 text-center">Your cart is empty.</p>
        ) : (
          <>
            {/* Order Details */}
            <div className="bg-white p-4 rounded mb-6 shadow">
              <h2 className="text-xl font-semibold mb-2">Order Details</h2>
              <ul className="space-y-2">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between bg-gray-100 p-3 rounded"
                  >
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span>R{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-right text-xl font-bold text-yellow-400">
                Subtotal: R{total}
              </div>
            </div>

            {/* Shipping */}
            <div className="mb-6 flex justify-between items-center bg-gray-100 p-3 rounded">
              <span>Shipping:</span>
              <span>Flat Rate: R{shippingRate}</span>
            </div>

            {/* Shipping Info */}
            <div className="mb-6 bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-3">Shipping Information</h2>
              <div className="space-y-3">
                {/* Name */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.name}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Shipping Address */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Shipping Address
                  </label>
                  <textarea
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, address: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter your shipping address"
                    rows="3"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="mb-6 flex justify-between items-center text-xl font-bold text-yellow-400 bg-gray-100 p-3 rounded">
              <span>Total:</span>
              <span>R{total + shippingRate}</span>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              className={`${
                submitting ? "bg-green-400" : "bg-green-700 hover:bg-green-800"
              } text-black font-semibold px-6 py-3 rounded w-full transition`}
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
