import React, { useState, useEffect } from 'react';
import { fetchLooks } from '../api';

const ShopTheLookPage = ({ onViewLook }) => {
    const [looks, setLooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const getLooks = async () => {
            setLoading(true);
            setError(null);
            try {
                const looksData = await fetchLooks();
                setLooks(looksData);
            } catch (err) {
                 if (err instanceof TypeError && err.message === 'Failed to fetch') {
                    setError('Unable to connect to the server. Please try again later.');
                } else {
                    setError(err.message || 'Failed to fetch looks.');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getLooks();
    }, []);

    const renderContent = () => {
        if (loading) return <div className="loader-container"><div className="loader"></div></div>;
        if (error) return <p className="error-message">{error}</p>;
        if (looks.length === 0) {
            return <p style={{textAlign: 'center'}}>No curated looks available at the moment. Check back soon!</p>;
        }
        
        return (
            <div className="look-gallery">
                {looks.map(look => (
                    <div key={look._id} className="look-card" onClick={() => onViewLook(look._id)}>
                        <img src={look.mainImage} alt={look.title} className="look-card-image" />
                        <div className="look-card-overlay">
                            <h3 className="look-card-title">{look.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container">
            <h1 className="section-title">Shop the Look</h1>
            <p style={{textAlign: 'center', marginTop: '-2rem', marginBottom: '3rem', color: 'var(--secondary-color)'}}>
                Get inspired by our curated collections.
            </p>
            {renderContent()}
        </div>
    );
};

export default ShopTheLookPage;
