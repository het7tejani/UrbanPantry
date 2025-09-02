import React, { useState, useEffect, useCallback } from 'react';
import { fetchProducts, deleteProduct } from '../../api';
import { useAuth } from '../../context/AuthContext';
import ProductForm from './ProductForm';

const ProductManager = ({ navigate }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const { token, logout } = useAuth();

    const handleAuthError = useCallback((err) => {
        if (err.message && (err.message.includes('Token is not valid') || err.message.includes('authorization denied'))) {
            logout();
            navigate('/login?redirectTo=/admin');
            return true;
        }
        return false;
    }, [logout, navigate]);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            if (!token) {
                logout();
                navigate('/login?redirectTo=/admin');
                return;
            }
            const responseData = await fetchProducts('', false, '', {}, 1, 500);
            // Handle both paginated object and direct array responses for robustness
            const productsArray = responseData.products || (Array.isArray(responseData) ? responseData : []);
            setProducts(productsArray);
        } catch (err) {
            if (!handleAuthError(err)) {
                setError(err.message || 'Failed to fetch products');
            }
        } finally {
            setLoading(false);
        }
    }, [token, handleAuthError, logout, navigate]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            setError('');
            try {
                await deleteProduct(productId, token);
                loadProducts(); // Refresh list
            } catch (err) {
                if (!handleAuthError(err)) {
                    setError(err.message);
                }
            }
        }
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingProduct(null);
        loadProducts(); // Refresh list after create/edit
    };

    const renderContent = () => {
        if (loading) return <div className="loader-container"><div className="loader"></div></div>;
        if (error) return <p className="error-message">{error}</p>;
        
        return (
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Featured</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td><img src={product.image} alt={product.name} className="admin-table-img" /></td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>₹{product.price.toFixed(2)}</td>
                            <td>{product.featured ? 'Yes' : 'No'}</td>
                            <td>
                                <div className="admin-actions">
                                    <button onClick={() => handleEdit(product)} className="admin-btn admin-btn-edit">Edit</button>
                                    <button onClick={() => handleDelete(product._id)} className="admin-btn admin-btn-delete">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <section className="admin-section">
            <div className="admin-section-header">
                <h2>Manage Products</h2>
                <button onClick={handleCreate} className="admin-btn admin-btn-create">
                    + Add New Product
                </button>
            </div>
            {renderContent()}
            {showForm && <ProductForm product={editingProduct} onFormClose={handleFormClose} logout={logout} navigate={navigate} />}
        </section>
    );
};

export default ProductManager;