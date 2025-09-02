import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api';

const FeaturedProducts = ({ onViewProduct }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFeaturedProducts = async () => {
            try {
                const data = await fetchProducts('', true, 4);
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                if (err instanceof TypeError && err.message === 'Failed to fetch') {
                    setError('Unable to connect to the server. Please try again later.');
                } else {
                    setError(err.message || 'Could not fetch featured products.');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getFeaturedProducts();
    }, []);

    if (loading) {
        return (
            <section className="container">
                <h2 className="section-title">Best Sellers</h2>
                <div className="loader-container"><div className="loader"></div></div>
            </section>
        );
    }
    
    if (error) {
        return (
            <section className="container">
                <h2 className="section-title">Best Sellers</h2>
                <p className="error-message">{error}</p>
            </section>
        );
    }

    return (
        <section className="container">
            <h2 className="section-title">Best Sellers</h2>
            <div className="product-grid">
                {products.map(product => <ProductCard key={product._id} product={product} onViewProduct={onViewProduct} />)}
            </div>
        </section>
    );
};

export default FeaturedProducts;