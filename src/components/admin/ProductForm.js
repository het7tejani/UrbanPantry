import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../../api';
import { useAuth } from '../../context/AuthContext';

const INITIAL_STATE = {
    name: '',
    price: '',
    image: '',
    category: 'Kitchen',
    featured: false,
    description: '',
};

const ProductForm = ({ product, onFormClose, logout, navigate }) => {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [details, setDetails] = useState([{ key: '', value: '' }]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                featured: product.featured,
                description: product.description,
            });
            setDetails(product.details && product.details.length > 0 ? product.details : [{ key: '', value: '' }]);
        } else {
            setFormData(INITIAL_STATE);
            setDetails([{ key: '', value: '' }]);
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDetailChange = (index, e) => {
        const newDetails = [...details];
        newDetails[index][e.target.name] = e.target.value;
        setDetails(newDetails);
    };

    const addDetailField = () => {
        setDetails([...details, { key: '', value: '' }]);
    };

    const removeDetailField = (index) => {
        setDetails(details.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        
        const finalProductData = {
            ...formData,
            price: parseFloat(formData.price),
            details: details.filter(d => d.key.trim() && d.value.trim()) // Only include non-empty details
        };

        try {
            if (product) {
                await updateProduct(product._id, finalProductData, token);
            } else {
                await createProduct(finalProductData, token);
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
                    <h2>{product ? 'Edit Product' : 'Create New Product'}</h2>
                    <button onClick={onFormClose} className="close-button">&times;</button>
                </header>
                <form onSubmit={handleSubmit} className="admin-form two-column-grid">
                    {error && <p className="error-message full-width">{error}</p>}
                    
                    <div className="form-field full-width">
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder=" " />
                        <label htmlFor="name">Product Name</label>
                    </div>

                    <div className="form-field">
                        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required step="0.01" placeholder=" " />
                        <label htmlFor="price">Price</label>
                    </div>

                    <div className="form-field">
                        <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                            <option value="Kitchen">Kitchen</option>
                            <option value="Decor">Decor</option>
                            <option value="Bedding">Bedding</option>
                            <option value="Lighting">Lighting</option>
                        </select>
                        <label htmlFor="category">Category</label>
                    </div>
                    
                    <div className="form-field full-width">
                        <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} required placeholder=" "/>
                        <label htmlFor="image">Image URL</label>
                    </div>
                    
                    <div className="form-field full-width">
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows="3" placeholder=" "></textarea>
                        <label htmlFor="description">Description</label>
                    </div>

                    <h3 className="admin-form-subtitle full-width">Product Details (Optional)</h3>
                    <div className="form-field full-width">
                        {details.map((detail, index) => (
                            <div key={index} className="detail-row">
                                <div className="form-field">
                                    <input type="text" name="key" placeholder=" " value={detail.key} onChange={(e) => handleDetailChange(index, e)} />
                                    <label>Attribute</label>
                                </div>
                                <div className="form-field">
                                    <input type="text" name="value" placeholder=" " value={detail.value} onChange={(e) => handleDetailChange(index, e)} />
                                    <label>Value</label>
                                </div>
                                <button type="button" onClick={() => removeDetailField(index)} className="admin-btn-delete-detail">-</button>
                            </div>
                        ))}
                        <button type="button" onClick={addDetailField} className="admin-btn-add-detail">+ Add Detail</button>
                    </div>
                    
                    <div className="form-group form-group-checkbox full-width">
                        <input type="checkbox" name="featured" id="featured" checked={formData.featured} onChange={handleChange} />
                        <label htmlFor="featured">Feature this product on the homepage</label>
                    </div>

                    <div className="admin-form-actions">
                        <button type="button" className="admin-btn admin-btn-cancel" onClick={onFormClose}>Cancel</button>
                        <button type="submit" className="admin-btn admin-btn-save" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;