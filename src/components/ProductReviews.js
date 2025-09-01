import React, { useState, useEffect } from 'react';
import { fetchReviewsForProduct, createReview } from '../api';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

const StarInput = ({ rating, setRating, disabled }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="star-input">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={star <= (hoverRating || rating) ? 'filled' : ''}
                    onClick={() => !disabled && setRating(star)}
                    onMouseEnter={() => !disabled && setHoverRating(star)}
                    onMouseLeave={() => !disabled && setHoverRating(0)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>
                </span>
            ))}
        </div>
    );
};

const ProductReviews = ({ productId, onReviewSubmitted }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user, token } = useAuth();
    
    const hasUserReviewed = reviews.some(review => review.user?._id === user?.id);

    const fetchReviews = async () => {
        setLoading(true);
        setError('');
        try {
            const reviewsData = await fetchReviewsForProduct(productId);
            setReviews(reviewsData);
        } catch (err) {
            setError('Could not load reviews.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchReviews();
    }, [productId]);
    
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setSubmitError('Please select a rating.');
            return;
        }
        if (!comment.trim()) {
            setSubmitError('Please enter a comment.');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');
        try {
            await createReview(productId, { rating, comment }, token);
            setRating(0);
            setComment('');
            fetchReviews(); // Re-fetch reviews to show the new one
            if(onReviewSubmitted) onReviewSubmitted(); // Notify parent to refetch product data
        } catch (err) {
            setSubmitError(err.message || 'Failed to submit review.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="product-reviews-section">
            <h2>Customer Reviews</h2>
            {loading && <div className="loader-container"><div className="loader"></div></div>}
            {error && <p className="error-message">{error}</p>}
            
            {!loading && reviews.length === 0 && <p style={{textAlign: 'center'}}>No reviews yet. Be the first to review this product!</p>}

            {!loading && reviews.length > 0 && (
                <div className="reviews-list">
                    {reviews.map(review => (
                        <div key={review._id} className="review-item">
                            <div className="review-header">
                                <strong>{review.user?.fullName || 'Anonymous'}</strong>
                                <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <StarRating rating={review.rating} />
                            <p className="review-comment">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
            
            {user ? (
                <div className="review-form-container">
                    <h3>Write a Review</h3>
                    {hasUserReviewed ? (
                        <p>You've already reviewed this product.</p>
                    ) : (
                        <form onSubmit={handleReviewSubmit} className="review-form">
                            {submitError && <p className="error-message">{submitError}</p>}
                            <div className="form-group">
                                <label>Your Rating</label>
                                <StarInput rating={rating} setRating={setRating} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="comment">Your Review</label>
                                <textarea 
                                    id="comment" 
                                    rows="4"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="What did you think of the product?"
                                ></textarea>
                            </div>
                            <button type="submit" className="button" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}
                </div>
            ) : (
                <div className="review-login-prompt">
                    <h3>Write a Review</h3>
                    <p>
                        Please <a href={`/login?redirectTo=/products/${productId}`}>log in</a> or <a href={`/register?redirectTo=/products/${productId}`}>register</a> to submit a review.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductReviews;