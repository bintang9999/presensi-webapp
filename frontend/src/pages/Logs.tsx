import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle2, AlertCircle, CircleDashed } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import api from '../api';

interface LogData {
  id: number;
  matkul: string;
  kode: string;
  status: string;
  message: string;
  timestamp: string;
}

const Logs = () => {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/logs');
        setLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch logs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-transparent max-w-4xl mx-auto">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3 px-2">
          <Terminal className="w-8 h-8 text-slate-500 dark:text-slate-400" />
          Log Aktivitas
        </h2>
        
        <div className="glass-dark rounded-3xl p-6 min-h-[500px] flex flex-col border border-slate-200 dark:border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 dark:from-slate-900/50 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex-1 overflow-y-auto pr-3 custom-scrollbar">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center opacity-50 py-20">
                <div className="w-10 h-10 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-emerald-500 animate-spin mb-4" />
                <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-300">Memuat log aktivitas...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-50 py-20">
                <CircleDashed className="w-12 h-12 mb-4 text-slate-400 dark:text-slate-500" />
                <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-300">Belum ada log aktivitas hari ini.</p>
              </div>
            ) : (
              <div className="space-y-0 py-2">
                <AnimatePresence>
                  {logs.map((log, index) => {
                    const isSuccess = log.status === 'SUCCESS';
                    const isLast = index === logs.length - 1;
                    return (
                      <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4 relative group"
                      >
                        {!isLast && (
                          <div className="absolute left-2.5 top-8 bottom-[-16px] w-px bg-slate-200 dark:bg-slate-800 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 transition-colors" />
                        )}
                        
                        <div className="relative mt-1 z-10">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSuccess ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-red-50 dark:bg-red-500/10'}`}>
                            {isSuccess ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 pb-5 pt-1">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1">
                              {format(new Date(log.timestamp), 'dd MMM yyyy • HH:mm:ss', { locale: id })}
                            </span>
                            <p className="text-slate-700 dark:text-slate-200 font-bold text-sm leading-tight mb-1">{log.matkul}</p>
                            <p className={`text-xs font-medium leading-relaxed ${isSuccess ? 'text-emerald-600 dark:text-emerald-400/90' : 'text-red-600 dark:text-red-400/90'}`}>
                              {log.message} <span className="text-slate-400 dark:text-slate-500">(Kode: {log.kode})</span>
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;
