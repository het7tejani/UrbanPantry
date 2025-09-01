import React, { useState, useEffect, useContext } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';
import ShoppingCart from './components/ShoppingCart';
import Chatbot from './components/Chatbot';
import { AuthContext } from './context/AuthContext';

// Page Components
import HomePage from './pages/HomePage';
import KitchenPage from './pages/KitchenPage';
import DecorPage from './pages/DecorPage';
import BeddingPage from './pages/BeddingPage';
import LightingPage from './pages/LightingPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import WishlistPage from './pages/WishlistPage';
import ShopTheLookPage from './pages/ShopTheLookPage';
import LookDetailsPage from './pages/LookDetailsPage';
import AdminPage from './pages/AdminPage';

const App = () => {
    const [location, setLocation] = useState(window.location.pathname + window.location.search);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const handlePopState = () => {
            setLocation(window.location.pathname + window.location.search);
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const navigate = (path) => {
        window.history.pushState({}, '', path);
        setLocation(path);
        window.scrollTo(0, 0);
    };

    const handleViewProduct = (productId) => {
        navigate(`/products/${productId}`);
    };
    
    const handleViewLook = (lookId) => {
        navigate(`/looks/${lookId}`);
    };

    const renderPage = () => {
        const url = new URL(window.location.origin + location);
        const path = url.pathname;
        
        if (path.startsWith('/products/')) {
            const productId = path.split('/')[2];
            return <ProductDetailsPage productId={productId} navigate={navigate} />;
        }
        
        if (path.startsWith('/looks/')) {
            const lookId = path.split('/')[2];
            return <LookDetailsPage lookId={lookId} onViewProduct={handleViewProduct} />;
        }

        switch (path) {
            case '/kitchen':
                return <KitchenPage onViewProduct={handleViewProduct} />;
            case '/decor':
                return <DecorPage onViewProduct={handleViewProduct} />;
            case '/bedding':
                return <BeddingPage onViewProduct={handleViewProduct} />;
            case '/lighting':
                return <LightingPage onViewProduct={handleViewProduct} />;
            case '/shop-the-look':
                return <ShopTheLookPage onViewLook={handleViewLook} />;
            case '/checkout':
                return user ? <CheckoutPage navigate={navigate} /> : <LoginPage navigate={navigate} redirectTo="/checkout" />;
            case '/login':
                 const redirectTo = url.searchParams.get('redirectTo');
                 return <LoginPage navigate={navigate} redirectTo={redirectTo} />;
            case '/register':
                return <RegisterPage navigate={navigate} />;
            case '/profile':
                return user ? <ProfilePage navigate={navigate} /> : <LoginPage navigate={navigate} redirectTo="/profile" />;
            case '/search':
                return <SearchPage onViewProduct={handleViewProduct} />;
            case '/wishlist':
                return <WishlistPage onViewProduct={handleViewProduct} navigate={navigate} />;
            case '/admin':
                return user && user.role === 'admin' ? <AdminPage navigate={navigate} /> : <HomePage onViewProduct={handleViewProduct} navigate={navigate} />;
            case '/':
            default:
                return <HomePage onViewProduct={handleViewProduct} navigate={navigate} />;
        }
    };

    const getPageNameFromPath = (path) => {
        const page = path.split('?')[0];
        if (page.startsWith('/products/')) return 'Product';
        if (page.startsWith('/looks/')) return 'Shop the Look';
        if (page.startsWith('/admin')) return 'Admin';
        if (page === '/') return 'Home';

        const pageName = page.startsWith('/') ? page.substring(1) : page;
        const validPages = ['kitchen', 'decor', 'bedding', 'lighting', 'shop-the-look', 'checkout', 'login', 'register', 'profile', 'search', 'wishlist'];
        
        if (validPages.includes(pageName)) {
            return pageName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        
        return 'Home'; // Default for unknown paths
    };

    const currentPage = getPageNameFromPath(location);

    return (
        <div className={`app ${location.startsWith('/looks/') ? 'look-details-page' : ''}`}>
            <AnnouncementBar />
            <Header currentPage={currentPage} navigate={navigate} />
            <main>
                {renderPage()}
            </main>
            <Footer navigate={navigate} />
            <ShoppingCart navigate={navigate} />
            <Chatbot navigate={navigate} />
        </div>
    );
};

export default App;