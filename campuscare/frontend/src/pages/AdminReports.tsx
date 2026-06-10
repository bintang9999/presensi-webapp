import React, { useEffect, useState } from 'react';
import { Report } from '../types';
import api from '../services/api';

const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/reports/${id}/status`, { status });
      setReports(reports.map(r => r.id === id ? { ...r, status: status as any } : r));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const getStatusBadge = (status: string) => {
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

  if (isLoading) return <div className="flex items-center justify-center h-96"><p className="text-sm text-zinc-400">Loading...</p></div>;

  const statuses = ['pending', 'diproses', 'selesai', 'ditolak'];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-2">Manajemen Laporan</h1>
        <p className="text-sm text-zinc-400">Kelola semua laporan kerusakan kampus</p>
      </div>

      <div className="vision-pane overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 backdrop-blur-md">
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap">Kode</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap">Pelapor</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 min-w-[150px]">Judul</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap">Lokasi</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap">Status</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-semibold text-zinc-300 whitespace-nowrap">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-zinc-500 text-sm">
                    Tidak ada laporan
                  </td>
                </tr>
              ) : (
                reports.map(report => (
                  <React.Fragment key={report.id}>
                    <tr
                      className="border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer"
                      onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                    >
                      <td className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-semibold text-white whitespace-nowrap">{report.kode_laporan}</td>
                      <td className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm text-zinc-300 whitespace-nowrap">{report.pelapor || 'Unknown'}</td>
                      <td className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm text-zinc-300 min-w-[150px]">{report.judul}</td>
                      <td className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm text-zinc-400 whitespace-nowrap">{report.lokasi}</td>
                      <td className="px-4 sm:px-8 py-4 sm:py-5">
                        <div className="relative">
                          <select
                            value={report.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => { e.stopPropagation(); updateStatus(report.id, e.target.value); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer outline-none appearance-none pr-8 bg-zinc-800 text-white shadow-sm ring-1 ring-white/10 ${getStatusBadge(report.status)}`}
                          >
                            {statuses.map(s => (
                              <option key={s} value={s} className="bg-zinc-900 text-white">
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs text-zinc-400">
                        {new Date(report.created_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                    {expandedId === report.id && (
                      <tr className="bg-white/5 border-b border-white/10">
                        <td colSpan={6} className="px-8 py-8">
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-bold text-white mb-2">Deskripsi Detail</h4>
                              <p className="text-sm text-zinc-300 leading-relaxed max-w-4xl">{report.deskripsi}</p>
                            </div>
                            {report.foto && (
                              <div>
                                <h4 className="text-sm font-bold text-white mb-3">Foto Kerusakan</h4>
                                <img src={report.foto} alt="Report" className="max-w-2xl h-auto rounded-2xl shadow-lg ring-1 ring-white/10" />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
