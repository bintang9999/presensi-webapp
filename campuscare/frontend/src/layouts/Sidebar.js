import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, FileText, PlusCircle, Users } from 'lucide-react';
const Sidebar = () => {
    const { user } = useAuth();
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: _jsx(LayoutDashboard, { size: 20 }), roles: ['admin', 'pelapor'] },
        { name: 'Laporan Saya', path: '/reports', icon: _jsx(FileText, { size: 20 }), roles: ['pelapor'] },
        { name: 'Buat Laporan', path: '/reports/new', icon: _jsx(PlusCircle, { size: 20 }), roles: ['pelapor'] },
        { name: 'Semua Laporan', path: '/admin/reports', icon: _jsx(FileText, { size: 20 }), roles: ['admin'] },
        { name: 'Pengguna', path: '/admin/users', icon: _jsx(Users, { size: 20 }), roles: ['admin'] },
    ];
    return (_jsxs("div", { className: "hidden lg:flex w-56 rounded-3xl vision-pane p-5 h-fit sticky top-6 flex-col shadow-lg shadow-primary-500/5", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/30", children: _jsx("span", { className: "text-lg font-bold text-white", children: "C" }) }), _jsx("div", { children: _jsx("h1", { className: "text-sm font-bold text-white", children: "CampusCare" }) })] }), _jsx("p", { className: "text-xs text-zinc-400 font-medium ml-12 -mt-5", children: user?.role === 'admin' ? 'Admin' : 'Pelapor' })] }), _jsx("nav", { className: "space-y-1 text-sm", children: navItems
                    .filter(item => item.roles.includes(user?.role || ''))
                    .map(item => (_jsxs(NavLink, { to: item.path, className: ({ isActive }) => isActive
                        ? 'flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 transition-all duration-300 shadow-sm'
                        : 'flex items-center space-x-3 px-4 py-2.5 rounded-xl text-zinc-300 hover:bg-white/10 transition-all duration-300 font-medium', children: [_jsx("span", { className: "w-4 h-4 flex-shrink-0", children: item.icon }), _jsx("span", { className: "truncate text-xs", children: item.name })] }, item.path))) }), _jsx("div", { className: "mt-auto pt-4 border-t border-white/10", children: _jsx("p", { className: "text-xs text-zinc-500 font-medium", children: "\u00A9 2026" }) })] }));
};
export default Sidebar;
