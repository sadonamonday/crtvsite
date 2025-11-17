// src/components/AdminAddProduct.jsx
import React, { useState } from 'react';

const AdminAddProduct = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (!title || !price || !category) {
      setMessage('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', parseFloat(price));
      formData.append('description', description || '');
      formData.append('category', category);
      
      if (image) {
        formData.append('image', image);
      }

      const res = await fetch('https://crtvshotss.atwebpages.com/add_product.php', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setMessage('Product added successfully!');
        // Reset form
        setTitle('');
        setPrice('');
        setDescription('');
        setCategory('');
        setImage(null);
        document.getElementById('product-form')?.reset();
      } else {
        setMessage(data.message || 'Error adding product');
      }
    } catch (error) {
      setMessage('Error adding product: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="products-view">
      <h1 className="page-title">Add New Product</h1>
      {message && (
        <div className={`product-message ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>
      )}
      <div className="settings-card">
        <form id="product-form" onSubmit={handleSubmit} className="product-form">
          <div className="product-form-grid">
            <div>
              <label className="settings-label">Title *</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="settings-input" 
                placeholder="Product Title" 
                required 
              />
            </div>
            <div>
              <label className="settings-label">Price (R) *</label>
              <input 
                type="number" 
                step="0.01"
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                className="settings-input" 
                placeholder="0.00" 
                required 
              />
            </div>
            <div className="full-row">
              <label className="settings-label">Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="settings-input" 
                placeholder="Product description (optional)"
                rows="4"
              />
            </div>
            <div>
              <label className="settings-label">Category *</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="settings-input" 
                required
              >
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
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)} 
                className="settings-input" 
              />
              <small className="text-gray-500">Upload a product image (JPG, PNG, GIF, or WebP)</small>
            </div>
            <div className="full-row">
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%' }}
                disabled={isLoading}
              >
                {isLoading ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
