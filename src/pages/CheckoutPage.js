import React from 'react';
import { useCart } from '../context/CartContext';

const CheckoutPage = ({ navigate }) => {
    const { cartItems, cartTotal, clearCart } = useCart();

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        // In a real application, you would process the payment here.
        alert('Thank you for your order! Your items are on their way.');
        clearCart();
        navigate('/');
    };

    // If the user navigates to checkout with an empty cart, show a message.
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
                {/* Shipping & Payment Details Form */}
                <div className="checkout-form">
                    <section>
                        <h2>Shipping Address</h2>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" name="name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input type="text" id="address" name="address" required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input type="text" id="city" name="city" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="zip">ZIP Code</label>
                                <input type="text" id="zip" name="zip" required />
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

                {/* Order Summary */}
                <aside className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-items">
                        {cartItems.map(item => (
                            <div key={item._id} className="summary-item">
                                <img src={item.image} alt={item.name} className="summary-item-image" />
                                <div className="summary-item-info">
                                    <span className="summary-item-name">{item.name} (x{item.quantity})</span>
                                    <span className="summary-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button type="submit" className="place-order-button">Place Order</button>
                </aside>
            </form>
        </div>
    );
};

export default CheckoutPage;
