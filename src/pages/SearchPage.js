import React, { useState, useEffect } from 'react';
import { searchProducts } from '../api';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

const SearchPage = ({ onViewProduct }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', rating: 0 });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const searchQuery = params.get('q');
        setQuery(searchQuery || '');

        if (searchQuery) {
            const getProducts = async () => {
                setLoading(true);
                setError(null);
                try {
                    const searchResults = await searchProducts(searchQuery, filters);
                    setProducts(searchResults);
                } catch (err) {
                    if (err instanceof TypeError && err.message === 'Failed to fetch') {
                        setError('Unable to connect to the server. Please try again later.');
                    } else {
                        setError(err.message || 'Failed to fetch search results.');
                    }
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            getProducts();
        } else {
            setProducts([]);
            setLoading(false);
        }
    }, [window.location.search, filters]);
    
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const renderContent = () => {
        if (loading) return <div className="loader-container"><div className="loader"></div></div>;
        if (error) return <p className="error-message">{error}</p>;
        if (products.length === 0 && query) {
            return <p style={{textAlign: 'center'}}>No products found for "{query}".</p>;
        }
        if (products.length === 0 && !query) {
             return <p style={{textAlign: 'center'}}>Please enter a search term to find products.</p>;
        }
        return (
            <div className="product-grid">
                {products.map(product => (
                    <ProductCard key={product._id} product={product} onViewProduct={onViewProduct} />
                ))}
            </div>
        );
    };

    return (
        <div className="container page-with-sidebar">
            <FilterSidebar 
                initialFilters={filters} 
                onFilterChange={handleFilterChange} 
                isOpen={isFilterOpen} 
                onClose={() => setIsFilterOpen(false)}
                showSort={false}
            />
            <div className="page-content">
                <h1 className="section-title">
                    {query ? `Search Results for "${query}"` : 'Search'}
                </h1>
                <div className="page-controls-bar">
                    <button className="filter-toggle-button" onClick={() => setIsFilterOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width: '20px', height: '20px'}}><path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.59L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z" clipRule="evenodd" /></svg>
                        <span>Filter</span>
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default SearchPage;