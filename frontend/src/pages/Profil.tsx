import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Sun, Moon, Bell, LogOut, ChevronRight, GraduationCap, ArrowLeft, CheckCircle2, CalendarDays } from 'lucide-react';
import api from '../api';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';

const Profil = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const { notifications, markAsRead } = useNotifications();
  const [userName, setUserName] = useState<string>('');
  const [userNpm, setUserNpm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  const view = searchParams.get('view') || 'main';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/status');
        setUserNpm(res.data.npm);
        if (res.data.nama) {
          setUserName(res.data.nama);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (view === 'notifikasi') {
    return (
      <div className="p-4 md:p-8 pb-24 md:pb-8 min-h-screen">
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-dark rounded-3xl p-6 md:px-8 mb-8 border border-slate-200 dark:border-white/5 flex items-center gap-4 sticky top-4 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg"
        >
          <button 
            onClick={() => setSearchParams({})}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Riwayat Notifikasi</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Semua notifikasi yang pernah diterima</p>
          </div>
        </motion.header>

        <div className="max-w-3xl mx-auto">
          {notifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-dark rounded-3xl p-16 text-center border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Bell className="w-10 h-10 text-slate-400 dark:text-slate-500 opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Belum ada notifikasi</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">Semua notifikasi yang masuk akan muncul di sini.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notif, index) => (
                <motion.div 
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    if (!notif.read) markAsRead(notif.id);
                  }}
                  className={`glass-dark rounded-3xl p-5 border cursor-pointer transition-all hover:scale-[1.01] ${
                    notif.read 
                      ? 'border-slate-200 dark:border-white/5 opacity-80 hover:opacity-100' 
                      : 'border-blue-300 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-900/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {notif.type === 'open' ? (
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <CalendarDays className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-base md:text-lg ${!notif.read ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-700 dark:text-slate-200 font-semibold'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] md:text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md shrink-0">
                          {notif.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • {notif.time.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className={`mt-1 text-sm ${!notif.read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                        {notif.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 min-h-screen">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-dark rounded-3xl p-6 md:px-8 mb-8 border border-slate-200 dark:border-white/5"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <User className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Profil Saya</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pengaturan akun dan preferensi</p>
          </div>
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Account Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-dark rounded-3xl p-6 border border-slate-200 dark:border-white/5"
        >
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-2">Informasi Akun</h2>
          
          <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800/50">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 to-blue-500 p-1 shadow-xl">
              <div className="w-full h-full rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">
                {loading ? 'Memuat...' : (userName ? userName.toLowerCase() : 'Pengguna')}
              </h3>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium font-mono mt-1">
                {loading ? '...' : (userNpm || 'NPM Belum Tersedia')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-3xl p-2 border border-slate-200 dark:border-white/5 overflow-hidden"
        >
          <div className="p-4 px-6 pb-2">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Preferensi</h2>
          </div>
          
          <div className="space-y-1">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 px-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 dark:text-white">Tema Tampilan</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{theme === 'dark' ? 'Mode Gelap aktif' : 'Mode Terang aktif'}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </button>

            {/* Notification Toggle */}
            <button 
              onClick={() => setNotificationEnabled(!notificationEnabled)}
              className="w-full flex items-center justify-between p-4 px-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 dark:text-white">Notifikasi Perangkat</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{notificationEnabled ? 'Aktif (Berbunyi & Tampil)' : 'Nonaktif (Hanya di dalam aplikasi)'}</p>
                </div>
              </div>
              
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${notificationEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ease-in-out ${notificationEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>

            {/* Riwayat Notifikasi */}
            <button 
              onClick={() => setSearchParams({ view: 'notifikasi' })}
              className="w-full flex items-center justify-between p-4 px-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center relative">
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 dark:text-white">Riwayat Notifikasi</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Lihat semua pemberitahuan masuk</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </button>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-4"
        >
          <button 
            onClick={handleLogout}
            className="w-full glass-dark rounded-2xl p-4 flex items-center justify-center gap-3 text-red-500 hover:text-white hover:bg-red-500 border border-red-200 dark:border-red-500/20 hover:border-red-500 transition-all shadow-sm shadow-red-500/5 group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold tracking-wide">Keluar Akun</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profil;
