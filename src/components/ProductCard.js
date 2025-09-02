import React from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useQuickView } from '../context/QuickViewContext';
import StarRating from './StarRating';

const ProductCard = ({ product, onViewProduct }) => {
    const { addToCart } = useCart();
    const { wishlist, toggleWishlist } = useWishlist();
    const { setQuickViewProductId } = useQuickView();

    const handleAddToCartClick = (e) => {
        e.stopPropagation();
        addToCart(product);
    };

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        toggleWishlist(product._id);
    };
    
    const handleQuickViewClick = (e) => {
        e.stopPropagation();
        setQuickViewProductId(product._id);
    };
    
    const handleCardClick = () => {
        onViewProduct(product._id);
    };

    const isInWishlist = wishlist.includes(product._id);

    return (
        <div className="product-card" onClick={handleCardClick}>
            <div className="product-card-image-container">
                <img src={product.image} alt={product.name} className="product-card-image" loading="lazy" />
                 <button 
                    className={`wishlist-button ${isInWishlist ? 'in-wishlist' : ''}`}
                    onClick={handleWishlistClick}
                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                </button>
            </div>
            <div className="product-card-info">
                <h3 className="product-card-name">{product.name}</h3>
                <div className="product-card-rating">
                    {product.numReviews > 0 && <StarRating rating={product.rating} text={`(${product.numReviews})`} />}
                </div>
                <p className="product-card-price">${(product.price || 0).toFixed(2)}</p>
            </div>
            <div className="product-card-action-bar">
                <button className="button quick-view-button" onClick={handleQuickViewClick}>Quick View</button>
                <button className="button add-to-cart-button" onClick={handleAddToCartClick}>Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductCard;