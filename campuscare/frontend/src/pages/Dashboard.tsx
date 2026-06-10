import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Statistics, Report } from '../types';
import api from '../services/api';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AlertCircle, CheckCircle, Clock, Zap, TrendingUp, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Statistics | null>(null);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (user?.role === 'admin') {
        const statsRes = await api.get('/reports/statistics/all');
        setStats(statsRes.data.data);
      } else {
        const reportsRes = await api.get('/reports/my-reports');
        const reports = reportsRes.data.data || [];
        setRecentReports(reports.slice(0, 8));

        const pending = reports.filter((r: Report) => r.status === 'pending').length;
        const diproses = reports.filter((r: Report) => r.status === 'diproses').length;
        const selesai = reports.filter((r: Report) => r.status === 'selesai').length;
        setStats({
          total: reports.length,
          pending,
          diproses,
          selesai,
          ditolak: 0,
          monthlyStats: [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-96"><p className="text-sm text-zinc-400">Loading...</p></div>;

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="vision-card p-4 sm:p-6 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl ${color} shadow-lg`}>
          <Icon className="text-white w-4 h-4 sm:w-[18px] sm:h-[18px]" />
        </div>
        {change && (
          <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg ${
            change > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-zinc-400 text-[10px] sm:text-xs font-semibold mb-0.5 sm:mb-1">{title}</p>
      <p className="text-xl sm:text-3xl font-bold text-white">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {user?.role === 'admin' ? 'Dashboard' : 'Laporan Saya'}
          </h1>
        </div>
        <button className="vision-button px-4 py-2 text-sm font-medium">
          Unduh Laporan
        </button>
      </div>

      {/* Stats Grid - 2x2 */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <StatCard
          title="Total Laporan"
          value={stats?.total || 0}
          change={12}
          icon={AlertCircle}
          color="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Pending"
          value={stats?.pending || 0}
          change={-5}
          icon={Clock}
          color="bg-gradient-to-br from-amber-500 to-amber-600"
        />
        <StatCard
          title="Diproses"
          value={stats?.diproses || 0}
          change={8}
          icon={Zap}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Selesai"
          value={stats?.selesai || 0}
          change={24}
          icon={CheckCircle}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
      </div>

      {/* Charts & Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Chart */}
        {user?.role === 'admin' && stats?.monthlyStats && stats.monthlyStats.length > 0 && (
          <div className="lg:col-span-2 vision-pane p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-white">Trend Laporan</h2>
                <p className="text-xs text-zinc-400 mt-1">12 bulan terakhir</p>
              </div>
              <TrendingUp size={18} className="text-indigo-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyStats.reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="bulan" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(24, 24, 27, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    backdropFilter: 'blur(16px)',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [value, 'Laporan']}
                />
                <Line type="monotone" dataKey="jumlah" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Activity Sidebar */}
        <div className="vision-pane p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Aktivitas</h3>
            <Users size={16} className="text-zinc-500" />
          </div>
          <div className="space-y-3">
            <div className="text-xs text-zinc-300 bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="font-semibold text-white">Sistem aktif</p>
              <p className="mt-1 text-zinc-400">Semua laporan tersinkronisasi</p>
            </div>
            <div className="text-xs text-emerald-200 bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
              <p className="font-semibold text-emerald-400">✓ Status oke</p>
              <p className="mt-1 opacity-80">Tidak ada gangguan server</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      {recentReports.length > 0 && (
        <div className="vision-pane p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Laporan Terbaru</h2>
            <a href="/reports" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">Lihat semua →</a>
          </div>
          <div className="space-y-2">
            {recentReports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-xs">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-100 truncate">{report.kode_laporan}</p>
                  <p className="text-zinc-400 truncate">{report.judul}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap ml-4 ${
                  report.status === 'selesai' ? 'badge-selesai' :
                  report.status === 'diproses' ? 'badge-diproses' :
                  report.status === 'pending' ? 'badge-pending' :
                  'badge-ditolak'
                }`}>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
