import React, { useState, useEffect } from 'react';
import { fetchTestimonials } from '../api';

const TestimonialSection = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getTestimonials = async () => {
            try {
                const data = await fetchTestimonials();
                setTestimonials(data);
            } catch (err) {
                if (err instanceof TypeError && err.message === 'Failed to fetch') {
                    setError('Unable to connect to the server. Please try again later.');
                } else {
                    setError(err.message || 'Could not load testimonials.');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getTestimonials();
    }, []);
    
    return (
        <section className="testimonial-section container">
            <h2 className="section-title">What Our Customers Say</h2>
            {loading && <div className="loader-container"><div className="loader"></div></div>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && (
                 <div className="testimonial-grid">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            <p className="testimonial-quote">"{testimonial.quote}"</p>
                            <p className="testimonial-author">- {testimonial.author}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default TestimonialSection;