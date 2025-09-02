import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api';

const CheckoutPage = ({ navigate }) => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { token } = useAuth();
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        address: '',
        city: '',
        zip: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError('');

        const orderData = {
            orderItems: cartItems,
            shippingAddress: shippingAddress,
            totalPrice: cartTotal,
        };

        try {
            const createdOrder = await createOrder(orderData, token);
            clearCart();
            navigate(`/order/${createdOrder._id}`);
        } catch (err) {
            setError(err.message || 'Failed to place order. Please try again.');
            setIsProcessing(false);
        }
    };

    const getItemImage = (item) => {
        if (item.images && item.images.length > 0) {
            return item.images[0];
        }
        return item.image || ''; // Fallback for old data model
    };

    if (cartItems.length === 0) {
        return (
            <div className="container">
                <div className="checkout-empty">
                    <h2>Your cart is empty</h2>
                    <p>Add some products to your cart before proceeding to checkout.</p>
                    <button className="button" onClick={() => navigate('/kitchen')}>Shop Kitchen</button>
                </div>
            </div>
        )
    }

    return (
        <div className="container checkout-page">
            <h1 className="section-title">Checkout</h1>
            <form className="checkout-grid" onSubmit={handlePlaceOrder}>
                <div className="checkout-form">
                    <section>
                        <h2>Shipping Address</h2>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input type="text" id="fullName" name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input type="text" id="address" name="address" value={shippingAddress.address} onChange={handleInputChange} required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input type="text" id="city" name="city" value={shippingAddress.city} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="zip">ZIP Code</label>
                                <input type="text" id="zip" name="zip" value={shippingAddress.zip} onChange={handleInputChange} required />
                            </div>
                        </div>
                    </section>
                    <section>
                        <h2>Payment Details</h2>
                         <div className="form-group">
                            <label htmlFor="card-number">Card Number</label>
                            <input type="text" id="card-number" name="card-number" placeholder="•••• •••• •••• ••••" required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="expiry">Expiry</label>
                                <input type="text" id="expiry" name="expiry" placeholder="MM / YY" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cvv">CVV</label>
                                <input type="text" id="cvv" name="cvv" placeholder="123" required />
                            </div>
                        </div>
                    </section>
                </div>

                <aside className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-items">
                        {cartItems.map(item => (
                            <div key={item._id} className="summary-item">
                                <img src={getItemImage(item)} alt={item.name} className="summary-item-image" />
                                <div className="summary-item-info">
                                    <span className="summary-item-name">{item.name} (x{item.quantity})</span>
                                    <span className="summary-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    {error && <p className="error-message" style={{textAlign: 'center', marginTop: '1rem'}}>{error}</p>}
                    <button type="submit" className="place-order-button" disabled={isProcessing}>
                        {isProcessing ? 'Placing Order...' : 'Place Order'}
                    </button>
                </aside>
            </form>
        </div>
    );
};

export default CheckoutPage;