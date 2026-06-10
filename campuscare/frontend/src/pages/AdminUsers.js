import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Edit2, Trash2 } from 'lucide-react';
const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editRole, setEditRole] = useState('');
    useEffect(() => {
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.data || []);
        }
        catch (error) {
            console.error('Failed to fetch users', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleUpdateRole = async (id) => {
        try {
            await api.put(`/users/${id}`, { role: editRole });
            setUsers(users.map(u => u.id === id ? { ...u, role: editRole } : u));
            setEditingId(null);
        }
        catch (error) {
            console.error('Failed to update user', error);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus pengguna ini?')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(u => u.id !== id));
            }
            catch (error) {
                console.error('Failed to delete user', error);
            }
        }
    };
    if (isLoading)
        return _jsx("div", { className: "flex items-center justify-center h-96", children: _jsx("p", { className: "text-sm text-zinc-400", children: "Loading..." }) });
    return (_jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "mb-10", children: [_jsx("h1", { className: "text-2xl font-bold text-white mb-2", children: "Manajemen Pengguna" }), _jsx("p", { className: "text-sm text-zinc-400", children: "Kelola akses pengguna sistem" })] }), _jsx("div", { className: "vision-pane overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-white/10 bg-white/5 backdrop-blur-md", children: [_jsx("th", { className: "px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap", children: "Nama Lengkap" }), _jsx("th", { className: "px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap", children: "Email" }), _jsx("th", { className: "px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap", children: "Role" }), _jsx("th", { className: "px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap", children: "Bergabung" }), _jsx("th", { className: "px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 text-right whitespace-nowrap", children: "Aksi" })] }) }), _jsx("tbody", { children: users.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-4 sm:px-8 py-16 text-center text-zinc-500 text-xs sm:text-sm", children: "Tidak ada pengguna" }) })) : (users.map(user => (_jsxs("tr", { className: "border-b border-white/5 hover:bg-white/5 transition-all", children: [_jsx("td", { className: "px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-semibold text-white whitespace-nowrap", children: user.nama }), _jsx("td", { className: "px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm text-zinc-300 whitespace-nowrap", children: user.email }), _jsx("td", { className: "px-4 sm:px-8 py-4 sm:py-5", children: editingId === user.id ? (_jsxs("select", { value: editRole, onChange: (e) => setEditRole(e.target.value), onBlur: () => handleUpdateRole(user.id), className: "px-3 py-1.5 rounded-lg border border-indigo-500/50 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-semibold bg-zinc-800 text-white", autoFocus: true, children: [_jsx("option", { value: "pelapor", children: "Pelapor" }), _jsx("option", { value: "admin", children: "Admin" })] })) : (_jsx("span", { className: `px-3 py-1.5 rounded-lg text-xs font-semibold ${user.role === 'admin'
                                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                                    : 'bg-white/10 text-zinc-300 border border-white/10'}`, children: user.role === 'admin' ? 'Administrator' : 'Pelapor' })) }), _jsx("td", { className: "px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm text-zinc-400 whitespace-nowrap", children: new Date(user.created_at).toLocaleDateString('id-ID') }), _jsxs("td", { className: "px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-end space-x-2", children: [_jsx("button", { onClick: () => { setEditingId(user.id); setEditRole(user.role); }, className: "p-2 rounded-lg hover:bg-white/10 transition-all text-indigo-400", title: "Edit Role", children: _jsx(Edit2, { size: 16 }) }), _jsx("button", { onClick: () => handleDelete(user.id), className: "p-2 rounded-lg hover:bg-rose-500/10 transition-all text-rose-400", title: "Hapus User", children: _jsx(Trash2, { size: 16 }) })] })] }, user.id)))) })] }) }) })] }));
};
export default AdminUsers;
