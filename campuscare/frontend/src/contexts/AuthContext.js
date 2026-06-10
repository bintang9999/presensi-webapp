import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchProfile = async () => {
            if (token) {
                try {
                    const response = await api.get('/auth/profile');
                    setUser(response.data.data);
                }
                catch (error) {
                    console.error('Failed to fetch profile', error);
                    logout();
                }
            }
            setIsLoading(false);
        };
        fetchProfile();
    }, [token]);
    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: { user, token, login, logout, isLoading }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
