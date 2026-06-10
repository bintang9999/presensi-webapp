import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Loader2 } from 'lucide-react';
import api from '../api';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // Memaksa mode dark agar tampilan login selalu mirip dashboard dark mode
    const root = window.document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    
    return () => {
      // Mengembalikan tema sesuai preferensi user saat unmount
      if (theme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    };
  }, [theme]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await api.post('/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      try {
        localStorage.setItem('token', response.data.access_token);
      } catch (e) {
        console.warn('Gagal menyimpan token di localStorage:', e);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login gagal. Silakan periksa kembali kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-transparent overflow-hidden">
      {/* Login Form */}
      <div className="w-full flex items-center justify-center p-6 md:p-12 relative">
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-dark w-full max-w-md p-5 md:p-10 rounded-3xl z-10"
        >
          <div className="text-center mb-5">
            <img src="/RAICINK-LOGO.png" alt="RAICINK" className="h-32 mx-auto mb-1 object-contain" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Masuk dengan Akun Raising</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm text-center font-medium flex items-center justify-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase ml-1 transition-colors group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400">
                NIM
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 text-slate-400 dark:text-slate-500">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm dark:shadow-inner"
                  placeholder="Masukkan NIM Anda"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase ml-1 transition-colors group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 text-slate-400 dark:text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm dark:shadow-inner"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 px-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Bentar....</span>
                </div>
              ) : (
                'Masuk'
              )}
            </button>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
