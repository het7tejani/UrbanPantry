import React, { useState, useEffect } from 'react';

const RATING_LEVELS = [
    { value: 4, label: '4 Stars & Up' },
    { value: 3, label: '3 Stars & Up' },
    { value: 2, label: '2 Stars & Up' },
    { value: 1, label: '1 Star & Up' },
];

const FilterSidebar = ({ initialFilters, onFilterChange, isOpen, onClose, sortOrder, onSortChange, showSort }) => {
    const [minPrice, setMinPrice] = useState(initialFilters.minPrice || '');
    const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || '');
    const [rating, setRating] = useState(initialFilters.rating || 0);

    useEffect(() => {
        setMinPrice(initialFilters.minPrice || '');
        setMaxPrice(initialFilters.maxPrice || '');
        setRating(initialFilters.rating || 0);
    }, [initialFilters]);

    const handleApply = () => {
        onFilterChange({
            minPrice: minPrice,
            maxPrice: maxPrice,
            rating: rating,
        });
        if (onClose) onClose();
    };

    const handleClear = () => {
        // Notify parent to clear filters. The useEffect hook will sync the state.
        onFilterChange({
            minPrice: '',
            maxPrice: '',
            rating: 0,
        });
        
        if (onClose) onClose();
    };

    const handleRatingClick = (newRating) => {
        // If the same rating is clicked again, toggle it off.
        setRating(prev => (prev === newRating ? 0 : newRating));
    };

    return (
        <>
            <div className={`filter-sidebar-mobile-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <aside className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
                 <div className="filter-sidebar-header">
                    <h2>Filter Products</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="filter-sidebar-content">
                    <div className="filter-section">
                        <h3>Price</h3>
                        <div className="price-filter">
                            <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} aria-label="Minimum price" />
                            <span>-</span>
                            <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} aria-label="Maximum price" />
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>Rating</h3>
                        <div className="rating-filter">
                            {RATING_LEVELS.map(level => (
                                <div key={level.value} className={`rating-option ${rating === level.value ? 'selected' : ''}`} onClick={() => handleRatingClick(level.value)}>
                                     <div className="star-rating">
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={i < level.value ? 'filled' : 'empty'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                    <span>& Up</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {showSort && (
                        <div className="filter-section">
                            <h3>Sort by</h3>
                            <select className="filter-sort-select" value={sortOrder} onChange={(e) => onSortChange(e.target.value)}>
                                <option value="featured">Featured</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    )}
                    
                    <div className="filter-buttons">
                        <button className="button apply-filters-btn" onClick={handleApply}>Apply Filters</button>
                        <button className="button clear-filters-btn" onClick={handleClear}>Clear All</button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default FilterSidebar;
