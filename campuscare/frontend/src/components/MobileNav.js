import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, FileText, PlusCircle, Users } from 'lucide-react';
const MobileNav = () => {
    const { user } = useAuth();
    const navItems = [
        { name: 'Home', path: '/dashboard', icon: _jsx(LayoutDashboard, { size: 20 }), roles: ['admin', 'pelapor'] },
        { name: 'Riwayat', path: '/reports', icon: _jsx(FileText, { size: 20 }), roles: ['pelapor'] },
        { name: 'Buat', path: '/reports/new', icon: _jsx(PlusCircle, { size: 22 }), roles: ['pelapor'], special: true },
        { name: 'Laporan', path: '/admin/reports', icon: _jsx(FileText, { size: 20 }), roles: ['admin'] },
        { name: 'Pengguna', path: '/admin/users', icon: _jsx(Users, { size: 20 }), roles: ['admin'] },
    ];
    return (_jsx("div", { className: "lg:hidden fixed bottom-4 left-4 right-4 z-50 vision-pane p-2 flex justify-around items-center", children: navItems
            .filter(item => item.roles.includes(user?.role || ''))
            .map(item => (_jsxs(NavLink, { to: item.path, className: ({ isActive }) => isActive
                ? `flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all ${item.special ? 'bg-indigo-500/20 text-indigo-300' : 'text-indigo-400'}`
                : `flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all text-zinc-400 hover:text-zinc-200 hover:bg-white/5`, children: [item.icon, _jsx("span", { className: "text-[10px] mt-1 font-semibold", children: item.name })] }, item.path))) }));
};
export default MobileNav;
