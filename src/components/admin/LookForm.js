import React, { useState, useEffect } from 'react';
import { createLook, updateLook, fetchProducts } from '../../api';
import { useAuth } from '../../context/AuthContext';

const INITIAL_STATE = {
    title: '',
    description: '',
    mainImage: '',
};

const LookForm = ({ look, onFormClose, logout, navigate }) => {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const getProducts = async () => {
            try {
                // Fetch a large number of products for the admin form
                const responseData = await fetchProducts('', false, '', {}, 1, 500);
                // Handle both paginated object and direct array responses for robustness
                const productsArray = responseData.products || (Array.isArray(responseData) ? responseData : []);
                setAllProducts(productsArray);
            } catch (err) {
                setError('Failed to load products for selection.');
            }
        };
        getProducts();
    }, []);

    useEffect(() => {
        if (look) {
            setFormData({
                title: look.title,
                description: look.description,
                mainImage: look.mainImage,
            });
            const productIds = (look.products || []).map(p => (typeof p === 'object' ? p._id : p));
            setSelectedProducts(productIds);
        } else {
            setFormData(INITIAL_STATE);
            setSelectedProducts([]);
        }
    }, [look]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleProductSelect = (e) => {
        const productId = e.target.value;
        setSelectedProducts(prevIds => {
            if (e.target.checked) {
                return prevIds.includes(productId) ? prevIds : [...prevIds, productId];
            } else {
                return prevIds.filter(id => id !== productId);
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        
        const finalLookData = { ...formData, products: selectedProducts };

        try {
            if (look) {
                await updateLook(look._id, finalLookData, token);
            } else {
                await createLook(finalLookData, token);
            }
            onFormClose();
        } catch (err) {
            if (err.message && (err.message.includes('Token is not valid') || err.message.includes('authorization denied'))) {
                logout();
                navigate('/login?redirectTo=/admin');
            } else {
                setError(err.message || 'An error occurred.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-form-modal-overlay" onClick={onFormClose}>
            <div className="admin-form-modal" onClick={e => e.stopPropagation()}>
                <header className="admin-form-header">
                    <h2>{look ? 'Edit Look' : 'Create New Look'}</h2>
                    <button onClick={onFormClose} className="close-button">&times;</button>
                </header>
                <form onSubmit={handleSubmit} className="admin-form two-column-grid">
                    {error && <p className="error-message full-width">{error}</p>}

                    <div className="form-field">
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required placeholder=" " />
                        <label htmlFor="title">Look Title</label>
                    </div>
                    
                    <div className="form-field">
                        <input type="text" id="mainImage" name="mainImage" value={formData.mainImage} onChange={handleChange} required placeholder=" " />
                        <label htmlFor="mainImage">Main Image URL</label>
                    </div>

                    <div className="form-field full-width">
                         <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows="3" placeholder=" "></textarea>
                         <label htmlFor="description">Description</label>
                    </div>

                    <div className="form-field full-width">
                        <label style={{ position: 'static', transform: 'none', fontSize: '1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Select Products for this Look</label>
                        <div className="product-selection-list">
                            {allProducts.length > 0 ? allProducts.map(product => (
                                <div key={product._id} className="product-selection-item">
                                    <input 
                                        type="checkbox" 
                                        id={`prod-${product._id}`} 
                                        value={product._id}
                                        checked={selectedProducts.includes(product._id)}
                                        onChange={handleProductSelect}
                                    />
                                    <img src={product.image} alt={product.name} />
                                    <label htmlFor={`prod-${product._id}`}>{product.name}</label>
                                </div>
                            )) : <p>No products available to select.</p>}
                        </div>
                    </div>
                    
                    <div className="admin-form-actions">
                        <button type="button" className="admin-btn admin-btn-cancel" onClick={onFormClose}>Cancel</button>
                        <button type="submit" className="admin-btn admin-btn-save" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save Look'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LookForm;