// src/components/AdminAddProduct.jsx
import React, { useState } from 'react';

const AdminAddProduct = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!title || !price || !category || !image) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('image', image);

    try {
      const res = await fetch('http://localhost/crtvsite/backend/products/add_product.php', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setMessage('Product added successfully!');
        setTitle('');
        setPrice('');
        setDescription('');
        setCategory('');
        setImage(null);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error adding product: ' + error.message);
    }
  };

  return (
    <div className="products-view">
      <h1 className="page-title text-black mb-4">Add New Product</h1>
      {message && (
        <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <input type="text" placeholder="Product Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded border" required />
        <input type="number" placeholder="Price (R)" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 rounded border" required />
        <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 rounded border" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 rounded border" required>
          <option value="">-- Select Category --</option>
          <option value="Tracksuits">Tracksuits</option>
          <option value="Hoodies">Hoodies</option>
          <option value="T-Shirts">T-Shirts</option>
          <option value="Sweatshirts">Sweatshirts</option>
          <option value="Pants">Pants</option>
          <option value="Shorts">Shorts</option>
          <option value="Jackets">Jackets</option>
          <option value="Sneakers">Sneakers</option>
          <option value="Caps">Caps</option>
          <option value="Accessories">Accessories</option>
        </select>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
