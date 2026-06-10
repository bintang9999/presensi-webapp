import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, FileText, PlusCircle, Users } from 'lucide-react';

const MobileNav: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'pelapor'] },
    { name: 'Riwayat', path: '/reports', icon: <FileText size={20} />, roles: ['pelapor'] },
    { name: 'Buat', path: '/reports/new', icon: <PlusCircle size={22} />, roles: ['pelapor'], special: true },
    { name: 'Laporan', path: '/admin/reports', icon: <FileText size={20} />, roles: ['admin'] },
    { name: 'Pengguna', path: '/admin/users', icon: <Users size={20} />, roles: ['admin'] },
  ];

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50 vision-pane p-2 flex justify-around items-center">
      {navItems
        .filter(item => item.roles.includes(user?.role || ''))
        .map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? `flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all ${item.special ? 'bg-indigo-500/20 text-indigo-300' : 'text-indigo-400'}`
                : `flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all text-zinc-400 hover:text-zinc-200 hover:bg-white/5`
            }
          >
            {item.icon}
            <span className="text-[10px] mt-1 font-semibold">{item.name}</span>
          </NavLink>
        ))}
    </div>
  );
};

export default MobileNav;
