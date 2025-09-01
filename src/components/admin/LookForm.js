import React, { useState, useEffect } from 'react';
import { createLook, updateLook, fetchProducts } from '../../api';
import { useAuth } from '../../context/AuthContext';

const INITIAL_STATE = {
    title: '',
    description: '',
    mainImage: '',
};

const LookForm = ({ look, onFormClose }) => {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [selectedProducts, setSelectedProducts] = useState([]); // This will now ONLY store string IDs
    const [allProducts, setAllProducts] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const getProducts = async () => {
            try {
                const productsData = await fetchProducts();
                setAllProducts(productsData);
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
            // FIX: Ensure selectedProducts is always an array of string IDs,
            // regardless of whether look.products is populated with objects or just contains IDs.
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
                // Add the new product ID if it's not already in the list
                return prevIds.includes(productId) ? prevIds : [...prevIds, productId];
            } else {
                // Remove the product ID
                return prevIds.filter(id => id !== productId);
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        
        // The selectedProducts state is guaranteed to be an array of IDs.
        const finalLookData = { ...formData, products: selectedProducts };

        try {
            if (look) {
                await updateLook(look._id, finalLookData, token);
            } else {
                await createLook(finalLookData, token);
            }
            onFormClose();
        } catch (err) {
            setError(err.message || 'An error occurred.');
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
                <form onSubmit={handleSubmit} className="admin-form">
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-group">
                        <label htmlFor="title">Look Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mainImage">Main Image URL</label>
                        <input type="text" name="mainImage" value={formData.mainImage} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows="4"></textarea>
                    </div>

                    <div className="form-group">
                        <label>Select Products for this Look</label>
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
                        <button type="button" className="admin-btn-cancel" onClick={onFormClose}>Cancel</button>
                        <button type="submit" className="admin-btn-save" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save Look'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LookForm;