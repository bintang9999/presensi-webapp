import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import api from '../services/api';
const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    useEffect(() => {
        fetchReports();
    }, []);
    const fetchReports = async () => {
        try {
            const response = await api.get('/reports');
            setReports(response.data.data || []);
        }
        catch (error) {
            console.error('Failed to fetch reports', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const updateStatus = async (id, status) => {
        try {
            await api.put(`/reports/${id}/status`, { status });
            setReports(reports.map(r => r.id === id ? { ...r, status: status } : r));
        }
        catch (error) {
            console.error('Failed to update status', error);
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
    const statuses = ['pending', 'diproses', 'selesai', 'ditolak'];
    return (_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-10", children: [_jsx("h1", { className: "text-2xl font-bold text-white mb-2", children: "Manajemen Laporan" }), _jsx("p", { className: "text-sm text-zinc-400", children: "Kelola semua laporan kerusakan kampus" })] }), _jsx("div", { className: "vision-pane overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-white/10 bg-white/5 backdrop-blur-md", children: [_jsx("th", { className: "px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap", children: "Kode" }), _jsx("th", { className: "px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap", children: "Pelapor" }), _jsx("th", { className: "px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 min-w-[150px]", children: "Judul" }), _jsx("th", { className: "px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap", children: "Lokasi" }), _jsx("th", { className: "px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap", children: "Status" }), _jsx("th", { className: "px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap", children: "Tanggal" })] }) }), _jsx("tbody", { children: reports.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-8 py-16 text-center text-zinc-500 text-sm", children: "Tidak ada laporan" }) })) : (reports.map(report => (_jsxs(React.Fragment, { children: [_jsxs("tr", { className: "border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer", onClick: () => setExpandedId(expandedId === report.id ? null : report.id), children: [_jsx("td", { className: "px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-semibold text-white whitespace-nowrap", children: report.kode_laporan }), _jsx("td", { className: "px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm text-zinc-300 whitespace-nowrap", children: report.pelapor || 'Unknown' }), _jsx("td", { className: "px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm text-zinc-300 min-w-[150px]", children: report.judul }), _jsx("td", { className: "px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm text-zinc-400 whitespace-nowrap", children: report.lokasi }), _jsx("td", { className: "px-4 sm:px-8 py-4 sm:py-5", children: _jsx("div", { className: "relative", children: _jsx("select", { value: report.status, onClick: (e) => e.stopPropagation(), onChange: (e) => { e.stopPropagation(); updateStatus(report.id, e.target.value); }, className: `px-3 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer outline-none appearance-none pr-8 bg-zinc-800 text-white shadow-sm ring-1 ring-white/10 ${getStatusBadge(report.status)}`, children: statuses.map(s => (_jsx("option", { value: s, className: "bg-zinc-900 text-white", children: s.charAt(0).toUpperCase() + s.slice(1) }, s))) }) }) }), _jsx("td", { className: "px-8 py-5 text-xs text-zinc-400", children: new Date(report.created_at).toLocaleDateString('id-ID') })] }), expandedId === report.id && (_jsx("tr", { className: "bg-white/5 border-b border-white/10", children: _jsx("td", { colSpan: 6, className: "px-8 py-8", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-white mb-2", children: "Deskripsi Detail" }), _jsx("p", { className: "text-sm text-zinc-300 leading-relaxed max-w-4xl", children: report.deskripsi })] }), report.foto && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-white mb-3", children: "Foto Kerusakan" }), _jsx("img", { src: report.foto, alt: "Report", className: "max-w-2xl h-auto rounded-2xl shadow-lg ring-1 ring-white/10" })] }))] }) }) }))] }, report.id)))) })] }) }) })] }));
};
export default AdminReports;
