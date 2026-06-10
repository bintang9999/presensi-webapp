import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout, ProtectedRoute } from './layouts/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewReport from './pages/NewReport';
import MyReports from './pages/MyReports';
import ReportDetail from './pages/ReportDetail';
import EditReport from './pages/EditReport';
import AdminReports from './pages/AdminReports';
import AdminUsers from './pages/AdminUsers';
import './index.css';
function AppRoutes() {
    const { isLoading } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }), _jsx("p", { className: "mt-4 text-slate-600 dark:text-slate-300", children: "Loading..." })] }) }));
    }
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { element: _jsx(ProtectedRoute, {}), children: _jsxs(Route, { element: _jsx(MainLayout, {}), children: [_jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, { allowedRoles: ['pelapor'] }), children: [_jsx(Route, { path: "/reports/new", element: _jsx(NewReport, {}) }), _jsx(Route, { path: "/reports", element: _jsx(MyReports, {}) }), _jsx(Route, { path: "/reports/:id", element: _jsx(ReportDetail, {}) }), _jsx(Route, { path: "/reports/:id/edit", element: _jsx(EditReport, {}) })] }), _jsxs(Route, { element: _jsx(ProtectedRoute, { allowedRoles: ['admin'] }), children: [_jsx(Route, { path: "/admin/reports", element: _jsx(AdminReports, {}) }), _jsx(Route, { path: "/admin/users", element: _jsx(AdminUsers, {}) })] })] }) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }));
}
function App() {
    return (_jsx(Router, { children: _jsx(AuthProvider, { children: _jsx(AppRoutes, {}) }) }));
}
export default App;
