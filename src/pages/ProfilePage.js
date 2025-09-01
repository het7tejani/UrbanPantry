import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = ({ navigate }) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="container">
            <div className="profile-page">
                <h1>Welcome, {user?.fullName}!</h1>
                <p>This is your profile page. More features coming soon!</p>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;