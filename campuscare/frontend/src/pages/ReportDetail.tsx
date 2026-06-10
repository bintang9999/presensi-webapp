import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Report } from '../types';
import api from '../services/api';
import { Calendar, MapPin, Tag } from 'lucide-react';

const ReportDetail: React.FC = () => {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/reports/${id}`);
      setReport(response.data.data);
    } catch (error) {
      console.error('Failed to fetch report', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-96"><p className="text-sm text-zinc-400">Loading...</p></div>;
  if (!report) return <div className="text-center mt-20 text-lg font-medium text-zinc-400">Laporan tidak ditemukan</div>;

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">{report.judul}</h1>
      </div>

      <div className="vision-pane p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Tag className="text-indigo-400" size={18} />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Kode Laporan</p>
              <p className="text-base font-bold text-white">{report.kode_laporan}</p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-lg font-bold text-sm ${getStatusBadge(report.status)}`}>
            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start space-x-4 bg-white/5 p-5 rounded-2xl border border-white/10">
            <MapPin size={20} className="text-indigo-400 mt-1" />
            <div>
              <p className="text-xs text-zinc-400 font-medium mb-1">Lokasi</p>
              <p className="font-bold text-white text-sm">{report.lokasi}</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 bg-white/5 p-5 rounded-2xl border border-white/10">
            <Calendar size={20} className="text-indigo-400 mt-1" />
            <div>
              <p className="text-xs text-zinc-400 font-medium mb-1">Tanggal Dilaporkan</p>
              <p className="font-bold text-white text-sm">
                {new Date(report.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-3">Deskripsi Kerusakan</h3>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-sm">{report.deskripsi}</p>
          </div>
        </div>
      </div>

      {report.foto && (
        <div className="vision-pane p-8">
          <h3 className="text-lg font-bold text-white mb-4">Foto Kerusakan</h3>
          <img src={report.foto} alt="Kerusakan" className="w-full max-h-[500px] object-cover rounded-2xl shadow-xl border border-white/10" />
        </div>
      )}
    </div>
  );
};

export default ReportDetail;
