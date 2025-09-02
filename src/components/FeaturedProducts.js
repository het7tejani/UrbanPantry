import React, { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import { fetchProducts } from '../api';

const FeaturedProducts = ({ onViewProduct }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFeaturedProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const featuredProducts = await fetchProducts('', true, 4);
                setProducts(featuredProducts);
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

    return (
        <section className="container">
            <h2 className="section-title">Best Sellers</h2>
            <ProductGrid
                loading={loading}
                error={error}
                products={products}
                onViewProduct={onViewProduct}
                emptyStateOptions={{
                    title: "Our Best Sellers will be here soon!",
                    message: "We're curating our collection. Check back shortly to see our top products."
                }}
            />
        </section>
    );
};

export default FeaturedProducts;