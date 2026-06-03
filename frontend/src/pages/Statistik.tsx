import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Loader2 } from 'lucide-react';
import api from '../api';

interface StatistikSummary {
  Hadir: number;
  Izin: number;
  Sakit: number;
  Alpha: number;
}

interface StatistikDetail {
  nama_matakuliah: string;
  total_hadir: number;
  total_tidak_hadir: number;
  presentase_kehadiran: number;
}

interface StatistikResponse {
  summary: StatistikSummary;
  details: StatistikDetail[];
}

const Statistik = () => {
  const [data, setData] = useState<StatistikResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/kehadiran');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch statistik', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-transparent pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-dark rounded-3xl p-8 relative overflow-hidden group border border-slate-200 dark:border-white/5"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-150 duration-700" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Statistik Kehadiran</h2>
              <p className="text-slate-500 dark:text-slate-400">Performa perkuliahan semester ini.</p>
            </div>
            
            {data && (
              <div className="flex gap-4">
                <div className="bg-white/80 dark:bg-slate-900/60 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-4 min-w-[100px] text-center shadow-sm dark:shadow-none">
                  <p className="text-xs text-emerald-600 dark:text-emerald-500/70 font-bold mb-1 uppercase tracking-widest">Hadir</p>
                  <p className="text-2xl font-black text-emerald-500 dark:text-emerald-400">{data.summary.Hadir}</p>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/60 border border-red-200 dark:border-red-500/30 rounded-2xl p-4 min-w-[100px] text-center shadow-sm dark:shadow-none">
                  <p className="text-xs text-red-600 dark:text-red-500/70 font-bold mb-1 uppercase tracking-widest">Alpha</p>
                  <p className="text-2xl font-black text-red-500 dark:text-red-400">{data.summary.Alpha}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* List of Mata Kuliah */}
        {loading && !data ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : data && data.details.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 px-2">
              <PieChart className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              Mata Kuliah
            </h3>
            <div className="grid gap-4">
              {data.details.map((course, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-dark rounded-2xl p-6 border border-slate-200 dark:border-white/5 hover:bg-white/90 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 text-lg">{course.nama_matakuliah}</h4>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-500/70 uppercase tracking-widest mb-0.5">Hadir</span>
                        <span className="text-lg font-bold text-emerald-500 dark:text-emerald-400">{course.total_hadir}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-semibold text-red-600 dark:text-red-500/70 uppercase tracking-widest mb-0.5">Alpha</span>
                        <span className="text-lg font-bold text-red-500 dark:text-red-400">{course.total_tidak_hadir}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700/50">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.presentase_kehadiran}%` }}
                        transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                        className={`h-full rounded-full ${
                          course.presentase_kehadiran >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                          course.presentase_kehadiran >= 50 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' :
                          'bg-gradient-to-r from-red-500 to-red-400'
                        }`}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 min-w-[3rem] text-right">
                      {course.presentase_kehadiran}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-dark rounded-3xl p-16 text-center border border-slate-200 dark:border-white/5">
            <PieChart className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Tidak ada data statistik ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistik;
