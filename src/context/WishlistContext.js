import React, { useState, createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, token } = useAuth();

    useEffect(() => {
        const getWishlist = async () => {
            if (user && token) {
                setLoading(true);
                try {
                    const data = await fetchWishlist(token);
                    setWishlist(data.products.map(p => p._id));
                    setWishlistProducts(data.products);
                } catch (error) {
                    console.error("Failed to fetch wishlist:", error);
                    // Handle error, maybe show a toast notification
                } finally {
                    setLoading(false);
                }
            } else {
                // Clear wishlist if user logs out
                setWishlist([]);
                setWishlistProducts([]);
            }
        };
        getWishlist();
    }, [user, token]);

    const toggleWishlist = async (productId) => {
        if (!user || !token) {
            alert('Please log in to add items to your wishlist.');
            // or navigate to login page
            return;
        }

        const isInWishlist = wishlist.includes(productId);
        
        // Optimistic UI update
        if (isInWishlist) {
            setWishlist(prev => prev.filter(id => id !== productId));
        } else {
            setWishlist(prev => [...prev, productId]);
        }
        
        try {
            if (isInWishlist) {
                await removeFromWishlist(productId, token);
            } else {
                await addToWishlist(productId, token);
            }
            // Refetch the whole wishlist to ensure sync
            const data = await fetchWishlist(token);
            setWishlist(data.products.map(p => p._id)); // <-- FIX: Sync the IDs array
            setWishlistProducts(data.products);

        } catch (error) {
            console.error('Failed to update wishlist:', error);
            // Revert optimistic update on error
             if (isInWishlist) {
                setWishlist(prev => [...prev, productId]);
            } else {
                setWishlist(prev => prev.filter(id => id !== productId));
            }
        }
    };
    
    const value = {
        wishlist, // array of product IDs
        wishlistProducts, // array of full product objects
        toggleWishlist,
        loading
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);