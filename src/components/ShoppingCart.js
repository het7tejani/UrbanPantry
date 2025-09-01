import React from 'react';
import { useCart } from '../context/CartContext';

const ShoppingCart = ({ navigate }) => {
    const { isCartOpen, setIsCartOpen, cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <>
            <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
            <aside className={`cart-panel ${isCartOpen ? 'open' : ''}`}>
                <header className="cart-header">
                    <h2 className="cart-title">Your Cart</h2>
                    <button className="close-button" onClick={() => setIsCartOpen(false)} aria-label="Close cart">&times;</button>
                </header>
                <div className="cart-body">
                    {cartItems.length === 0 ? (
                        <p className="cart-empty">Your cart is empty.</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item._id} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-info">
                                    <div>
                                        <p className="cart-item-name">{item.name}</p>
                                        <p className="cart-item-price">${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="quantity-control">
                                            <button className="quantity-button" onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                                            <span className="quantity-display">{item.quantity}</span>
                                            <button className="quantity-button" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className="remove-button" onClick={() => removeFromCart(item._id)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {cartItems.length > 0 && (
                    <footer className="cart-footer">
                        <div className="subtotal">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <button className="checkout-button" onClick={handleCheckout}>Proceed to Checkout</button>
                    </footer>
                )}
            </aside>
        </>
    );
};

export default ShoppingCart;
