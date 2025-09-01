import React, { useState, useEffect, useCallback } from 'react';
import { fetchLooks, deleteLook } from '../../api';
import { useAuth } from '../../context/AuthContext';
import LookForm from './LookForm';

const LookManager = () => {
    const [looks, setLooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingLook, setEditingLook] = useState(null);
    const { token } = useAuth();

    const loadLooks = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const allLooks = await fetchLooks();
            setLooks(allLooks);
        } catch (err) {
            setError(err.message || 'Failed to fetch looks');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLooks();
    }, [loadLooks]);

    const handleEdit = (look) => {
        setEditingLook(look);
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditingLook(null);
        setShowForm(true);
    };

    const handleDelete = async (lookId) => {
        if (window.confirm('Are you sure you want to delete this look?')) {
            setError('');
            try {
                await deleteLook(lookId, token);
                loadLooks();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingLook(null);
        loadLooks();
    };

    const renderContent = () => {
        if (loading) return <div className="loader-container"><div className="loader"></div></div>;
        if (error) return <p className="error-message">{error}</p>;
        
        return (
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {looks.map(look => (
                        <tr key={look._id}>
                            <td><img src={look.mainImage} alt={look.title} className="admin-table-img" /></td>
                            <td>{look.title}</td>
                            <td>{look.description.substring(0, 100)}...</td>
                            <td>
                                <div className="admin-actions">
                                    <button onClick={() => handleEdit(look)} className="admin-btn admin-btn-edit">Edit</button>
                                    <button onClick={() => handleDelete(look._id)} className="admin-btn admin-btn-delete">Delete</button>
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
                <h2>Manage Looks</h2>
                <button onClick={handleCreate} className="admin-btn admin-btn-create">
                    + Add New Look
                </button>
            </div>
            {renderContent()}
            {showForm && <LookForm look={editingLook} onFormClose={handleFormClose} />}
        </section>
    );
};

export default LookManager;
