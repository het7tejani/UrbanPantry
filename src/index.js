import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { QuickViewProvider } from './context/QuickViewContext';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/utilities.css';
import './styles/chatbot.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <ToastProvider>
                <CartProvider>
                    <WishlistProvider>
                        <QuickViewProvider>
                            <App />
                        </QuickViewProvider>
                    </WishlistProvider>
                </CartProvider>
            </ToastProvider>
        </AuthProvider>
    </React.StrictMode>
);