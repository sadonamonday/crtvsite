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
      name,
      email,
      address,
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
        "https://crtvshotss.atwebpages.com/place_merch_order.php",
        {
          method: "POST",
          credentials: "include",
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
        setSubmitting(false);
        return;
      }

      if (data.success) {
        // Redirect to PayFast payment
        const orderId = data.order_id;
        const payfastUrl = "https://sandbox.payfast.co.za/eng/process";
        
        // Use PayFast test credentials for sandbox
        const payfastData = data.payfast;


        // Create and submit form
        const form = document.createElement("form");
        form.method = "POST";
        form.action = payfastUrl;

        Object.keys(payfastData).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = payfastData[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        
        // Clear cart after successful order placement
        clearCart();
      } else {
        alert("Error placing order: " + (data.message || "Unknown error"));
        setSubmitting(false);
      }
    } catch (error) {
      alert("Failed to place order. Please try again.");
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
      <div className="flex-grow pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-gray-900">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-700 text-center text-lg mt-20 mb-20">Your cart is empty.</p>
        ) : (
          <>
            {/* Order Details */}
            <div className="bg-white p-6 rounded-lg mb-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              <ul className="space-y-3">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded gap-4"
                  >
                    <div className="flex items-center gap-3 flex-grow">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded flex-shrink-0"
                      />
                      <span className="font-medium">
                        {item.title} × {item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold">R{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-200 text-right text-xl font-bold text-gray-900">
                Subtotal: R{total}
              </div>
            </div>

            {/* Shipping */}
            <div className="mb-6 flex justify-between items-center bg-white p-5 rounded-lg shadow-md">
              <span className="font-semibold text-lg">Shipping:</span>
              <span className="font-semibold text-lg">Flat Rate: R{shippingRate}</span>
            </div>

            {/* Shipping Info */}
            <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-5">Shipping Information</h2>
              <div className="space-y-4">
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#06d6a0] focus:border-transparent"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#06d6a0] focus:border-transparent"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#06d6a0] focus:border-transparent"
                    placeholder="Enter your shipping address"
                    rows="4"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="mb-6 flex justify-between items-center text-2xl font-bold text-gray-900 bg-gray-100 p-6 rounded-lg">
              <span>Total:</span>
              <span className="text-[#06d6a0]">R{total + shippingRate}</span>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className={`${
                submitting 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#06d6a0] hover:bg-[#05b88c]"
              } text-black font-bold text-lg px-8 py-4 rounded-lg w-full transition shadow-md`}
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
