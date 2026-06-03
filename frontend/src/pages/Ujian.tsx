import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import api from '../api';

interface UjianItem {
  no: number;
  nama_matakuliah: string;
  tanggal: string | null;
  jam_awal: string | null;
  jam_akhir: string | null;
  ruang: string | null;
  no_kursi: string | null;
  nama_pengawas: string | null;
  status: string | null;
}

const Ujian = () => {
  const [jadwal, setJadwal] = useState<UjianItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ujian');
      const responseData = res.data;
      let finalData = [];
      
      if (Array.isArray(responseData)) {
        finalData = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        finalData = responseData.data;
      } else if (responseData && typeof responseData.data === 'object' && responseData.data !== null) {
        finalData = Object.values(responseData.data);
      } else if (responseData && typeof responseData === 'object' && responseData !== null) {
        finalData = Object.values(responseData);
      }
      
      setJadwal(Array.isArray(finalData) ? finalData : []);
    } catch (err) {
      console.error('Failed to fetch jadwal ujian', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-dark rounded-3xl p-6 md:px-8 mb-8 flex flex-row items-center justify-between border border-slate-200 dark:border-white/5 gap-4"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <CalendarDays className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Jadwal Ujian</h1>
          </div>
        </div>
        
        <button 
          onClick={fetchData} 
          disabled={loading}
          className="p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-110 active:scale-95 disabled:opacity-50 border border-slate-300 dark:border-slate-700/50"
        >
          <RefreshCw className={`w-5 h-5 text-slate-500 dark:text-slate-300 ${loading ? 'animate-spin text-indigo-500 dark:text-indigo-400' : ''}`} />
        </button>
      </motion.header>

      {loading ? (
        <div className="glass-dark rounded-3xl p-16 flex flex-col items-center justify-center space-y-4 border border-slate-200 dark:border-white/5">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-indigo-500 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Memuat jadwal ujian...</p>
        </div>
      ) : jadwal.length === 0 ? (
        <div className="glass-dark rounded-3xl p-16 text-center border border-slate-200 dark:border-white/5">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">Tidak ada ujian</h3>
          <p className="text-slate-500 text-sm">Anda tidak memiliki jadwal ujian dalam waktu dekat.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {jadwal.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark rounded-3xl p-6 border-t-4 border-t-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md uppercase border border-indigo-200 dark:border-indigo-500/20">
                    {item.status || "TERJADWAL"}
                  </span>
                  {item.no_kursi && (
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Kursi: <span className="text-slate-700 dark:text-white">{item.no_kursi}</span>
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 line-clamp-2 min-h-[56px]">{item.nama_matakuliah}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <CalendarDays className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                    <span>{item.tanggal ? format(new Date(item.tanggal), 'EEEE, dd MMM yyyy', { locale: id }) : '-'}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <Clock className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>{item.jam_awal} - {item.jam_akhir}</span>
                  </div>
                  
                  {item.ruang && (
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                      <span className="shrink-0 text-base">📍</span>
                      <span>{item.ruang}</span>
                    </div>
                  )}
                </div>

                {item.nama_pengawas && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold mb-1">Pengawas</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.nama_pengawas}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Ujian;
