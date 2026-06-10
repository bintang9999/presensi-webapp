import React, { useEffect, useState } from 'react';
import { Report } from '../types';
import api from '../services/api';
import { Eye, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports/my-reports');
      setReports(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-2">Riwayat Laporan</h1>
        <p className="text-sm text-zinc-400">Kelola laporan kerusakan Anda</p>
      </div>

      {reports.length === 0 ? (
        <div className="vision-pane p-16 text-center">
          <p className="text-sm text-zinc-400 font-medium">Anda belum membuat laporan apapun</p>
          <Link to="/reports/new" className="inline-block mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-all">
            Buat Laporan Baru
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map(report => (
            <div key={report.id} className="vision-card p-6 hover:bg-white/5 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{report.judul}</h3>
                      <p className="text-xs text-zinc-400 mt-1">{report.kode_laporan}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ml-4 ${getStatusBadge(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs text-zinc-500 mt-4">
                    <span className="flex items-center gap-1">📍 {report.lokasi}</span>
                    <span className="flex items-center gap-1">📅 {new Date(report.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <Link
                  to={`/reports/${report.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all text-xs font-medium border border-white/5"
                >
                  <Eye size={14} />
                  Lihat Detail
                </Link>
                {report.status === 'pending' && (
                  <Link
                    to={`/reports/${report.id}/edit`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 transition-all text-xs font-medium border border-indigo-500/20"
                  >
                    <Edit2 size={14} />
                    Edit
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
