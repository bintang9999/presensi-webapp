import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Report } from '../types';
import { Upload, X } from 'lucide-react';

const EditReport: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    lokasi: '',
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/reports/${id}`);
      const report: Report = response.data.data;
      setFormData({
        judul: report.judul,
        deskripsi: report.deskripsi,
        lokasi: report.lokasi,
      });
      if (report.foto) {
        setPreview(report.foto);
      }
    } catch (error) {
      console.error('Failed to fetch report', error);
      setError('Tidak dapat memuat laporan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const data = new FormData();
      data.append('judul', formData.judul);
      data.append('deskripsi', formData.deskripsi);
      data.append('lokasi', formData.lokasi);
      if (foto) data.append('foto', foto);

      await api.put(`/reports/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/reports');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-96"><p className="text-sm text-zinc-400">Loading...</p></div>;

  const lokasisList = ['Ruang Kelas', 'Laboratorium', 'Kantor', 'Toilet', 'Aula', 'Parkir', 'Taman', 'Lainnya'];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Edit Laporan</h1>
        <p className="text-sm text-zinc-400">Perbarui informasi laporan kerusakan Anda</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-5 rounded-2xl mb-6 font-medium text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="vision-pane p-10 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Judul Kerusakan</label>
          <input
            type="text"
            name="judul"
            value={formData.judul}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl vision-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">Lokasi</label>
          <select
            name="lokasi"
            value={formData.lokasi}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl vision-input appearance-none bg-zinc-900/50"
            required
          >
            <option value="" className="bg-zinc-800">Pilih Lokasi</option>
            {lokasisList.map(loc => (
              <option key={loc} value={loc} className="bg-zinc-800">{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">Deskripsi Detail</label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-4 py-2.5 rounded-xl vision-input resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">Foto Kerusakan</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="flex flex-col items-center justify-center w-full p-8 border border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/5 transition-all bg-white/5"
            >
              <Upload size={24} className="text-indigo-400 mb-2" />
              <span className="text-zinc-300 text-sm font-medium">Klik untuk ubah foto</span>
            </label>
          </div>
          {preview && (
            <div className="relative mt-5">
              <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-xl shadow-lg ring-1 ring-white/10" />
              <button
                type="button"
                onClick={() => { setFoto(null); setPreview(''); }}
                className="absolute top-3 right-3 p-1.5 bg-rose-500/80 backdrop-blur-md text-white rounded-lg hover:bg-rose-500 transition-all border border-white/20"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70 text-sm mt-8 border border-indigo-400/30"
        >
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
};

export default EditReport;
