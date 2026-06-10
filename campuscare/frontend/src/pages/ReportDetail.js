import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Calendar, MapPin, Tag } from 'lucide-react';
const ReportDetail = () => {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetchReport();
    }, [id]);
    const fetchReport = async () => {
        try {
            const response = await api.get(`/reports/${id}`);
            setReport(response.data.data);
        }
        catch (error) {
            console.error('Failed to fetch report', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    if (isLoading)
        return _jsx("div", { className: "flex items-center justify-center h-96", children: _jsx("p", { className: "text-sm text-zinc-400", children: "Loading..." }) });
    if (!report)
        return _jsx("div", { className: "text-center mt-20 text-lg font-medium text-zinc-400", children: "Laporan tidak ditemukan" });
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
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsx("div", { className: "mb-6", children: _jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: report.judul }) }), _jsxs("div", { className: "vision-pane p-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30", children: _jsx(Tag, { className: "text-indigo-400", size: 18 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-zinc-400 font-medium", children: "Kode Laporan" }), _jsx("p", { className: "text-base font-bold text-white", children: report.kode_laporan })] })] }), _jsx("span", { className: `px-4 py-2 rounded-lg font-bold text-sm ${getStatusBadge(report.status)}`, children: report.status.charAt(0).toUpperCase() + report.status.slice(1) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [_jsxs("div", { className: "flex items-start space-x-4 bg-white/5 p-5 rounded-2xl border border-white/10", children: [_jsx(MapPin, { size: 20, className: "text-indigo-400 mt-1" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-zinc-400 font-medium mb-1", children: "Lokasi" }), _jsx("p", { className: "font-bold text-white text-sm", children: report.lokasi })] })] }), _jsxs("div", { className: "flex items-start space-x-4 bg-white/5 p-5 rounded-2xl border border-white/10", children: [_jsx(Calendar, { size: 20, className: "text-indigo-400 mt-1" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-zinc-400 font-medium mb-1", children: "Tanggal Dilaporkan" }), _jsx("p", { className: "font-bold text-white text-sm", children: new Date(report.created_at).toLocaleDateString('id-ID', {
                                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                }) })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white mb-3", children: "Deskripsi Kerusakan" }), _jsx("div", { className: "bg-white/5 p-6 rounded-2xl border border-white/10", children: _jsx("p", { className: "text-zinc-300 leading-relaxed whitespace-pre-wrap text-sm", children: report.deskripsi }) })] })] }), report.foto && (_jsxs("div", { className: "vision-pane p-8", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Foto Kerusakan" }), _jsx("img", { src: report.foto, alt: "Kerusakan", className: "w-full max-h-[500px] object-cover rounded-2xl shadow-xl border border-white/10" })] }))] }));
};
export default ReportDetail;
