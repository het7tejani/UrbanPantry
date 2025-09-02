import React, { useState, useEffect, useCallback } from 'react';
import { fetchProductById, fetchProducts } from '../api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import ProductReviews from '../components/ProductReviews';

const ProductDetailsPage = ({ productId, navigate }) => {
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { wishlist, toggleWishlist } = useWishlist();

    const getProductData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setRelatedProducts([]);
        setQuantity(1); // Reset quantity on product change
        try {
            const productData = await fetchProductById(productId);
            setProduct(productData);

            if (productData && productData.category) {
                const relatedData = await fetchProducts(productData.category, false, '', {}, 1, 5);
                const filteredRelated = (relatedData.products || [])
                    .filter(p => p._id !== productId)
                    .slice(0, 4);
                setRelatedProducts(filteredRelated);
            }

        } catch (err) {
            if (err instanceof TypeError && err.message === 'Failed to fetch') {
                setError('Unable to connect to the server. Please try again later.');
            } else {
                setError(err.message || 'Could not fetch product details.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        getProductData();
    }, [getProductData]);

    const handleQuantityChange = (amount) => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + amount;
            return newQuantity < 1 ? 1 : newQuantity;
        });
    };
    
    const handleReviewSubmitted = () => {
        // Refetch product data to update average rating display
        fetchProductById(productId).then(setProduct).catch(console.error);
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loader-container" style={{height: '60vh'}}>
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    if (!product) return null;

    const isInWishlist = wishlist.includes(product._id);

    return (
        <div className="product-details-page">
            <div className="container">
                <div className="product-details-grid">
                    <div className="product-image-container">
                        <img src={product.image} alt={product.name} className="product-main-image" />
                    </div>
                    <div className="product-info">
                        <h1>{product.name}</h1>
                        <div className="product-rating-summary">
                            <StarRating rating={product.rating} text={`${product.numReviews || 0} reviews`} />
                        </div>
                        <p className="price">₹{(product.price || 0).toFixed(2)}</p>

                        <div className="actions">
                            <div className="quantity-selector">
                                <button onClick={() => handleQuantityChange(-1)} aria-label="Decrease quantity">-</button>
                                <span className="quantity-display">{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)} aria-label="Increase quantity">+</button>
                            </div>
                            <button className="add-to-cart-btn" onClick={() => addToCart(product, quantity)}>Add to Cart</button>
                        </div>

                        <button className={`add-to-wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}`} onClick={() => toggleWishlist(product._id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                            {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                        </button>
                        
                        <div className="product-details-section">
                            <h2>About this item</h2>
                            <p className="product-description">{product.description}</p>
                        </div>

                        {product.details && product.details.length > 0 && (
                            <div className="product-details-section">
                                <h2>Product details</h2>
                                <table className="product-spec-table">
                                    <tbody>
                                        {product.details.map(detail => (
                                            <tr key={detail.key}>
                                                <td>{detail.key}</td>
                                                <td>{detail.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container">
                <ProductReviews productId={productId} onReviewSubmitted={handleReviewSubmitted} />
            </div>

            {relatedProducts.length > 0 && (
                <section className="related-products-section container">
                    <h2 className="section-title">Complete the Set</h2>
                    <div className="product-grid">
                        {relatedProducts.map(relatedProduct => (
                            <ProductCard 
                                key={relatedProduct._id} 
                                product={relatedProduct} 
                                onViewProduct={(id) => navigate(`/products/${id}`)}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProductDetailsPage;