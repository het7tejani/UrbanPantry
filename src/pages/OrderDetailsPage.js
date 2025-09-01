import React, { useState, useEffect } from 'react';
import { getOrderById } from '../api';
import { useAuth } from '../context/AuthContext';


const OrderDetailsPage = ({ orderId, navigate }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchOrder = async () => {
            if (!token) {
                setError("You must be logged in to view this page.");
                setLoading(false);
                return;
            }
            try {
                const orderData = await getOrderById(orderId, token);
                setOrder(orderData);
            } catch (err) {
                setError(err.message || "Could not fetch order details.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, token]);
    
    const STATUS_STAGES = ['Pending', 'Processing', 'Shipped', 'Delivered'];

    if (loading) {
        return <div className="loader-container" style={{height: '60vh'}}><div className="loader"></div></div>;
    }

    if (error) {
        return <div className="container"><p className="error-message">{error}</p></div>;
    }

    if (!order) {
        return <div className="container"><p>Order not found.</p></div>;
    }

    const currentStatusIndex = STATUS_STAGES.indexOf(order.status);
    
    return (
        <div className="container order-details-page">
            <h1 className="section-title">Order Details</h1>
            <div className="order-summary-header">
                <div>
                    <h2>Order #{order._id}</h2>
                    <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                    <span className="order-total-header">Total: ${order.totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <div className="order-status-tracker">
                {STATUS_STAGES.map((stage, index) => (
                    <div key={stage} className={`status-node ${index <= currentStatusIndex ? 'completed' : ''}`}>
                        <div className="status-dot"></div>
                        <div className="status-label">{stage}</div>
                    </div>
                ))}
                <div className="status-bar">
                    <div className="status-bar-progress" style={{ width: `${(currentStatusIndex / (STATUS_STAGES.length - 1)) * 100}%` }}></div>
                </div>
            </div>

            <div className="order-details-grid">
                <div className="order-items-list">
                    <h3>Items in this Order</h3>
                    {order.orderItems.map(item => (
                        <div key={item.product} className="order-item-card">
                            <img src={item.image} alt={item.name} />
                            <div className="order-item-info">
                                <span onClick={() => navigate(`/products/${item.product}`)} className="order-item-name-link">{item.name}</span>
                                <span>Qty: {item.quantity}</span>
                            </div>
                            <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="order-shipping-details">
                    <h3>Shipping Address</h3>
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;