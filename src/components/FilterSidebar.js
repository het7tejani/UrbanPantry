import React, { useState } from 'react';
import StarRating from './StarRating';

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

    const handleApply = () => {
        onFilterChange({
            minPrice: minPrice,
            maxPrice: maxPrice,
            rating: rating,
        });
        if (onClose) onClose();
    };

    const handleClear = () => {
        setMinPrice('');
        setMaxPrice('');
        setRating(0);
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

    const SidebarContent = () => (
        <>
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
                            <StarRating rating={level.value} />
                            <span>& Up</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="filter-buttons">
                <button className="button apply-filters-btn" onClick={handleApply}>Apply Filters</button>
                <button className="button clear-filters-btn" onClick={handleClear}>Clear All</button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Overlay and Panel */}
            <div className={`filter-sidebar-mobile-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <aside className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
                 <div className="filter-sidebar-header">
                    <h2>Filter Products</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="filter-sidebar-content">
                    <SidebarContent />
                </div>
            </aside>
            
            {/* Desktop Sidebar (inline) */}
            <aside className="filter-sidebar-desktop">
                <SidebarContent />
            </aside>
        </>
    );
};

export default FilterSidebar;