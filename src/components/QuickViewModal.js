import React, { useState, useEffect } from 'react';
import { useQuickView } from '../context/QuickViewContext';
import { useCart } from '../context/CartContext';
import { fetchProductById } from '../api';
import StarRating from './StarRating';

const QuickViewModal = ({ navigate }) => {
    const { quickViewProductId, setQuickViewProductId } = useQuickView();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (quickViewProductId) {
            const getProduct = async () => {
                setLoading(true);
                setError('');
                setProduct(null);
                setQuantity(1);
                try {
                    const productData = await fetchProductById(quickViewProductId);
                    setProduct(productData);
                } catch (err) {
                    setError('Failed to load product details.');
                } finally {
                    setLoading(false);
                }
            };
            getProduct();
        }
    }, [quickViewProductId]);

    const handleClose = () => setQuickViewProductId(null);
    
    const handleQuantityChange = (amount) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        handleClose();
    };
    
    const handleViewFullDetails = () => {
        handleClose();
        navigate(`/products/${product._id}`);
    };

    if (!quickViewProductId) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={handleClose} aria-label="Close quick view">&times;</button>
                {loading && <div className="loader-container"><div className="loader"></div></div>}
                {error && <p className="error-message">{error}</p>}
                {product && (
                    <div className="quick-view-content">
                        <div className="quick-view-image-container">
                            <img src={product.image} alt={product.name} className="quick-view-image" />
                        </div>
                        <div className="quick-view-info">
                            <h1>{product.name}</h1>
                            <div className="product-rating-summary">
                                <StarRating rating={product.rating} text={`${product.numReviews || 0} reviews`} />
                            </div>
                            <p className="price">₹{(product.price || 0).toFixed(2)}</p>
                            <p className="description">
                                {product.description.substring(0, 150)}{product.description.length > 150 ? '...' : ''}
                            </p>
                            <div className="actions">
                                <div className="quantity-selector">
                                    <button onClick={() => handleQuantityChange(-1)} aria-label="Decrease quantity">-</button>
                                    <span className="quantity-display">{quantity}</span>
                                    <button onClick={() => handleQuantityChange(1)} aria-label="Increase quantity">+</button>
                                </div>
                                <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
                            </div>
                            <button onClick={handleViewFullDetails} className="view-details-link">View full details</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuickViewModal;