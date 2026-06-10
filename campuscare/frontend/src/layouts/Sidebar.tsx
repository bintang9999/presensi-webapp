import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Users
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'pelapor'] },
    { name: 'Laporan Saya', path: '/reports', icon: <FileText size={20} />, roles: ['pelapor'] },
    { name: 'Buat Laporan', path: '/reports/new', icon: <PlusCircle size={20} />, roles: ['pelapor'] },
    { name: 'Semua Laporan', path: '/admin/reports', icon: <FileText size={20} />, roles: ['admin'] },
    { name: 'Pengguna', path: '/admin/users', icon: <Users size={20} />, roles: ['admin'] },
  ];

  return (
    <div className="hidden lg:flex w-56 rounded-3xl vision-pane p-5 h-fit sticky top-6 flex-col shadow-lg shadow-primary-500/5">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/30">
            <span className="text-lg font-bold text-white">C</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">CampusCare</h1>
          </div>
        </div>
        <p className="text-xs text-zinc-400 font-medium ml-12 -mt-5">
          {user?.role === 'admin' ? 'Admin' : 'Pelapor'}
        </p>
      </div>
      
      <nav className="space-y-1 text-sm">
        {navItems
          .filter(item => item.roles.includes(user?.role || ''))
          .map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 transition-all duration-300 shadow-sm'
                  : 'flex items-center space-x-3 px-4 py-2.5 rounded-xl text-zinc-300 hover:bg-white/10 transition-all duration-300 font-medium'
              }
            >
              <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
              <span className="truncate text-xs">{item.name}</span>
            </NavLink>
          ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10">
        <p className="text-xs text-zinc-500 font-medium">© 2026</p>
      </div>
    </div>
  );
};

export default Sidebar;
