import React, { useState, useEffect } from 'react';
import { createTestimonial, updateTestimonial } from '../../api';
import { useAuth } from '../../context/AuthContext';

const INITIAL_STATE = {
    quote: '',
    author: '',
};

const TestimonialForm = ({ testimonial, onFormClose }) => {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        if (testimonial) {
            setFormData({
                quote: testimonial.quote,
                author: testimonial.author,
            });
        } else {
            setFormData(INITIAL_STATE);
        }
    }, [testimonial]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        
        try {
            if (testimonial) {
                await updateTestimonial(testimonial._id, formData, token);
            } else {
                await createTestimonial(formData, token);
            }
            onFormClose();
        } catch (err) {
            setError(err.message || 'An error occurred.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-form-modal-overlay" onClick={onFormClose}>
            <div className="admin-form-modal" onClick={e => e.stopPropagation()}>
                <header className="admin-form-header">
                    <h2>{testimonial ? 'Edit Testimonial' : 'Create New Testimonial'}</h2>
                    <button onClick={onFormClose} className="close-button">&times;</button>
                </header>
                <form onSubmit={handleSubmit} className="admin-form">
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-group">
                        <label htmlFor="author">Author Name</label>
                        <input type="text" name="author" value={formData.author} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quote">Quote</label>
                        <textarea name="quote" value={formData.quote} onChange={handleChange} required rows="5"></textarea>
                    </div>
                    <div className="admin-form-actions">
                        <button type="button" className="admin-btn-cancel" onClick={onFormClose}>Cancel</button>
                        <button type="submit" className="admin-btn-save" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save Testimonial'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TestimonialForm;
