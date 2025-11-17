// src/components/AdminAddProduct.jsx
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

// Pagination Component (same as AdminDashboard)
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
        Previous
      </button>
      
      <div className="pagination-pages">
        {startPage > 1 && (
          <>
            <button className="pagination-btn" onClick={() => onPageChange(1)}>1</button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button className="pagination-btn" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
          </>
        )}
      </div>
      
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const AdminAddProduct = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('https://crtvshotss.atwebpages.com/products_list.php');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
        setCurrentPage(1); // Reset to first page when products are refreshed
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setPrice(product.price);
    setDescription(product.description || '');
    setCategory(product.category);
    setImage(null);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setTitle('');
    setPrice('');
    setDescription('');
    setCategory('');
    setImage(null);
    setMessage('');
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      setIsLoading(true);
      const res = await fetch('https://crtvshotss.atwebpages.com/products_delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: productId })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage('Product deleted successfully!');
        fetchProducts();
      } else {
        setMessage(data.message || 'Error deleting product');
      }
    } catch (error) {
      setMessage('Error deleting product: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
      
      if (editingProduct) {
        formData.append('id', editingProduct.id);
      }
      
      if (image) {
        formData.append('image', image);
      }

      const endpoint = editingProduct ? 'products_update.php' : 'add_product.php';
      const res = await fetch(`https://crtvshotss.atwebpages.com/${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setMessage(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
        // Reset form
        setTitle('');
        setPrice('');
        setDescription('');
        setCategory('');
        setImage(null);
        setEditingProduct(null);
        document.getElementById('product-form')?.reset();
        fetchProducts();
      } else {
        setMessage(data.message || `Error ${editingProduct ? 'updating' : 'adding'} product`);
      }
    } catch (error) {
      setMessage(`Error ${editingProduct ? 'updating' : 'adding'} product: ` + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="products-view">
      <h1 className="page-title">Product Management</h1>
      {message && (
        <div className={`product-message ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>
      )}
      
      {/* Products List */}
      <div className="products-list" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
          Existing Products ({products.length})
        </h2>
        {products.length === 0 ? (
          <p style={{ color: '#aaa' }}>No products found.</p>
        ) : (
          <>
            <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {products
                .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                .map((product) => (
              <div key={product.id} className="product-card" style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '15px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {product.image && (
                  <img
                    src={`https://crtvshotss.atwebpages.com/uploads/${product.image}`}
                    alt={product.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                  />
                )}
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{product.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '8px' }}>{product.category}</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4CAF50', marginBottom: '15px' }}>R{product.price}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: '#2196F3',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: '#f44336',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <Pagination 
              currentPage={currentPage}
              totalPages={Math.ceil(products.length / productsPerPage)}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <div className="settings-card">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        {editingProduct && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{
              marginBottom: '15px',
              padding: '8px 16px',
              background: '#666',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Cancel Edit
          </button>
        )}
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
                {isLoading 
                  ? (editingProduct ? 'Updating Product...' : 'Adding Product...') 
                  : (editingProduct ? 'Update Product' : 'Add Product')
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
