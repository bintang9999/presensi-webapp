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
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="hidden md:flex flex-col w-64 glass-dark border-r border-slate-200 dark:border-white/5 sticky top-0 h-screen"
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-white/5">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 dark:text-white leading-tight capitalize truncate max-w-[140px]">{userName ? userName.toLowerCase() : 'Memuat...'}</h1>
            <p className="text-xs text-emerald-500 dark:text-emerald-400 font-medium">{userNpm || 'NIM'}</p>
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
                    ? 'bg-gradient-to-r from-blue-500/10 to-emerald-500/10 dark:from-blue-500/20 dark:to-emerald-500/20 text-emerald-600 dark:text-white shadow-[inset_2px_0_0_rgba(16,185,129,1)]' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-white/5 opacity-50 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Presensi v2.0</p>
        </div>
      </motion.aside>

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

      {/* Bottom Navigation untuk Mobile */}
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 glass-dark border-t border-slate-200 dark:border-white/5 z-50 px-2 pt-2 sm:px-6 sm:pt-3 flex justify-between items-center"
        style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center gap-0.5 p-1 sm:gap-1 sm:p-2 rounded-xl transition-all ${
                isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
              }`
            }
          >
            <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[8px] sm:text-[10px] font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Layout;
