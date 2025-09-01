import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../api';

const CategoryGrid = ({ navigate }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                if (err instanceof TypeError && err.message === 'Failed to fetch') {
                    setError('Unable to connect to the server. Please try again later.');
                } else {
                    setError(err.message || 'Could not fetch categories.');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getCategories();
    }, []);

    const handleCategoryClick = (categoryName) => {
        navigate(`/${categoryName.toLowerCase()}`);
    };

    if (loading) {
         return (
            <section className="container">
                <h2 className="section-title">Shop by Category</h2>
                <div className="loader-container"><div className="loader"></div></div>
            </section>
        );
    }

    if (error) {
         return (
            <section className="container">
                <h2 className="section-title">Shop by Category</h2>
                <p className="error-message">{error}</p>
            </section>
        );
    }

    return (
        <section className="container">
            <h2 className="section-title">Shop by Category</h2>
            <div className="category-grid">
                {categories.map(category => (
                    <div key={category.name} className="category-card" onClick={() => handleCategoryClick(category.name)}>
                        <img src={category.image} alt={category.name} className="category-image" loading="lazy" />
                        <div className="category-overlay">
                            <h3 className="category-name">{category.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;