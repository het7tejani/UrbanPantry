import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../api';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';

const DecorPage = ({ onViewProduct }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('featured');
    const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', rating: 0 });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const headerImage = 'https://images.unsplash.com/photo-1534349762234-2a68e0a13e5e?q=80&w=1600&auto=format&fit=crop';

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const decorProducts = await fetchProducts('Decor', false, 0, sortOrder, filters);
                setProducts(decorProducts);
            } catch (err) {
                if (err instanceof TypeError && err.message === 'Failed to fetch') {
                    setError('Unable to connect to the server. Please try again later.');
                } else {
                    setError(err.message || 'Failed to fetch decor products.');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, [sortOrder, filters]);
    
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <>
            <header className="page-header" style={{ backgroundImage: `url(${headerImage})`}}>
                <h1 className="page-header-title">Home Decor</h1>
            </header>
            <div className="container page-with-sidebar">
                <FilterSidebar 
                    initialFilters={filters} 
                    onFilterChange={handleFilterChange} 
                    isOpen={isFilterOpen} 
                    onClose={() => setIsFilterOpen(false)}
                    sortOrder={sortOrder}
                    onSortChange={setSortOrder}
                    showSort={true}
                />
                <div className="page-content">
                    <div className="page-controls-bar">
                        <button className="filter-toggle-button" onClick={() => setIsFilterOpen(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width: '20px', height: '20px'}}><path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.59L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z" clipRule="evenodd" /></svg>
                            <span>Filter & Sort</span>
                        </button>
                    </div>
                    <ProductGrid
                        loading={loading}
                        error={error}
                        products={products}
                        onViewProduct={onViewProduct}
                        emptyStateOptions={{ title: "No Decor Found", message: "Try adjusting your filters to find the perfect decor." }}
                    />
                </div>
            </div>
        </>
    );
};

export default DecorPage;
