import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const WishlistPage = ({ onViewProduct, navigate }) => {
    const { wishlistProducts, loading } = useWishlist();
    const { user } = useAuth();

    const renderContent = () => {
        if (loading) {
            return <div className="loader-container"><div className="loader"></div></div>;
        }

        if (!user) {
             return (
                <div className="wishlist-empty">
                    <h2>Please Log In</h2>
                    <p>Log in to view your wishlist and save your favorite items.</p>
                    <button className="button" onClick={() => navigate('/login?redirectTo=/wishlist')}>Login</button>
                </div>
            );
        }

        if (wishlistProducts.length === 0) {
            return (
                <div className="wishlist-empty">
                    <h2>Your Wishlist is Empty</h2>
                    <p>You haven’t saved any items yet. Start exploring and add products you love!</p>
                    <button className="button" onClick={() => navigate('/')}>Start Shopping</button>
                </div>
            );
        }

        return (
            <div className="product-grid">
                {wishlistProducts.map(product => (
                    <ProductCard key={product._id} product={product} onViewProduct={onViewProduct} />
                ))}
            </div>
        );
    };

    return (
        <div className="container">
            <h1 className="section-title">My Wishlist</h1>
            {renderContent()}
        </div>
    );
};

export default WishlistPage;