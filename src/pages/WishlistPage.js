import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductGrid from '../components/ProductGrid';
import EmptyState from '../components/EmptyState';

const WishlistPage = ({ onViewProduct, navigate }) => {
    const { wishlistProducts, loading } = useWishlist();
    const { user } = useAuth();

    if (!user && !loading) {
        return (
            <div className="container">
                <EmptyState
                    title="Please Log In"
                    message="Log in to view your wishlist and save your favorite items."
                    ctaText="Login"
                    ctaAction={() => navigate('/login?redirectTo=/wishlist')}
                />
            </div>
        );
    }
    
    return (
        <div className="container">
            <h1 className="section-title">My Wishlist</h1>
            <ProductGrid 
                loading={loading}
                error={null}
                products={wishlistProducts}
                onViewProduct={onViewProduct}
                emptyStateOptions={{
                    title: "Your Wishlist is Empty",
                    message: "You haven’t saved any items yet. Start exploring and add products you love!",
                    ctaText: "Start Shopping",
                    ctaAction: () => navigate('/')
                }}
            />
        </div>
    );
};

export default WishlistPage;
