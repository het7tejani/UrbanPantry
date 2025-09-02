import React, { useState, useEffect, useCallback } from 'react';
import { fetchTestimonials, deleteTestimonial } from '../../api';
import { useAuth } from '../../context/AuthContext';
import TestimonialForm from './TestimonialForm';

const TestimonialManager = ({ navigate }) => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const { token, logout } = useAuth();

    const handleAuthError = useCallback((err) => {
        if (err.message && (err.message.includes('Token is not valid') || err.message.includes('authorization denied'))) {
            logout();
            navigate('/login?redirectTo=/admin');
            return true;
        }
        return false;
    }, [logout, navigate]);

    const loadTestimonials = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            if (!token) {
                logout();
                navigate('/login?redirectTo=/admin');
                return;
            }
            const allTestimonials = await fetchTestimonials();
            setTestimonials(allTestimonials);
        } catch (err) {
            if (!handleAuthError(err)) {
                setError(err.message || 'Failed to fetch testimonials');
            }
        } finally {
            setLoading(false);
        }
    }, [token, handleAuthError, logout, navigate]);

    useEffect(() => {
        loadTestimonials();
    }, [loadTestimonials]);

    const handleEdit = (testimonial) => {
        setEditingTestimonial(testimonial);
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditingTestimonial(null);
        setShowForm(true);
    };

    const handleDelete = async (testimonialId) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            setError('');
            try {
                await deleteTestimonial(testimonialId, token);
                loadTestimonials();
            } catch (err) {
                 if (!handleAuthError(err)) {
                    setError(err.message);
                }
            }
        }
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingTestimonial(null);
        loadTestimonials();
    };

    const renderContent = () => {
        if (loading) return <div className="loader-container"><div className="loader"></div></div>;
        if (error) return <p className="error-message">{error}</p>;
        
        return (
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Author</th>
                        <th>Quote</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {testimonials.map(testimonial => (
                        <tr key={testimonial._id}>
                            <td>{testimonial.author}</td>
                            <td>"{testimonial.quote.substring(0, 120)}..."</td>
                            <td>
                                <div className="admin-actions">
                                    <button onClick={() => handleEdit(testimonial)} className="admin-btn admin-btn-edit">Edit</button>
                                    <button onClick={() => handleDelete(testimonial._id)} className="admin-btn admin-btn-delete">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <section className="admin-section">
            <div className="admin-section-header">
                <h2>Manage Testimonials</h2>
                <button onClick={handleCreate} className="admin-btn admin-btn-create">
                    + Add New Testimonial
                </button>
            </div>
            {renderContent()}
            {showForm && <TestimonialForm testimonial={editingTestimonial} onFormClose={handleFormClose} logout={logout} navigate={navigate} />}
        </section>
    );
};

export default TestimonialManager;