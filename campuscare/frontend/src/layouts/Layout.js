import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNav from '../components/MobileNav';
export const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token, isLoading } = useAuth();
    if (isLoading) {
        return _jsx("div", { className: "min-h-screen flex items-center justify-center bg-transparent", children: _jsx("p", { className: "text-zinc-400", children: "Loading..." }) });
    }
    if (!token || !user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return _jsx(Outlet, {});
};
export const MainLayout = () => {
    return (_jsxs("div", { className: "h-[100dvh] w-screen p-2 sm:p-4 lg:p-6 flex flex-col lg:flex-row gap-2 sm:gap-4 lg:gap-6 overflow-hidden bg-transparent", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col gap-2 sm:gap-4 lg:gap-6 min-h-0 w-full max-w-full", children: [_jsx(Navbar, {}), _jsx("main", { className: "flex-1 overflow-x-hidden overflow-y-auto rounded-3xl vision-pane p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8", children: _jsx(Outlet, {}) })] }), _jsx(MobileNav, {})] }));
};
