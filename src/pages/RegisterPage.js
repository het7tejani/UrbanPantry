import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = ({ navigate }) => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailFromQuery = params.get('email');
        if (emailFromQuery) {
            setEmail(emailFromQuery);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        try {
            await register(fullName, username, email, password);
            navigate('/');
        } catch (err) {
            if (err instanceof TypeError && err.message === 'Failed to fetch') {
                setError('Unable to connect to the server. Please try again later.');
            } else {
                setError(err.message || 'Failed to register.');
            }
        }
    };

    return (
        <div className="container">
            <div className="auth-page">
                <h1>Create Account</h1>
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Sign Up</button>
                    <p className="form-link" onClick={() => navigate('/login')}>
                        Already have an account? Login
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;