import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle, AlertCircle, RefreshCw, Activity, Terminal, CheckCircle2, CircleDashed } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import api from '../api';

interface ScheduleItem {
  id_pertemuan_presensi: string;
  nama_matakuliah: string;
  kode: string | null;
  status_presensi: string;
  pertemuan_ke: string | null;
  tanggal: string | null;
  jam_mulai: string | null;
  jam_selesai: string | null;
  ruang?: string | null;
  status_pertemuan?: string | null;
  is_auto?: boolean;
}

interface LogItem {
  id: number;
  matkul: string;
  kode: string;
  status: string;
  message: string;
  timestamp: string;
}

const Dashboard = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isAutoActive, setIsAutoActive] = useState(true);
  const [showRocket, setShowRocket] = useState(false);
  const [userNpm, setUserNpm] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [scheduleRes, logsRes, statusRes] = await Promise.all([
        api.get('/schedule'),
        api.get('/logs'),
        api.get('/status')
      ]);
      setSchedules(scheduleRes.data);
      setLogs(logsRes.data);
      setIsAutoActive(statusRes.data.is_active);
      setUserNpm(statusRes.data.npm);
      if (statusRes.data.nama) {
        setUserName(statusRes.data.nama);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh logs every 30 seconds to show auto-attendance updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleManualAttendance = async (id: string, kode: string, matkul: string) => {
    if (!kode || kode === '-') {
      alert('Kode presensi belum tersedia dari dosen (masih ---). Silakan refresh nanti jika sudah dibuka!');
      return;
    }
    setActionLoading(id);
    try {
      await api.post(`/attendance/${id}?kode=${kode}&matkul=${encodeURIComponent(matkul)}`);
      // Trigger rocket animation on success
      setShowRocket(true);
      setTimeout(() => setShowRocket(false), 2000);
      
      // Refresh data
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Gagal mengirim presensi.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAuto = async () => {
    try {
      const res = await api.post('/toggle-auto');
      setIsAutoActive(res.data.is_active);
    } catch (err) {
      alert('Gagal mengubah status auto-monitoring');
    }
  };


  const groupedSchedules = schedules.reduce((acc, curr) => {
    const date = curr.tanggal || 'Unknown Date';
    if (!acc[date]) acc[date] = [];
    acc[date].push(curr);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  // Calculate Quick Stats for today
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  let totalClassesToday = 0;
  let attendedClassesToday = 0;
  
  if (groupedSchedules[todayStr]) {
    totalClassesToday = groupedSchedules[todayStr].length;
    attendedClassesToday = groupedSchedules[todayStr].filter(s => s.status_presensi !== "0").length;
  }

  // Greeting
  const currentHour = new Date().getHours();
  let greeting = "Selamat Malam";
  if (currentHour < 12) greeting = "Selamat Pagi";
  else if (currentHour < 15) greeting = "Selamat Siang";
  else if (currentHour < 18) greeting = "Selamat Sore";
  
  const firstName = userName ? userName.split(' ')[0] : '';

  return (
    <div className="min-h-screen p-4 md:p-8 bg-transparent">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-dark rounded-3xl p-4 md:px-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between sticky top-4 z-50 gap-4 border border-white/5"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Calendar className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-300 font-bold bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">NIM: {userNpm}</span>
              <button 
                onClick={handleToggleAuto}
                className={`text-sm font-semibold px-3 py-1.5 rounded-lg border transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${
                isAutoActive 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                  : 'bg-slate-800/80 text-slate-400 border-slate-700/50 hover:bg-slate-700/80'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isAutoActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
              {isAutoActive ? 'Auto-Presensi Aktif' : 'Auto-Presensi Jeda'}
            </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* Main Content Column (Left - Takes 2 cols) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Welcome Banner & Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-dark rounded-3xl p-8 relative overflow-hidden group border border-white/5"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-150 duration-700" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{greeting}{firstName ? `, ${firstName}` : ''} 👋</h2>
                <p className="text-slate-400">Siap untuk mengikuti perkuliahan hari ini?</p>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 min-w-[120px]">
                  <p className="text-sm text-slate-400 font-medium mb-1">Kelas Hari Ini</p>
                  <p className="text-3xl font-bold text-white">{totalClassesToday}</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 min-w-[120px]">
                  <p className="text-sm text-slate-400 font-medium mb-1">Sudah Presensi</p>
                  <p className="text-3xl font-bold text-emerald-400 flex items-center gap-2">
                    {attendedClassesToday}
                    {totalClassesToday > 0 && attendedClassesToday === totalClassesToday && (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Schedule Section */}
          <div>
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-400" />
                Jadwal Perkuliahan
              </h2>
              <button 
                onClick={fetchData} 
                disabled={loading}
                className="p-2.5 bg-slate-800/80 rounded-xl hover:bg-slate-700 transition-all hover:scale-110 active:scale-95 disabled:opacity-50 border border-slate-700/50"
              >
                <RefreshCw className={`w-5 h-5 text-slate-300 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
            </div>

            {loading && schedules.length === 0 ? (
              <div className="glass-dark rounded-3xl p-16 flex flex-col items-center justify-center space-y-4 border border-white/5">
                <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-emerald-500 animate-spin" />
                <p className="text-slate-400 font-medium">Memuat jadwal terbaru...</p>
              </div>
            ) : schedules.length === 0 ? (
              <div className="glass-dark rounded-3xl p-16 text-center border border-white/5">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-1">Tidak ada jadwal</h3>
                <p className="text-slate-500 text-sm">Belum ada kelas aktif yang ditemukan di portal.</p>
              </div>
            ) : (
              <div className="space-y-10">
                <AnimatePresence>
                  {Object.entries(groupedSchedules).sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()).map(([date, items], groupIndex) => (
                    <motion.div 
                      key={date}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: groupIndex * 0.1 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center gap-3 px-2">
                        <div className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <h3 className="font-bold text-blue-400 text-sm flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {date !== 'Unknown Date' ? format(new Date(date), 'EEEE, dd MMM yyyy', { locale: id }) : 'Tanpa Tanggal'}
                          </h3>
                        </div>
                        <div className="flex-1 h-px bg-slate-800" />
                      </div>
                      
                      <div className="grid gap-4">
                        {items.map((item) => {
                          const isDone = item.status_presensi !== "0";
                          const isPending = !isDone && item.kode && item.kode !== "-";
                          
                          let computedStatusPertemuan = (item.status_pertemuan || '').split(':')[0].trim();
                          if (!computedStatusPertemuan && item.tanggal && item.jam_mulai && item.jam_selesai) {
                            const now = new Date();
                            const todayStr = format(now, 'yyyy-MM-dd');
                            const itemDate = item.tanggal.split(' ')[0];
                            if (itemDate === todayStr) {
                              const currentTimeStr = format(now, 'HH:mm');
                              if (currentTimeStr < item.jam_mulai) computedStatusPertemuan = "Belum Dimulai";
                              else if (currentTimeStr > item.jam_selesai) computedStatusPertemuan = "Selesai";
                              else computedStatusPertemuan = "Sedang Berlangsung";
                            } else if (new Date(itemDate) < now) {
                              computedStatusPertemuan = "Selesai";
                            } else {
                              computedStatusPertemuan = "Belum Dimulai";
                            }
                          } else if (!computedStatusPertemuan) {
                             computedStatusPertemuan = "Belum Dimulai";
                          }
                          
                          return (
                            <div
                              key={item.id_pertemuan_presensi}
                              className={`glass-dark rounded-3xl p-6 border-l-4 transition-all duration-300 hover:scale-[1.01] hover:bg-slate-900/60 ${
                                isDone 
                                  ? 'border-l-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                                  : isPending 
                                    ? 'border-l-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                                    : 'border-l-slate-600 hover:border-l-slate-500'
                              }`}
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="text-[11px] font-bold tracking-wider px-2.5 py-1 bg-slate-800 rounded-md text-slate-300 uppercase">
                                      Pertemuan {item.pertemuan_ke}
                                    </span>
                                    {isDone ? (
                                      <span className="text-[11px] font-bold tracking-wider px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-md flex items-center gap-1 uppercase">
                                        <CheckCircle className="w-3.5 h-3.5" /> Hadir
                                      </span>
                                    ) : (
                                      <span className="text-[11px] font-bold tracking-wider px-2.5 py-1 bg-slate-800/80 text-slate-400 rounded-md uppercase">
                                        Belum Presensi
                                      </span>
                                    )}
                                    <span className={`text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-md border uppercase ${
                                      computedStatusPertemuan === 'Selesai' 
                                        ? 'bg-slate-800/50 border-slate-700 text-slate-500' 
                                        : computedStatusPertemuan === 'Sedang Berlangsung' 
                                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                                          : 'bg-slate-800/50 border-slate-700 text-slate-400'
                                    }`}>
                                      {computedStatusPertemuan}
                                    </span>
                                  </div>
                                  <h3 className="text-xl font-bold text-white mb-3">{item.nama_matakuliah}</h3>
                                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-400">
                                    <span className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                      <Clock className="w-4 h-4 text-emerald-500" /> {item.jam_mulai} - {item.jam_selesai}
                                    </span>
                                    {item.ruang && (
                                      <span className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50 text-slate-300">
                                        📍 {item.ruang}
                                      </span>
                                    )}
                                  </div>
                                </div>
  
                                <div className="flex flex-row md:flex-col items-center justify-between md:items-end md:justify-center gap-4 border-t border-slate-800 md:border-t-0 pt-4 md:pt-0">
                                  <div className="flex flex-col items-start md:items-end">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Kode Presensi</p>
                                    <p className="font-mono text-xl font-bold text-slate-200 bg-slate-950/50 px-3 py-1 rounded-lg border border-slate-800">
                                      {item.kode && item.kode !== "-" ? item.kode : '---'}
                                    </p>
                                  </div>
                                  
                                  {!isDone && (
                                    <button
                                      onClick={() => handleManualAttendance(item.id_pertemuan_presensi, item.kode || '', item.nama_matakuliah)}
                                      disabled={actionLoading === item.id_pertemuan_presensi}
                                      className="group px-6 py-2.5 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-400 hover:to-emerald-400 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                                    >
                                      {actionLoading === item.id_pertemuan_presensi ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                      ) : (
                                        <>
                                          <span className="group-hover:-translate-y-0.5 transition-transform">🚀</span> Presensi
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
        
        {/* System Logs Column (Right - Takes 1 col) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 px-2">
            <Terminal className="w-6 h-6 text-slate-400" />
            Log Aktivitas
          </h2>
          
          <div className="glass-dark rounded-3xl p-6 h-[700px] flex flex-col border border-white/5 relative overflow-hidden">
            {/* Soft gradient background for log panel */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex-1 overflow-y-auto pr-3 custom-scrollbar">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-50">
                  <CircleDashed className="w-12 h-12 mb-4 text-slate-500" />
                  <p className="text-center text-sm font-medium">Belum ada log aktivitas hari ini.</p>
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
                          {/* Timeline vertical line */}
                          {!isLast && (
                            <div className="absolute left-2.5 top-8 bottom-[-16px] w-px bg-slate-800 group-hover:bg-slate-700 transition-colors" />
                          )}
                          
                          {/* Timeline dot */}
                          <div className="relative mt-1 z-10">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSuccess ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                              {isSuccess ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                              )}
                            </div>
                          </div>

                          {/* Log content */}
                          <div className="flex-1 pb-5 pt-1">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-500 mb-1">
                                {format(new Date(log.timestamp), 'dd MMM yyyy • HH:mm:ss', { locale: id })}
                              </span>
                              <p className="text-slate-200 font-bold text-sm leading-tight mb-1">{log.matkul}</p>
                              <p className={`text-xs font-medium leading-relaxed ${isSuccess ? 'text-emerald-400/90' : 'text-red-400/90'}`}>
                                {log.message} <span className="text-slate-500">(Kode: {log.kode})</span>
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

      {/* Rocket Animation Overlay */}
      <AnimatePresence>
        {showRocket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-md pointer-events-none"
          >
            <motion.div
              initial={{ y: 600, scale: 0.5, rotate: 45 }}
              animate={{ y: -1000, scale: 3, rotate: 45 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="text-[120px] drop-shadow-[0_0_50px_rgba(16,185,129,0.8)] filter"
            >
              🚀
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
