import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, CalendarDays, Wallet, LogOut, GraduationCap } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Jadwal Ujian', path: '/ujian', icon: CalendarDays },
    { name: 'Tagihan', path: '/tagihan', icon: Wallet },
  ];

  return (
    <div className="min-h-screen flex bg-transparent">
      {/* Sidebar untuk Desktop */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="hidden md:flex flex-col w-64 glass-dark border-r border-white/5 sticky top-0 h-screen"
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-white leading-tight">Presensi</h1>
            <p className="text-xs text-emerald-400 font-medium">Alma Ata Portal</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-white shadow-[inset_2px_0_0_rgba(16,185,129,1)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </motion.aside>

      {/* Konten Utama */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation untuk Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-dark border-t border-white/5 z-50 px-6 py-3 flex justify-between items-center">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isActive ? 'text-emerald-400' : 'text-slate-400'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </NavLink>
        ))}
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 p-2 rounded-xl text-slate-400 hover:text-red-400 transition-all">
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default Layout;
