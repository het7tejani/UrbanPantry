import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage = ({ navigate, redirectTo }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate(redirectTo || '/');
        } catch (err) {
            if (err instanceof TypeError && err.message === 'Failed to fetch') {
                setError('Unable to connect to the server. Please try again later.');
            } else {
                setError(err.message || 'Failed to log in.');
            }
        }
    };

    return (
        <div className="container">
            <div className="auth-page">
                <h1>Login</h1>
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <p className="error-message">{error}</p>}
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
                    <button type="submit" className="auth-button">Login</button>
                    <p className="form-link" onClick={() => navigate('/register')}>
                        Don't have an account? Sign Up
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;