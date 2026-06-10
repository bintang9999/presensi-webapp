import React, { useEffect, useState } from 'react';
import { User } from '../types';
import api from '../services/api';
import { Edit2, Trash2 } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRole, setEditRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (id: number) => {
    try {
      await api.put(`/users/${id}`, { role: editRole });
      setUsers(users.map(u => u.id === id ? { ...u, role: editRole as any } : u));
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update user', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.error('Failed to delete user', error);
      }
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-96"><p className="text-sm text-zinc-400">Loading...</p></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-2">Manajemen Pengguna</h1>
        <p className="text-sm text-zinc-400">Kelola akses pengguna sistem</p>
      </div>

      <div className="vision-pane overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 backdrop-blur-md">
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap">Nama Lengkap</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap">Email</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap">Role</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap">Bergabung</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 sm:px-8 py-16 text-center text-zinc-500 text-xs sm:text-sm">
                    Tidak ada pengguna
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                    <td className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-semibold text-white whitespace-nowrap">{user.nama}</td>
                    <td className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm text-zinc-300 whitespace-nowrap">{user.email}</td>
                    <td className="px-4 sm:px-8 py-4 sm:py-5">
                      {editingId === user.id ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          onBlur={() => handleUpdateRole(user.id)}
                          className="px-3 py-1.5 rounded-lg border border-indigo-500/50 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-semibold bg-zinc-800 text-white"
                          autoFocus
                        >
                          <option value="pelapor">Pelapor</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-white/10 text-zinc-300 border border-white/10'
                        }`}>
                          {user.role === 'admin' ? 'Administrator' : 'Pelapor'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm text-zinc-400 whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => { setEditingId(user.id); setEditRole(user.role); }}
                        className="p-2 rounded-lg hover:bg-white/10 transition-all text-indigo-400"
                        title="Edit Role"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 rounded-lg hover:bg-rose-500/10 transition-all text-rose-400"
                        title="Hapus User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
