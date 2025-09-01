// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { registerUser, loginUser } from '../api';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [token, setToken] = useState(localStorage.getItem('token'));
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         if (token && storedUser) {
//             setUser(JSON.parse(storedUser));
//         }
//         setLoading(false);
//     }, [token]);

//     const login = async (email, password) => {
//         const { token, user } = await loginUser({ email, password });
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(user));
//         setToken(token);
//         setUser(user);
//     };

//     const register = async (fullName, username, email, password) => {
//         const { token, user } = await registerUser({ fullName, username, email, password });
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(user));
//         setToken(token);
//         setUser(user);
//     };

//     const logout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         setToken(null);
//         setUser(null);
//     };

//     return (
//         <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useContext, useEffect } from 'react';
import { registerUser, loginUser } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse auth data from localStorage", error);
            // Clear corrupted data to prevent app crashes
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }, []); // Run only once on initial mount to hydrate state from storage

    const login = async (email, password) => {
        const { token: newToken, user: newUser } = await loginUser({ email, password });
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const register = async (fullName, username, email, password) => {
        const { token: newToken, user: newUser } = await registerUser({ fullName, username, email, password });
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);