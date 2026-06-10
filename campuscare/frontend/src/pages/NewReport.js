import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Upload, X } from 'lucide-react';
const NewReport = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        judul: '',
        deskripsi: '',
        lokasi: '',
    });
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const data = new FormData();
            data.append('judul', formData.judul);
            data.append('deskripsi', formData.deskripsi);
            data.append('lokasi', formData.lokasi);
            if (foto)
                data.append('foto', foto);
            const response = await api.post('/reports/create', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                navigate('/reports');
            }
        }
        catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan');
        }
        finally {
            setIsLoading(false);
        }
    };
    const lokasisList = ['Ruang Kelas', 'Laboratorium', 'Kantor', 'Toilet', 'Aula', 'Parkir', 'Taman', 'Lainnya'];
    return (_jsxs("div", { className: "max-w-3xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-white mb-2", children: "Buat Laporan Baru" }), _jsx("p", { className: "text-sm text-zinc-400", children: "Laporkan kerusakan fasilitas kampus dengan detail" })] }), error && (_jsx("div", { className: "bg-rose-500/10 border border-rose-500/20 text-rose-300 p-5 rounded-2xl mb-6 font-medium text-sm", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "vision-pane p-10 space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-white mb-2", children: "Judul Kerusakan" }), _jsx("input", { type: "text", name: "judul", value: formData.judul, onChange: handleInputChange, placeholder: "Contoh: AC Rusak di Ruang 101", className: "w-full px-4 py-2.5 rounded-xl vision-input", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-white mb-2", children: "Lokasi" }), _jsxs("select", { name: "lokasi", value: formData.lokasi, onChange: handleInputChange, className: "w-full px-4 py-2.5 rounded-xl vision-input appearance-none bg-zinc-900/50", required: true, children: [_jsx("option", { value: "", className: "bg-zinc-800", children: "Pilih Lokasi" }), lokasisList.map(loc => (_jsx("option", { value: loc, className: "bg-zinc-800", children: loc }, loc)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-white mb-2", children: "Deskripsi Detail" }), _jsx("textarea", { name: "deskripsi", value: formData.deskripsi, onChange: handleInputChange, placeholder: "Jelaskan detail kerusakan yang terjadi...", rows: 5, className: "w-full px-4 py-2.5 rounded-xl vision-input resize-none", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-white mb-2", children: "Upload Foto (Opsional)" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "file", accept: "image/*", onChange: handleFileChange, className: "hidden", id: "file-input" }), _jsxs("label", { htmlFor: "file-input", className: "flex flex-col items-center justify-center w-full p-8 border border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/5 transition-all bg-white/5", children: [_jsx(Upload, { size: 24, className: "text-indigo-400 mb-2" }), _jsx("span", { className: "text-zinc-300 text-sm font-medium", children: "Klik untuk upload foto" }), _jsx("span", { className: "text-xs text-zinc-500 mt-1", children: "Max 5MB" })] })] }), preview && (_jsxs("div", { className: "relative mt-5", children: [_jsx("img", { src: preview, alt: "Preview", className: "w-full h-64 object-cover rounded-xl shadow-lg ring-1 ring-white/10" }), _jsx("button", { type: "button", onClick: () => { setFoto(null); setPreview(''); }, className: "absolute top-3 right-3 p-1.5 bg-rose-500/80 backdrop-blur-md text-white rounded-lg hover:bg-rose-500 transition-all border border-white/20", children: _jsx(X, { size: 16 }) })] }))] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70 text-sm mt-8 border border-indigo-400/30", children: isLoading ? 'Mengirim...' : 'Kirim Laporan' })] })] }));
};
export default NewReport;
