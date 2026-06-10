import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Eye, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
const MyReports = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetchReports();
    }, []);
    const fetchReports = async () => {
        try {
            const response = await api.get('/reports/my-reports');
            setReports(response.data.data || []);
        }
        catch (error) {
            console.error('Failed to fetch reports', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'selesai':
                return 'badge-selesai';
            case 'diproses':
                return 'badge-diproses';
            case 'pending':
                return 'badge-pending';
            case 'ditolak':
                return 'badge-ditolak';
            default:
                return 'badge-pending';
        }
    };
    if (isLoading)
        return _jsx("div", { className: "flex items-center justify-center h-96", children: _jsx("p", { className: "text-sm text-zinc-400", children: "Loading..." }) });
    return (_jsxs("div", { className: "max-w-5xl mx-auto", children: [_jsxs("div", { className: "mb-10", children: [_jsx("h1", { className: "text-2xl font-bold text-white mb-2", children: "Riwayat Laporan" }), _jsx("p", { className: "text-sm text-zinc-400", children: "Kelola laporan kerusakan Anda" })] }), reports.length === 0 ? (_jsxs("div", { className: "vision-pane p-16 text-center", children: [_jsx("p", { className: "text-sm text-zinc-400 font-medium", children: "Anda belum membuat laporan apapun" }), _jsx(Link, { to: "/reports/new", className: "inline-block mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-all", children: "Buat Laporan Baru" })] })) : (_jsx("div", { className: "space-y-4", children: reports.map(report => (_jsxs("div", { className: "vision-card p-6 hover:bg-white/5 transition-all", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white", children: report.judul }), _jsx("p", { className: "text-xs text-zinc-400 mt-1", children: report.kode_laporan })] }), _jsx("span", { className: `px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ml-4 ${getStatusBadge(report.status)}`, children: report.status.charAt(0).toUpperCase() + report.status.slice(1) })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs text-zinc-500 mt-4", children: [_jsxs("span", { className: "flex items-center gap-1", children: ["\uD83D\uDCCD ", report.lokasi] }), _jsxs("span", { className: "flex items-center gap-1", children: ["\uD83D\uDCC5 ", new Date(report.created_at).toLocaleDateString('id-ID')] })] })] }) }), _jsxs("div", { className: "flex gap-3 mt-5", children: [_jsxs(Link, { to: `/reports/${report.id}`, className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all text-xs font-medium border border-white/5", children: [_jsx(Eye, { size: 14 }), "Lihat Detail"] }), report.status === 'pending' && (_jsxs(Link, { to: `/reports/${report.id}/edit`, className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 transition-all text-xs font-medium border border-indigo-500/20", children: [_jsx(Edit2, { size: 14 }), "Edit"] }))] })] }, report.id))) }))] }));
};
export default MyReports;
