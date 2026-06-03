import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Loader2, CalendarClock, ShieldCheck } from 'lucide-react';
import api from '../api';

const Login = () => {
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
      
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login gagal. Silakan periksa kembali kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 overflow-hidden">
      {/* Left Pane - Branding & Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 border-r border-white/5 items-center justify-center p-12 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite_reverse]" />
        
        <div className="relative z-10 w-full max-w-lg space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-8 border border-white/10">
              <CalendarClock className="text-white w-10 h-10" />
            </div>
            <h1 className="text-5xl font-extrabold text-white leading-tight">
              Otomatisasi <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                Presensi Kampus
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-400 font-medium">
              Sistem presensi modern Alma Ata. Pantau jadwal, isi kehadiran, dan biarkan sistem bekerja secara otomatis untuk Anda.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-4 text-sm text-slate-500 pt-8 border-t border-slate-800"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Aman, Cepat, dan Tersinkronisasi Real-Time</span>
          </motion.div>
        </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute inset-0 bg-animate bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05)_0%,transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05)_0%,transparent_30%)]" />
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-dark w-full max-w-md p-8 md:p-10 rounded-3xl z-10"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Selamat Datang 👋</h2>
            <p className="text-slate-400 text-sm">Masuk dengan Akun Raising</p>
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
              <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase ml-1 transition-colors group-focus-within:text-emerald-400">
                NIM Mahasiswa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-400 text-slate-500">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-slate-950/50 border border-slate-700/50 text-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all placeholder:text-slate-600 shadow-inner"
                  placeholder="Masukkan NIM Anda"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase ml-1 transition-colors group-focus-within:text-blue-400">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-400 text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950/50 border border-slate-700/50 text-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all placeholder:text-slate-600 shadow-inner"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 px-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold rounded-2xl hover:from-emerald-400 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mengautentikasi...</span>
                </div>
              ) : (
                'Masuk ke Portal'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
