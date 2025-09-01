import React from 'react';

const Footer = ({ navigate }) => {
    const handleNavClick = (path) => (e) => {
        e.preventDefault();
        if(navigate) {
            navigate(path);
        } else {
            window.location.href = path;
        }
    };

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-column">
                    <h3 className="footer-title">UrbanPantry</h3>
                    <p>Curated essentials for the modern home.</p>
                </div>
                <div className="footer-column">
                    <h3 className="footer-title">Shop</h3>
                    <a href="/kitchen" className="footer-link" onClick={handleNavClick('/kitchen')}>Kitchen</a>
                    <a href="/decor" className="footer-link" onClick={handleNavClick('/decor')}>Decor</a>
                    <a href="/bedding" className="footer-link" onClick={handleNavClick('/bedding')}>Bedding</a>
                    <a href="/lighting" className="footer-link" onClick={handleNavClick('/lighting')}>Lighting</a>
                </div>
                <div className="footer-column">
                    <h3 className="footer-title">About</h3>
                    <a href="#" className="footer-link">Our Story</a>
                    <a href="#" className="footer-link">Contact</a>
                    <a href="#" className="footer-link">FAQs</a>
                </div>
                <div className="footer-column">
                    <h3 className="footer-title">Follow Us</h3>
                    <a href="#" className="footer-link">Instagram</a>
                    <a href="#" className="footer-link">Pinterest</a>
                    <a href="#" className="footer-link">Facebook</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} UrbanPantry. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
