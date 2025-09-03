import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../api';


const ProfilePage = ({ navigate }) => {
    const { user, logout, token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (token) {
                try {
                    const data = await getMyOrders(token);
                    setOrders(data);
                } catch (err) {
                    setError(err.message || "Failed to fetch orders.");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchOrders();
    }, [token]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="container profile-page">
            <div className="profile-header">
                <h1>Welcome, {user?.fullName}!</h1>
                <p>View your account details and order history below.</p>
                 <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>

            <section className="order-history-section">
                <h2>My Orders</h2>
                {loading ? (
                    <div className="loader-container"><div className="loader"></div></div>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : orders.length === 0 ? (
                    <p>You haven't placed any orders yet.</p>
                ) : (
                    <table className="order-history-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td data-label="Order ID">#{order._id.substring(0, 8)}...</td>
                                    <td data-label="Date">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td data-label="Total">₹{order.totalPrice.toFixed(2)}</td>
                                    <td data-label="Status">
                                        <span className={`order-status-badge status-${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="view-order-btn" onClick={() => navigate(`/order/${order._id}`)}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};

export default ProfilePage;
