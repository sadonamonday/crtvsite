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
      <h1 className="page-title">Add New Product</h1>
      {message && (
        <div className={`product-message ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>
      )}
      <div className="settings-card">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="product-form-grid">
            <div>
              <label className="settings-label">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="settings-input" placeholder="Product Title" required />
            </div>
            <div>
              <label className="settings-label">Price (R)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="settings-input" placeholder="0" required />
            </div>
            <div className="full-row">
              <label className="settings-label">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="settings-input" placeholder="Description (optional)" />
            </div>
            <div>
              <label className="settings-label">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="settings-input" required>
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
            </div>
            <div>
              <label className="settings-label">Product Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files && e.target.files[0])} className="settings-input" required />
            </div>
            <div className="full-row">
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Add Product</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
