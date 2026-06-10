import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, CalendarDays, Wallet, GraduationCap, ActivitySquare, PieChart, Bell, CheckCircle2, User } from 'lucide-react';
import api from '../api';
import { useNotifications } from '../contexts/NotificationContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [userName, setUserName] = useState<string>('');
  const [userNpm, setUserNpm] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/status');
        setUserNpm(res.data.npm);
        if (res.data.nama) {
          setUserName(res.data.nama);
        }
      } catch (err) {
        console.error('Failed to fetch profile in layout', err);
      }
    };
    fetchProfile();
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Jadwal Ujian', path: '/ujian', icon: CalendarDays },
    { name: 'Log Aktivitas', path: '/logs', icon: ActivitySquare },
    { name: 'Statistik', path: '/statistik', icon: PieChart },
    { name: 'Tagihan', path: '/tagihan', icon: Wallet },
    { name: 'Profil', path: '/profil', icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-transparent">
      {/* Sidebar untuk Desktop */}
      <div className="hidden md:flex flex-col w-[280px] h-screen sticky top-0 p-6 pl-8">
        <motion.aside 
          initial={{ x: -250, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col w-full h-full glass-dark rounded-[2rem] shadow-2xl overflow-hidden border border-white/5"
        >
          <div className="p-8 pb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/90 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0 border border-indigo-400/20">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-slate-800 dark:text-white leading-tight tracking-wide">CampusCare</h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{userName ? userName.split(' ')[0] : 'Admin'} • {userNpm || 'NIM'}</p>
            </div>
          </div>

          <nav className="flex-1 px-5 py-4 space-y-1.5 overflow-y-auto hide-scrollbar">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-medium text-sm border ${
                    isActive 
                      ? 'bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20 dark:border-cyan-400/20 shadow-[inset_0_1px_1px_rgba(34,211,238,0.15)]' 
                      : 'text-slate-500 dark:text-slate-400 border-transparent'
                  }`
                }
              >
                <item.icon className="w-5 h-5 opacity-80" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-8 pt-4 opacity-40">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
              © 2026
            </p>
          </div>
        </motion.aside>
      </div>

      {/* Konten Utama */}
      <main className={`flex-1 min-w-0 overflow-y-auto relative pb-32 md:pb-0 ${unreadCount > 0 ? 'pt-20' : 'pt-4'} md:pt-0`}>
        {/* Floating Notification Bell */}
        <div className="fixed top-4 right-4 md:top-8 md:right-8 z-50 flex gap-2">
          {(unreadCount > 0 || showNotifications) && (
            <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-lg ${unreadCount > 0 ? 'opacity-100 text-slate-800 dark:text-white' : 'opacity-40 hover:opacity-100 text-slate-500 dark:text-slate-300'}`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-14 right-0 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-50 origin-top-right"
                >
                  <div className="p-4 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      Notifikasi
                      {unreadCount > 0 && (
                        <span className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full">
                          {unreadCount} Baru
                        </span>
                      )}
                    </h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        Tandai sudah dibaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Belum ada notifikasi.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            onClick={() => {
                              if (!notif.read) markAsRead(notif.id);
                            }}
                            className={`p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-blue-50 dark:bg-blue-500/5' : ''}`}
                          >
                            <div className="flex-shrink-0 mt-1">
                              {notif.type === 'open' ? (
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                  <CalendarDays className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm ${!notif.read ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-300 font-medium'}`}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                                {notif.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            {!notif.read && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-slate-200 dark:border-white/5 text-center bg-slate-50 dark:bg-slate-900/50">
                    <NavLink 
                      to="/profil?view=notifikasi"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      Lihat Riwayat Notifikasi
                    </NavLink>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          )}
        </div>

        {/* Backdrop for mobile to close notification */}
        {showNotifications && (
          <div 
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setShowNotifications(false)}
          />
        )}

        {children}
      </main>

      {/* Bottom Navigation untuk Mobile (Floating Pill) */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 flex justify-center pointer-events-none">
        <div className="glass-dark rounded-[2rem] p-2 flex justify-around items-center w-full max-w-[340px] shadow-2xl border border-white/10 pointer-events-auto backdrop-blur-2xl">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex flex-col items-center justify-center p-3 rounded-[1.25rem] transition-all min-w-[3rem] ${
                  isActive ? 'text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 dark:bg-cyan-400/10 shadow-[inset_0_1px_1px_rgba(34,211,238,0.15)] border border-cyan-500/20 dark:border-cyan-400/20' : 'text-slate-400 dark:text-slate-500 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <item.icon className={`w-5 h-5 ${isActive ? 'opacity-100 scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'opacity-70'} transition-transform duration-300`} />
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;
