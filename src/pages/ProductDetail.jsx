import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product) {
      const productWithSize = {
        ...product,
        selectedSize: selectedSize || (product.sizes && product.sizes[0]) || "One Size"
      };
      addToCart(productWithSize);
      alert(`${product.title} ${selectedSize ? `(Size: ${selectedSize})` : ''} added to cart!`);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://crtvshotss.atwebpages.com/products/get_product.php?id=${id}`
        );
        const data = await res.json();
        if (data.error) {
          alert(data.error);
          navigate("/merch");
        } else {
          // Ensure product has sizes array
          const productWithSizes = {
            ...data,
            sizes: Array.isArray(data.sizes) && data.sizes.length > 0 
              ? data.sizes 
              : ["One Size"]
          };
          setProduct(productWithSizes);
          // Set default selected size
          setSelectedSize(productWithSizes.sizes[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-900">
        Loading product...
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      <div className="h-24"></div>
      <div className="flex flex-col md:flex-row items-start justify-center pt-20 pb-10 px-4 sm:px-6 lg:px-8 gap-10">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.title}
          className="w-full md:w-1/3 rounded-lg shadow-lg"
        />

        {/* Product Info */}
        <div className="flex flex-col text-gray-900 w-full md:w-1/2">
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-2xl font-semibold mb-4">R{product.price}</p>
          
          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-gray-700 text-lg font-medium mb-3">
                Size: {selectedSize && <span className="text-[#06d6a0] font-semibold">{selectedSize}</span>}
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-base rounded border transition-all ${
                      selectedSize === size
                        ? "bg-[#06d6a0] text-black border-[#06d6a0] font-semibold transform scale-105"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="mb-6 text-gray-700 leading-relaxed">
            {product.description || "No description available."}
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              className="bg-[#06d6a0] hover:bg-[#05b88c] text-black p-3 rounded font-semibold transition flex-1"
              onClick={handleAddToCart}
            >
              Add to Cart {selectedSize && `- ${selectedSize}`}
            </button>

            <button
              className="bg-gray-200 text-gray-900 p-3 rounded hover:bg-gray-300 transition flex-1"
              onClick={() => navigate("/merch")}
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;