import React, { useState } from 'react';
import ProductManager from '../components/admin/ProductManager';
import LookManager from '../components/admin/LookManager';
import TestimonialManager from '../components/admin/TestimonialManager';
import './AdminPage.css';

const AdminPage = ({ navigate }) => {
    const [activeTab, setActiveTab] = useState('products');

    const renderContent = () => {
        switch(activeTab) {
            case 'products':
                return <ProductManager navigate={navigate} />;
            case 'looks':
                return <LookManager navigate={navigate} />;
            case 'testimonials':
                return <TestimonialManager navigate={navigate} />;
            default:
                return <ProductManager navigate={navigate} />;
        }
    };

    return (
        <div className="container admin-page">
            <header className="admin-header">
                <h1 className="section-title">Admin Dashboard</h1>
            </header>
            <nav className="admin-nav">
                <button 
                    className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Manage Products
                </button>
                <button 
                    className={`admin-nav-item ${activeTab === 'looks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('looks')}
                >
                    Manage Looks
                </button>
                <button 
                    className={`admin-nav-item ${activeTab === 'testimonials' ? 'active' : ''}`}
                    onClick={() => setActiveTab('testimonials')}
                >
                    Manage Testimonials
                </button>
            </nav>
            <div className="admin-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPage;