import React, { useState, useEffect } from 'react';
import { fetchLookById } from '../api';
import ProductCard from '../components/ProductCard';

const LookDetailsPage = ({ lookId, onViewProduct }) => {
    const [look, setLook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getLookData = async () => {
            setLoading(true);
            setError(null);
            try {
                const lookData = await fetchLookById(lookId);
                setLook(lookData);
            } catch (err) {
                if (err instanceof TypeError && err.message === 'Failed to fetch') {
                    setError('Unable to connect to the server. Please try again later.');
                } else {
                    setError(err.message || 'Could not fetch look details.');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getLookData();
    }, [lookId]);

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

    if (!look) return null;

    return (
        <>
            <header className="look-hero">
                <img src={look.mainImage} alt={look.title} className="look-hero-image" />
                <h1 className="look-hero-title">{look.title}</h1>
                <p className="look-hero-description">{look.description}</p>
            </header>
            
            <section className="container look-products-section">
                <h2>Products in this Look</h2>
                {look.products && look.products.length > 0 ? (
                    <div className="product-grid">
                        {look.products.map(product => (
                            <ProductCard 
                                key={product._id} 
                                product={product} 
                                onViewProduct={onViewProduct}
                            />
                        ))}
                    </div>
                ) : (
                    <p style={{textAlign: 'center'}}>No products are currently assigned to this look.</p>
                )}
            </section>
        </>
    );
};

export default LookDetailsPage;
