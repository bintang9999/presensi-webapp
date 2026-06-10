import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="rounded-2xl vision-pane py-2.5 px-4 sm:py-3 sm:px-6 flex justify-between items-center h-14 sm:h-16 shadow-md flex-shrink-0">
      <div className="flex items-center lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/30 mr-2">
          <span className="text-base font-bold text-white">C</span>
        </div>
        <h1 className="text-sm font-bold text-white">CampusCare</h1>
      </div>
      <div className="hidden lg:block flex-1"></div>
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <User size={16} className="sm:w-[18px] sm:h-[18px]" />
          </div>
          <div className="hidden md:block">
            <p className="font-semibold text-zinc-100 text-xs">{user?.nama}</p>
            <p className="text-[10px] sm:text-xs text-zinc-400">{user?.role === 'admin' ? 'Admin' : 'Pelapor'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="vision-button px-2.5 py-1.5 sm:px-3 sm:py-2 text-zinc-200 hover:text-white font-medium flex items-center space-x-1.5 text-xs"
          title="Logout"
        >
          <LogOut size={14} className="sm:w-[16px] sm:h-[16px]" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
