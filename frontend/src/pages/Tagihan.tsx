import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, RefreshCw, AlertCircle, ChevronDown } from 'lucide-react';
import api from '../api';

interface TagihanItem {
  id_tagihan: string;
  nama_tagihan: string;
  jumlah: number;
  sudah_dibayar: number;
  sisa_tagihan: number;
  status: string;
}

const Tagihan = () => {
  const [tagihan, setTagihan] = useState<TagihanItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [semester, setSemester] = useState('20252'); // Default to requested semester

  // You can dynamically generate this list or fetch it if there's an endpoint
  const semesterOptions = [
    { value: '20252', label: 'Genap 2024/2025 (20252)' },
    { value: '20251', label: 'Ganjil 2024/2025 (20251)' },
    { value: '20242', label: 'Genap 2023/2024 (20242)' },
    { value: '20241', label: 'Ganjil 2023/2024 (20241)' },
  ];

  const parseTagihanHTML = (htmlString: string): TagihanItem[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<table>${htmlString}</table>`, 'text/html');
    const rows = doc.querySelectorAll('tr');
    
    const parsedData: TagihanItem[] = [];
    
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 6 && !cells[0].hasAttribute('colspan')) {
        const nama = cells[1]?.textContent?.trim() || 'Tagihan';
        const jumlahStr = cells[3]?.textContent?.replace(/,/g, '') || '0';
        const jumlah = parseInt(jumlahStr, 10) || 0;
        
        const statusText = cells[5]?.textContent?.trim().toLowerCase() || '';
        const isLunas = statusText.includes('lunas') && !statusText.includes('belum');
        
        parsedData.push({
          id_tagihan: cells[2]?.textContent?.trim() || '',
          nama_tagihan: nama,
          jumlah: jumlah,
          sudah_dibayar: isLunas ? jumlah : 0,
          sisa_tagihan: isLunas ? 0 : jumlah,
          status: isLunas ? 'LUNAS' : 'BELUM LUNAS'
        });
      }
    });
    
    return parsedData;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/tagihan/${semester}`);
      const responseData = res.data;
      
      let finalData: TagihanItem[] = [];
      
      // The API returns HTML in responseData.data.tagihan
      if (responseData && responseData.data && typeof responseData.data.tagihan === 'string') {
        finalData = parseTagihanHTML(responseData.data.tagihan);
      } else if (Array.isArray(responseData)) {
        finalData = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        finalData = responseData.data;
      } else if (responseData && typeof responseData.data === 'object' && responseData.data !== null) {
        finalData = Object.values(responseData.data);
      }
      
      setTagihan(Array.isArray(finalData) ? finalData : []);
    } catch (err) {
      console.error('Failed to fetch tagihan', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [semester]);

  const totalTagihan = tagihan.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
  const totalDibayar = tagihan.reduce((acc, curr) => acc + (Number(curr.sudah_dibayar) || 0), 0);
  const totalSisa = tagihan.reduce((acc, curr) => acc + (Number(curr.sisa_tagihan) || 0), 0);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-dark rounded-3xl p-6 md:px-8 mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between border border-white/5 gap-6"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Keuangan</h1>
              {tagihan.length > 0 && totalSisa === 0 && (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md text-xs">
                  🟢 Lunas
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Informasi tagihan & pembayaran</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:min-w-[250px]">
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full appearance-none bg-white/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 text-sm rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              {semesterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400 dark:text-slate-500">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 border border-slate-300 dark:border-slate-700/50"
          >
            <RefreshCw className={`w-5 h-5 text-slate-500 dark:text-slate-300 ${loading ? 'animate-spin text-orange-500 dark:text-orange-400' : ''}`} />
          </button>
        </div>
      </motion.header>

      {/* Ringkasan */}
      {!loading && tagihan.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass-dark rounded-3xl p-6 border border-slate-200 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Total Tagihan</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{formatRupiah(totalTagihan)}</p>
          </div>
          <div className="glass-dark rounded-3xl p-6 border border-slate-200 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Sudah Dibayar</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(totalDibayar)}</p>
          </div>
          <div className="glass-dark rounded-3xl p-6 border border-slate-200 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Sisa Tagihan</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{formatRupiah(totalSisa)}</p>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="glass-dark rounded-3xl p-16 flex flex-col items-center justify-center space-y-4 border border-slate-200 dark:border-white/5">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-orange-500 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Memuat data keuangan...</p>
        </div>
      ) : tagihan.length === 0 ? (
        <div className="glass-dark rounded-3xl p-16 text-center border border-slate-200 dark:border-white/5">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">Data tidak ditemukan</h3>
          <p className="text-slate-500 text-sm">Tidak ada riwayat tagihan untuk semester ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white px-2 mb-4">Rincian Tagihan</h2>
          <AnimatePresence>
            {tagihan.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark rounded-2xl p-6 border-l-4 border-l-orange-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-white/90 dark:hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{item.nama_tagihan || 'Tagihan Semester'}</h3>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className={`px-2.5 py-1 rounded-md border ${
                      item.sisa_tagihan <= 0 
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' 
                        : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30'
                    }`}>
                      {item.sisa_tagihan <= 0 ? 'LUNAS' : 'BELUM LUNAS'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center gap-6 md:gap-12 w-full md:w-auto bg-slate-50 dark:bg-slate-950/50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none border md:border-none border-slate-200 dark:border-slate-800/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Biaya</span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{formatRupiah(item.jumlah)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Dibayar</span>
                    <span className="text-sm font-bold text-emerald-500 dark:text-emerald-400">{formatRupiah(item.sudah_dibayar)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Sisa</span>
                    <span className="text-sm font-bold text-orange-500 dark:text-orange-400">{formatRupiah(item.sisa_tagihan)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Tagihan;
