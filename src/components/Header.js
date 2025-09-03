import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = ({ currentPage, navigate, isMobileNavOpen, setIsMobileNavOpen }) => {
    const { cartCount, setIsCartOpen } = useCart();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleNavClick = (path) => (e) => {
        e.preventDefault();
        navigate(path);
    };

    const handleMobileNavClick = (path) => (e) => {
        e.preventDefault();
        setIsMobileNavOpen(false);
        navigate(path);
    };

    const handleUserIconClick = () => {
        setIsMobileNavOpen(false);
        if (user) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsMobileNavOpen(false);
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const renderNavLinks = (clickHandler) => (
        <>
            <a href="/kitchen" className={`nav-link ${currentPage === 'Kitchen' ? 'active' : ''}`} onClick={clickHandler('/kitchen')}>Kitchen</a>
            <a href="/decor" className={`nav-link ${currentPage === 'Decor' ? 'active' : ''}`} onClick={clickHandler('/decor')}>Decor</a>
            <a href="/bedding" className={`nav-link ${currentPage === 'Bedding' ? 'active' : ''}`} onClick={clickHandler('/bedding')}>Bedding</a>
            <a href="/lighting" className={`nav-link ${currentPage === 'Lighting' ? 'active' : ''}`} onClick={clickHandler('/lighting')}>Lighting</a>
            <a href="/shop-the-look" className={`nav-link ${currentPage === 'Shop The Look' ? 'active' : ''}`} onClick={clickHandler('/shop-the-look')}>Shop the Look</a>
            {user && user.role === 'admin' && (
                 <a href="/admin" className={`nav-link ${currentPage === 'Admin' ? 'active' : ''}`} onClick={clickHandler('/admin')}>Admin</a>
            )}
        </>
    );

    return (
        <header className="header">
            <div className="logo" onClick={handleNavClick('/')}>UrbanPantry</div>
            
            <nav className="desktop-nav">
                {renderNavLinks(handleNavClick)}
            </nav>
            
            <div className="header-icons">
                <form className="search-form" onSubmit={handleSearchSubmit}>
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-submit-button" aria-label="Search"></button>
                </form>
                <button className="icon wishlist-icon" onClick={handleNavClick('/wishlist')} aria-label="Wishlist">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                </button>
                <button className="icon user-icon" onClick={handleUserIconClick} aria-label="User account">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                </button>
                <button className="icon cart-icon" onClick={() => setIsCartOpen(true)} aria-label={`Shopping cart with ${cartCount} items`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" /></svg>
                    {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
                </button>
            </div>
            
            <button className="mobile-nav-toggle" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} aria-label="Toggle navigation" aria-expanded={isMobileNavOpen}>
                {isMobileNavOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                )}
            </button>

            <div className={`mobile-nav-menu ${isMobileNavOpen ? 'open' : ''}`}>
                <nav>
                    {renderNavLinks(handleMobileNavClick)}
                </nav>
            </div>

        </header>
    );
};

export default Header;
