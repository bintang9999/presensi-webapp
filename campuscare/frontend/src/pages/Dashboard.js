import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AlertCircle, CheckCircle, Clock, Zap, TrendingUp, Users } from 'lucide-react';
const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentReports, setRecentReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetchDashboardData();
    }, []);
    const fetchDashboardData = async () => {
        try {
            if (user?.role === 'admin') {
                const statsRes = await api.get('/reports/statistics/all');
                setStats(statsRes.data.data);
            }
            else {
                const reportsRes = await api.get('/reports/my-reports');
                const reports = reportsRes.data.data || [];
                setRecentReports(reports.slice(0, 8));
                const pending = reports.filter((r) => r.status === 'pending').length;
                const diproses = reports.filter((r) => r.status === 'diproses').length;
                const selesai = reports.filter((r) => r.status === 'selesai').length;
                setStats({
                    total: reports.length,
                    pending,
                    diproses,
                    selesai,
                    ditolak: 0,
                    monthlyStats: [],
                });
            }
        }
        catch (error) {
            console.error('Failed to fetch dashboard data', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    if (isLoading)
        return _jsx("div", { className: "flex items-center justify-center h-96", children: _jsx("p", { className: "text-sm text-zinc-400", children: "Loading..." }) });
    const StatCard = ({ title, value, change, icon: Icon, color }) => (_jsxs("div", { className: "vision-card p-4 sm:p-6 hover:-translate-y-1 transition-all duration-300", children: [_jsxs("div", { className: "flex items-start justify-between mb-2 sm:mb-3", children: [_jsx("div", { className: `p-2 sm:p-2.5 rounded-lg sm:rounded-xl ${color} shadow-lg`, children: _jsx(Icon, { className: "text-white w-4 h-4 sm:w-[18px] sm:h-[18px]" }) }), change && (_jsxs("span", { className: `text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg ${change > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`, children: [change > 0 ? '+' : '', change, "%"] }))] }), _jsx("p", { className: "text-zinc-400 text-[10px] sm:text-xs font-semibold mb-0.5 sm:mb-1", children: title }), _jsx("p", { className: "text-xl sm:text-3xl font-bold text-white", children: value })] }));
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { children: _jsx("h1", { className: "text-2xl font-bold text-white", children: user?.role === 'admin' ? 'Dashboard' : 'Laporan Saya' }) }), _jsx("button", { className: "vision-button px-4 py-2 text-sm font-medium", children: "Unduh Laporan" })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5", children: [_jsx(StatCard, { title: "Total Laporan", value: stats?.total || 0, change: 12, icon: AlertCircle, color: "bg-gradient-to-br from-indigo-500 to-indigo-600" }), _jsx(StatCard, { title: "Pending", value: stats?.pending || 0, change: -5, icon: Clock, color: "bg-gradient-to-br from-amber-500 to-amber-600" }), _jsx(StatCard, { title: "Diproses", value: stats?.diproses || 0, change: 8, icon: Zap, color: "bg-gradient-to-br from-blue-500 to-blue-600" }), _jsx(StatCard, { title: "Selesai", value: stats?.selesai || 0, change: 24, icon: CheckCircle, color: "bg-gradient-to-br from-emerald-500 to-emerald-600" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [user?.role === 'admin' && stats?.monthlyStats && stats.monthlyStats.length > 0 && (_jsxs("div", { className: "lg:col-span-2 vision-pane p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-sm font-bold text-white", children: "Trend Laporan" }), _jsx("p", { className: "text-xs text-zinc-400 mt-1", children: "12 bulan terakhir" })] }), _jsx(TrendingUp, { size: 18, className: "text-indigo-400" })] }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: stats.monthlyStats.reverse(), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.05)" }), _jsx(XAxis, { dataKey: "bulan", stroke: "rgba(255,255,255,0.4)", fontSize: 12 }), _jsx(YAxis, { stroke: "rgba(255,255,255,0.4)", fontSize: 12 }), _jsx(Tooltip, { contentStyle: {
                                                backgroundColor: 'rgba(24, 24, 27, 0.8)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '0.75rem',
                                                backdropFilter: 'blur(16px)',
                                                color: '#fff'
                                            }, itemStyle: { color: '#fff' }, formatter: (value) => [value, 'Laporan'] }), _jsx(Line, { type: "monotone", dataKey: "jumlah", stroke: "#6366f1", strokeWidth: 3, dot: { fill: '#6366f1', r: 4, strokeWidth: 0 } })] }) })] })), _jsxs("div", { className: "vision-pane p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-sm font-bold text-white", children: "Aktivitas" }), _jsx(Users, { size: 16, className: "text-zinc-500" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "text-xs text-zinc-300 bg-white/5 border border-white/10 rounded-xl p-3", children: [_jsx("p", { className: "font-semibold text-white", children: "Sistem aktif" }), _jsx("p", { className: "mt-1 text-zinc-400", children: "Semua laporan tersinkronisasi" })] }), _jsxs("div", { className: "text-xs text-emerald-200 bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20", children: [_jsx("p", { className: "font-semibold text-emerald-400", children: "\u2713 Status oke" }), _jsx("p", { className: "mt-1 opacity-80", children: "Tidak ada gangguan server" })] })] })] })] }), recentReports.length > 0 && (_jsxs("div", { className: "vision-pane p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-sm font-bold text-white", children: "Laporan Terbaru" }), _jsx("a", { href: "/reports", className: "text-xs font-semibold text-indigo-400 hover:text-indigo-300", children: "Lihat semua \u2192" })] }), _jsx("div", { className: "space-y-2", children: recentReports.slice(0, 5).map((report) => (_jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-xs", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "font-semibold text-zinc-100 truncate", children: report.kode_laporan }), _jsx("p", { className: "text-zinc-400 truncate", children: report.judul })] }), _jsx("span", { className: `px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap ml-4 ${report.status === 'selesai' ? 'badge-selesai' :
                                        report.status === 'diproses' ? 'badge-diproses' :
                                            report.status === 'pending' ? 'badge-pending' :
                                                'badge-ditolak'}`, children: report.status.charAt(0).toUpperCase() + report.status.slice(1) })] }, report.id))) })] }))] }));
};
export default Dashboard;
