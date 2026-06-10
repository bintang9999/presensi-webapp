import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'pelapor'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      if (response.data.success) {
        login(response.data.data.token, response.data.data);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat registrasi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent relative z-10">
      <div className="w-full max-w-md">
        <div className="vision-pane p-6 sm:p-10">
          <div className="text-center mb-8 sm:mb-10">
            <div className="flex justify-center mb-4 sm:mb-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-xl sm:text-2xl font-bold text-white">C</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Daftar</h1>
            <p className="text-zinc-400 font-medium text-xs sm:text-sm">Buat akun sebagai Pelapor</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-4 rounded-xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-200 mb-2">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl vision-input text-white"
                placeholder="Masukkan nama Anda"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-200 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl vision-input text-white"
                placeholder="nama@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-200 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl vision-input text-white"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70 text-sm mt-6 border border-indigo-400/30"
            >
              {isLoading ? 'Loading...' : 'Daftar'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-zinc-400 text-sm mb-3">Sudah punya akun?</p>
            <a
              href="/login"
              className="block w-full py-2.5 text-center text-indigo-400 font-semibold hover:text-indigo-300 transition-colors text-sm"
            >
              Login di sini →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
