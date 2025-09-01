import React from 'react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './skeletons/ProductCardSkeleton';
import EmptyState from './EmptyState';

const ProductGrid = ({ loading, error, products, onViewProduct, emptyStateOptions }) => {
    if (loading) {
        return (
            <div className="product-grid">
                {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
        );
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!products || products.length === 0) {
        return (
            <EmptyState
                title={emptyStateOptions?.title || "No Products Found"}
                message={emptyStateOptions?.message || "Try adjusting your search or filters to find what you're looking for."}
                ctaText={emptyStateOptions?.ctaText}
                ctaAction={emptyStateOptions?.ctaAction}
            />
        );
    }
    
    return (
        <div className="product-grid">
            {products.map(product => (
                <ProductCard key={product._id} product={product} onViewProduct={onViewProduct} />
            ))}
        </div>
    );
};

export default ProductGrid;
