import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                login(response.data.data.token, response.data.data);
                navigate('/dashboard');
            }
        }
        catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center p-4 bg-transparent relative z-10", children: _jsx("div", { className: "w-full max-w-md", children: _jsxs("div", { className: "vision-pane p-6 sm:p-10", children: [_jsxs("div", { className: "text-center mb-8 sm:mb-10", children: [_jsx("div", { className: "flex justify-center mb-4 sm:mb-5", children: _jsx("div", { className: "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30", children: _jsx("span", { className: "text-xl sm:text-2xl font-bold text-white", children: "C" }) }) }), _jsx("h1", { className: "text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2", children: "CampusCare" }), _jsx("p", { className: "text-zinc-400 font-medium text-xs sm:text-sm", children: "Sistem Pelaporan Kerusakan Fasilitas" })] }), error && (_jsx("div", { className: "bg-rose-500/10 border border-rose-500/20 text-rose-300 p-4 rounded-xl mb-6 text-sm font-medium", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-zinc-200 mb-2", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2.5 rounded-xl vision-input text-white", placeholder: "nama@example.com", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-zinc-200 mb-2", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2.5 rounded-xl vision-input text-white", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70 text-sm mt-4 border border-indigo-400/30", children: isLoading ? 'Loading...' : 'Login' })] }), _jsxs("div", { className: "mt-8 pt-6 border-t border-white/10", children: [_jsx("p", { className: "text-center text-zinc-400 text-sm mb-3", children: "Belum punya akun?" }), _jsx("a", { href: "/register", className: "block w-full py-2.5 text-center text-indigo-400 font-semibold hover:text-indigo-300 transition-colors text-sm", children: "Daftar sebagai Pelapor \u2192" })] }), _jsx("p", { className: "text-center text-zinc-500 text-xs mt-6 font-medium", children: "Demo: admin@campuscare.com / admin123" })] }) }) }));
};
export default Login;
