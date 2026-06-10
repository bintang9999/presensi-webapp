import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, RefreshCw, Activity, CheckCircle, CheckCircle2, ChevronDown, ChevronUp, PartyPopper, MapPin, Rocket } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import toast from 'react-hot-toast';
import api from '../api';
import { useNotifications } from '../contexts/NotificationContext';

const SkeletonCard = () => (
  <div className="w-full bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700/50"></div>
      <div className="h-5 w-48 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
    </div>
    <div className="space-y-4">
      {[1, 2].map(i => (
        <div key={i} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
          </div>
          <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
          <div className="h-8 w-full bg-slate-200 dark:bg-slate-700/50 rounded mt-2"></div>
        </div>
      ))}
    </div>
  </div>
);

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

const getScheduleStatus = (item: ScheduleItem): string => {
  let computedStatus = (item.status_pertemuan || '').split(':')[0].trim();
  if (!computedStatus && item.tanggal && item.jam_mulai && item.jam_selesai) {
    const now = new Date();
    const todayStrDate = format(now, 'yyyy-MM-dd');
    const itemDate = item.tanggal.split(' ')[0];
    if (itemDate === todayStrDate) {
      const currentTimeStr = format(now, 'HH:mm');
      if (currentTimeStr < item.jam_mulai) computedStatus = "Belum Dimulai";
      else if (currentTimeStr > item.jam_selesai) computedStatus = "Selesai";
      else computedStatus = "Sedang Berlangsung";
    } else if (new Date(itemDate) < now) {
      computedStatus = "Selesai";
    } else {
      computedStatus = "Belum Dimulai";
    }
  } else if (!computedStatus) {
     computedStatus = "Belum Dimulai";
  }
  return computedStatus;
};

const ScheduleCard = ({ item, computedStatusPertemuan, actionLoading, handleManualAttendance, isApproved }: { item: ScheduleItem, computedStatusPertemuan: string, actionLoading: string | null, handleManualAttendance: any, isApproved: boolean }) => {
  const isDone = item.status_presensi !== "0";
  
  return (
    <div
      className={`transition-all duration-300 ${
        isDone ? 'opacity-60 hover:opacity-100' : ''
      }`}
    >
      <div className="flex flex-col gap-4">
        {/* Top Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300 uppercase">
            PERTEMUAN {item.pertemuan_ke}
          </span>
          {isDone ? (
            <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md flex items-center gap-1 uppercase">
              <CheckCircle className="w-3 h-3" /> HADIR
            </span>
          ) : computedStatusPertemuan === 'Belum Dimulai' ? (
            <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 rounded-md uppercase">
              BELUM DIMULAI
            </span>
          ) : computedStatusPertemuan === 'Sedang Berlangsung' ? (
            <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md uppercase">
              SEDANG BERLANGSUNG
            </span>
          ) : (
            <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-md uppercase">
              BELUM PRESENSI
            </span>
          )}
        </div>

        {/* Title & Info */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white leading-tight mb-3">
            {item.nama_matakuliah}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900">
              <Clock className="w-3.5 h-3.5 text-emerald-500" /> {item.jam_mulai} - {item.jam_selesai}
            </span>
            {item.ruang && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900">
                <MapPin className="w-3.5 h-3.5 text-red-500" /> {item.ruang}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Action Row */}
        {isApproved && item.kode && item.kode !== "-" && (
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100 dark:border-white/5">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">KODE PRESENSI</p>
              <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50 min-w-[60px] flex items-center justify-center">
                <span className="font-mono text-sm font-bold text-slate-600 dark:text-slate-300 tracking-widest">
                  {item.kode}
                </span>
              </div>
            </div>
            
            {!isDone && (
              <button
                onClick={() => handleManualAttendance(item.id_pertemuan_presensi, item.kode || '', item.nama_matakuliah)}
                disabled={actionLoading === item.id_pertemuan_presensi}
                className="px-4 sm:px-6 py-2 sm:py-2.5 font-bold rounded-xl transition-all duration-300 active:scale-95 flex items-center gap-2 shadow-sm bg-blue-600 hover:bg-blue-700 text-white dark:bg-transparent dark:border dark:border-cyan-400 dark:text-cyan-400 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-300 dark:hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] dark:hover:border-cyan-300"
              >
                {actionLoading === item.id_pertemuan_presensi ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Rocket className="w-4 h-4" /> <span className="text-sm">Presensi</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ScheduleDateGroup = ({ date, items, groupIndex, actionLoading, handleManualAttendance, isApproved }: { date: string, items: ScheduleItem[], groupIndex: number, actionLoading: string | null, handleManualAttendance: any, isApproved: boolean }) => {
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(true);
  
  const grouped = useMemo(() => {
    const res = items.reduce((acc, item) => {
      const status = getScheduleStatus(item);
      const isDone = item.status_presensi !== "0";
      const isFinished = status === 'Selesai';
      
      if (isDone && isFinished) {
        acc.completed.push({ item, status });
      } else {
        acc.main.push({ item, status });
      }
      return acc;
    }, { main: [] as {item: ScheduleItem, status: string}[], completed: [] as {item: ScheduleItem, status: string}[] });

    res.main.sort((a, b) => {
      const priorityA = a.status === 'Sedang Berlangsung' ? 1 : a.status === 'Belum Dimulai' ? 2 : 3;
      const priorityB = b.status === 'Sedang Berlangsung' ? 1 : b.status === 'Belum Dimulai' ? 2 : 3;
      if (priorityA !== priorityB) return priorityA - priorityB;
      return (a.item.jam_mulai || '').localeCompare(b.item.jam_mulai || '');
    });

    return res;
  }, [items]);

  const dateObj = date !== 'Unknown Date' ? new Date(date) : new Date();
  
  const diffDays = date !== 'Unknown Date' ? Math.round((dateObj.setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24)) : 0;
  
  let themeConfig = {
    bg: 'bg-slate-50 dark:bg-slate-800/30',
    border: 'border-slate-200 dark:border-slate-700',
    textDate: 'text-slate-800 dark:text-slate-200',
    iconColor: 'text-slate-500',
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-slate-600 dark:text-slate-400',
    badgeBorder: 'border-slate-200 dark:border-slate-700',
    label: ''
  };

  if (diffDays === 0) {
    themeConfig = {
      bg: 'bg-blue-50/50 dark:bg-blue-500/5',
      border: 'border-blue-100 dark:border-blue-500/20',
      textDate: 'text-blue-700 dark:text-blue-400',
      iconColor: 'text-blue-500',
      badgeBg: 'bg-white dark:bg-blue-500/20',
      badgeText: 'text-blue-600 dark:text-blue-400',
      badgeBorder: 'border-blue-200 dark:border-blue-500/30',
      label: 'HARI INI'
    };
  } else if (diffDays === 1) {
    themeConfig = {
      bg: 'bg-emerald-50/50 dark:bg-emerald-500/5',
      border: 'border-emerald-100 dark:border-emerald-500/20',
      textDate: 'text-emerald-700 dark:text-emerald-400',
      iconColor: 'text-emerald-500',
      badgeBg: 'bg-white dark:bg-emerald-500/20',
      badgeText: 'text-emerald-600 dark:text-emerald-400',
      badgeBorder: 'border-emerald-200 dark:border-emerald-500/30',
      label: 'BESOK'
    };
  } else if (diffDays === 2) {
    themeConfig = {
      bg: 'bg-purple-50/50 dark:bg-purple-500/5',
      border: 'border-purple-100 dark:border-purple-500/20',
      textDate: 'text-purple-700 dark:text-purple-400',
      iconColor: 'text-purple-500',
      badgeBg: 'bg-white dark:bg-purple-500/20',
      badgeText: 'text-purple-600 dark:text-purple-400',
      badgeBorder: 'border-purple-200 dark:border-purple-500/30',
      label: 'LUSA'
    };
  }

  useEffect(() => {
    // Otomatis collapse jika: hari di masa lalu, hari terlalu jauh, atau SEMUA kelas di hari tersebut sudah selesai
    if (diffDays < 0 || diffDays > 2 || grouped.main.length === 0) {
      setIsGroupOpen(false);
    }
  }, [diffDays, grouped.main.length]);

  let rightText = "";
  if (grouped.main.length > 0) {
    rightText = `${grouped.main.length + grouped.completed.length} Mata Kuliah`;
  } else if (grouped.completed.length > 0) {
    rightText = `Selesai (${grouped.completed.length})`;
  }

  const firstMainClass = grouped.main.length > 0 ? grouped.main[0].item : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: groupIndex * 0.1 }}
      className="w-full bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
    >
      {/* Accordion Toggle Header */}
      <button 
        onClick={() => setIsGroupOpen(!isGroupOpen)}
        className={`group w-full flex flex-col px-4 sm:px-6 py-3.5 sm:py-5 transition-all hover:opacity-90 text-left ${themeConfig.bg} ${isGroupOpen ? 'border-b border-slate-100 dark:border-slate-800/50' : ''}`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:gap-4 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <Calendar className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${themeConfig.iconColor}`} />
              <h3 className={`font-bold text-[13px] sm:text-base whitespace-nowrap truncate ${themeConfig.textDate}`}>
                {date !== 'Unknown Date' ? format(dateObj, 'EEEE, dd MMM yyyy', { locale: id }) : 'Tanpa Tanggal'}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0">
              {themeConfig.label && (
                <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border shadow-sm ${themeConfig.badgeBg} ${themeConfig.badgeText} ${themeConfig.badgeBorder}`}>
                  {themeConfig.label}
                </span>
              )}
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {themeConfig.label && '•'} {rightText}
              </span>
            </div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200/50 dark:bg-slate-700/50 flex items-center justify-center shrink-0 group-hover:bg-slate-300/50 dark:group-hover:bg-slate-600/50 transition-colors ml-2">
            {isGroupOpen ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-300" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-300" />}
          </div>
        </div>

        {!isGroupOpen && firstMainClass && (
           <div className="mt-3 sm:ml-8 ml-6 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-semibold text-slate-600 dark:text-slate-300">{firstMainClass.jam_mulai}</span>
              <span className="truncate max-w-[200px] sm:max-w-xs">{firstMainClass.nama_matakuliah}</span>
           </div>
        )}
      </button>

      {/* Accordion Content */}
      <AnimatePresence>
        {isGroupOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5 flex flex-col gap-4">
              
              {grouped.main.map(({item, status}, idx) => (
                <div key={item.id_pertemuan_presensi} className={idx > 0 ? "pt-4 border-t border-slate-100 dark:border-slate-800/50" : ""}>
                  <ScheduleCard 
                    item={item} 
                    computedStatusPertemuan={status} 
                    actionLoading={actionLoading} 
                    handleManualAttendance={handleManualAttendance} 
                    isApproved={isApproved}
                  />
                </div>
              ))}

              {grouped.completed.length > 0 && grouped.main.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => setIsCompletedOpen(!isCompletedOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <span className="font-bold text-sm text-slate-600 dark:text-slate-400">
                      Selesai ({grouped.completed.length})
                    </span>
                    {isCompletedOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                </div>
              )}

              <AnimatePresence>
                {((isCompletedOpen && grouped.main.length > 0) || grouped.main.length === 0) && grouped.completed.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`flex flex-col gap-4 ${grouped.main.length > 0 ? 'pt-4 border-t border-slate-100 dark:border-slate-800/50' : ''}`}>
                      {grouped.completed.map(({item, status}, idx) => (
                        <div key={item.id_pertemuan_presensi} className={idx > 0 ? "pt-4 border-t border-slate-100 dark:border-slate-800/50" : ""}>
                          <ScheduleCard 
                            item={item} 
                            computedStatusPertemuan={status} 
                            actionLoading={actionLoading} 
                            handleManualAttendance={handleManualAttendance} 
                            isApproved={isApproved}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NextClassCard = ({ schedules, todayStr }: { schedules: ScheduleItem[], todayStr: string }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const todaysClasses = schedules.filter(sch => sch.tanggal === todayStr);
  
  const upcomingOrOngoingClasses = todaysClasses.filter(sch => {
    if (!sch.jam_selesai) return true;
    const [h, m] = sch.jam_selesai.split(':');
    const endTime = new Date();
    endTime.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
    return now.getTime() < endTime.getTime();
  });

  upcomingOrOngoingClasses.sort((a, b) => (a.jam_mulai || '').localeCompare(b.jam_mulai || ''));

  const nextClass = upcomingOrOngoingClasses[0];

  if (todaysClasses.length === 0) {
    return null;
  }

  if (!nextClass) {
    return (
      <div className="w-full bg-white dark:bg-slate-900 rounded-2xl px-4 py-3 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
             <CheckCircle2 className="w-4 h-4 text-emerald-500" />
           </div>
           <div>
             <h3 className="text-slate-800 dark:text-white font-bold text-sm">Semua kelas hari ini selesai</h3>
             <p className="text-[10px] text-slate-500 dark:text-slate-400">Sampai jumpa besok!</p>
           </div>
        </div>
        <PartyPopper className="w-6 h-6 text-yellow-500 opacity-80" />
      </div>
    );
  }

  let isOngoing = false;
  let statusText: React.ReactNode = '';
  let headerText = 'KELAS BERIKUTNYA';
  let progressPercentage = 0;

  if (nextClass.jam_mulai && nextClass.jam_selesai) {
    const [startH, startM] = nextClass.jam_mulai.split(':');
    const [endH, endM] = nextClass.jam_selesai.split(':');
    const startTime = new Date();
    startTime.setHours(parseInt(startH, 10), parseInt(startM, 10), 0, 0);
    
    const endTime = new Date();
    endTime.setHours(parseInt(endH, 10), parseInt(endM, 10), 0, 0);

    const diffStartMs = startTime.getTime() - now.getTime();
    const diffEndMs = endTime.getTime() - now.getTime();

    if (diffStartMs <= 0 && diffEndMs > 0) {
      isOngoing = true;
      headerText = 'SEDANG BERLANGSUNG';
      
      const totalDurationMs = endTime.getTime() - startTime.getTime();
      const elapsedMs = now.getTime() - startTime.getTime();
      progressPercentage = Math.round((elapsedMs / totalDurationMs) * 100);
      progressPercentage = Math.min(100, Math.max(0, progressPercentage));

      const diffHours = Math.floor(diffEndMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffEndMs % (1000 * 60 * 60)) / (1000 * 60));
      
      statusText = `Sisa ${diffHours > 0 ? diffHours + 'j ' : ''}${diffMinutes}m`;
    } else if (diffStartMs > 0) {
      const diffHours = Math.floor(diffStartMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffStartMs % (1000 * 60 * 60)) / (1000 * 60));
      
      statusText = `Mulai dalam ${diffHours > 0 ? diffHours + ' jam ' : ''}${diffMinutes} menit`;
    }
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-3 sm:gap-4">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${isOngoing ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'}`}>
        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${isOngoing ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
          {headerText}
        </span>
        <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
          <h3 className="text-slate-800 dark:text-white font-bold text-[13px] sm:text-lg leading-snug truncate">{nextClass.nama_matakuliah}</h3>
          {nextClass.ruang && (
            <span className="shrink-0 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {nextClass.ruang}
            </span>
          )}
        </div>
        
        {isOngoing ? (
          <div className="flex flex-col gap-1.5 sm:gap-2 w-full mt-0.5 sm:mt-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1 h-1.5 sm:h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-300">{progressPercentage}%</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-[10px] sm:text-xs font-medium">{statusText}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-1.5 text-blue-600 dark:text-blue-400 mt-0.5 sm:mt-1">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="text-[10px] sm:text-xs font-medium">{statusText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { notifications, addNotification } = useNotifications();
  const notificationsRef = useRef(notifications);
  
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [jadwalUjian, setJadwalUjian] = useState<UjianItem[]>([]);
  const schedulesRef = useRef<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isAutoActive, setIsAutoActive] = useState(true);
  const [showRocket, setShowRocket] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('--:--');
  const [isApproved, setIsApproved] = useState<boolean>(true);
  
  type PresensiStatus = 'unknown' | 'active' | 'unavailable/manual' | 'offline';
  const lastHealthStatusRef = useRef<PresensiStatus>(
    (sessionStorage.getItem('last_bot_status') as PresensiStatus) || 'unknown'
  );

  // Pull to refresh states
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setTouchStart(e.targetTouches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && touchStart > 0) {
      setTouchEnd(e.targetTouches[0].clientY);
      if (e.targetTouches[0].clientY - touchStart > 50) {
        setIsPulling(true);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isPulling && touchEnd - touchStart > 80) {
      if (navigator.vibrate) navigator.vibrate([20]);
      fetchData();
    }
    setIsPulling(false);
    setTouchStart(0);
    setTouchEnd(0);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [scheduleRes, statusRes, ujianRes, healthRes] = await Promise.all([
        api.get('/schedule'),
        api.get('/status'),
        api.get('/ujian').catch(() => ({ data: [] })),
        api.get('/health').catch(() => ({ data: { status: 'error' } }))
      ]);
      
      const healthStatus = healthRes.data?.status;
      const isAutoPresensi = statusRes.data?.is_active;
      
      let currentHealthState: PresensiStatus = 'offline';
      if (healthStatus === 'ok') {
        currentHealthState = isAutoPresensi ? 'active' : 'unavailable/manual';
      }

      if (currentHealthState !== lastHealthStatusRef.current) {
        const prev = lastHealthStatusRef.current;
        
        if (prev !== 'unknown') {
          if (currentHealthState === 'active') {
            if (prev === 'offline') {
              toast.success(
                <div>
                  <b className="block">Auto Presensi Aktif</b>
                  <span className="text-xs">Sistem kembali online. Presensi otomatis siap digunakan.</span>
                </div>, { duration: 4000 }
              );
            } else {
              toast.success(
                <div>
                  <b className="block">Auto Presensi Aktif</b>
                  <span className="text-xs">Presensi akan dilakukan otomatis saat kode tersedia.</span>
                </div>, { duration: 4000 }
              );
            }
          } else if (currentHealthState === 'unavailable/manual') {
            if (prev === 'active') {
              toast(
                <div>
                  <b className="block">Auto Presensi Tidak Tersedia</b>
                  <span className="text-xs">Silakan gunakan presensi manual untuk sementara.</span>
                </div>, { icon: '⚠️', duration: 5000 }
              );
            }
          } else if (currentHealthState === 'offline') {
            toast.error(
              <div>
                <b className="block">Auto Presensi Offline</b>
                <span className="text-xs">Silakan gunakan presensi manual sampai sistem kembali normal.</span>
              </div>, { duration: 5000 }
            );
          }
        }
        
        lastHealthStatusRef.current = currentHealthState;
        sessionStorage.setItem('last_bot_status', currentHealthState);
      }
      
      const newSchedules = scheduleRes.data as ScheduleItem[];
      
      let finalUjianData = [];
      const responseData = ujianRes.data;
      if (Array.isArray(responseData)) {
        finalUjianData = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        finalUjianData = responseData.data;
      } else if (responseData && typeof responseData.data === 'object' && responseData.data !== null) {
        finalUjianData = Object.values(responseData.data);
      } else if (responseData && typeof responseData === 'object' && responseData !== null) {
        finalUjianData = Object.values(responseData);
      }
      setJadwalUjian(Array.isArray(finalUjianData) ? finalUjianData : []);
      
      // Deteksi perubahan untuk notifikasi (hanya jika schedules sudah ada isinya sebelumnya)
      if (schedulesRef.current.length > 0) {
        newSchedules.forEach(newSch => {
          const oldSch = schedulesRef.current.find(s => s.id_pertemuan_presensi === newSch.id_pertemuan_presensi);
          // Jika tadinya kode "-" (belum buka) lalu berubah jadi ada kode (sudah buka)
          if (oldSch && (!oldSch.kode || oldSch.kode === "-") && (newSch.kode && newSch.kode !== "-")) {
              addNotification({
                title: 'Presensi Dibuka!',
                message: `Presensi untuk mata kuliah ${newSch.nama_matakuliah} telah dibuka.`,
                type: 'open'
              });
          }
          // Jika tadinya belum absen, lalu jadi sudah absen secara otomatis (bukan karena klik tombol manual saat loading)
          if (oldSch && oldSch.status_presensi === "0" && newSch.status_presensi !== "0" && actionLoading !== newSch.id_pertemuan_presensi) {
            toast.success(
              <div>
                <b className="block">Presensi Berhasil</b>
                <span className="text-xs">Kode berhasil dikirim ke sistem untuk {newSch.nama_matakuliah}.</span>
              </div>,
              { duration: 5000 }
            );
          }
        });
      }
      
      // Deteksi kelas Elearning (baik saat awal buka maupun jika ada perubahan)
      try {
        const todayStr = new Date().toISOString().split('T')[0]; // Reset notifikasi setiap hari
        const storageKey = `notified_elearning_${todayStr}`;
        const notifiedElearning = JSON.parse(localStorage.getItem(storageKey) || '[]');
        let newlyNotified = false;
        
        newSchedules.forEach(sch => {
          const ruangLower = sch.ruang?.toLowerCase() || '';
          const isElearning = ruangLower.includes('elearning') || ruangLower.includes('e-learning') || ruangLower.includes('daring') || ruangLower.includes('online');
          
          if (isElearning && !notifiedElearning.includes(sch.nama_matakuliah)) {
            let hari = "";
            if (sch.tanggal) {
              const dateObj = new Date(sch.tanggal.split(' ')[0]);
              const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
              hari = days[dateObj.getDay()];
            }
            const notifMessage = `Kelas ${sch.nama_matakuliah}${hari ? ` pada hari ${hari}` : ''} diadakan secara Elearning.`;
            const notifTitle = 'Perhatian: Kelas Elearning!';

            const alreadyExists = notificationsRef.current.some(n => 
              n.title === notifTitle && 
              n.message === notifMessage && 
              new Date(n.time).toISOString().split('T')[0] === todayStr
            );

            if (!alreadyExists) {
              addNotification({
                title: notifTitle,
                message: notifMessage,
                type: 'upcoming',
                silent: true
              });
            }
            notifiedElearning.push(sch.nama_matakuliah);
            newlyNotified = true;
          }
        });
        
        if (newlyNotified) {
          localStorage.setItem(storageKey, JSON.stringify(notifiedElearning));
        }
      } catch (e) {
        console.error("Error processing elearning notifications", e);
      }
      
      setSchedules(newSchedules);
      schedulesRef.current = newSchedules;
      setIsAutoActive(statusRes.data.is_active);
      if (statusRes.data.nama) {
        setUserName(statusRes.data.nama);
      }
      setIsApproved(statusRes.data.is_approved ?? true);
      setLastUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Dynamic interval logic
  useEffect(() => {
    const checkOngoing = () => {
      const now = new Date();
      const todayStr = format(now, 'yyyy-MM-dd');
      const currentTimeStr = format(now, 'HH:mm');

      return schedules.some(sch => {
        if (!sch.tanggal || !sch.jam_mulai || !sch.jam_selesai) return false;
        const itemDate = sch.tanggal.split(' ')[0];
        if (itemDate !== todayStr) return false;
        return currentTimeStr >= sch.jam_mulai && currentTimeStr <= sch.jam_selesai;
      });
    };

    const isOngoing = checkOngoing();
    const intervalMs = isOngoing ? 30000 : 1800000; // 30s if ongoing, else 30m

    const interval = setInterval(() => {
      fetchData();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [schedules]); // Reset interval when schedules update

  // Pantau 5 menit sebelum kelas dimulai
  useEffect(() => {
    const checkUpcomingClasses = () => {
      const now = new Date();
      schedules.forEach(sch => {
        if (!sch.tanggal || !sch.jam_mulai) return;
        if (sch.status_presensi !== "0") return; // Sudah absen
        
        const startTimeStr = `${sch.tanggal}T${sch.jam_mulai}`;
        const startTime = new Date(startTimeStr);
        const diffMs = startTime.getTime() - now.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        
        // Kasih notif tepat saat sisa 5 menit, gunakan localStorage utk track agar tidak spam
        if (diffMinutes === 5 || diffMinutes === 4) {
          const notifiedKey = `notified_5m_${sch.id_pertemuan_presensi}`;
          if (!localStorage.getItem(notifiedKey)) {
            addNotification({
              title: 'Kelas Segera Dimulai',
              message: `5 menit lagi kelas ${sch.nama_matakuliah} akan dimulai.`,
              type: 'upcoming',
              silent: true
            });
            try {
              localStorage.setItem(notifiedKey, 'true');
            } catch (e) {
              console.warn('Gagal menyimpan status notif di localStorage:', e);
            }
          }
        }
      });
    };

    // Check once immediately then every 30s
    checkUpcomingClasses();
    const interval = setInterval(checkUpcomingClasses, 30000);
    return () => clearInterval(interval);
  }, [schedules, addNotification]);

  const handleManualAttendance = async (id: string, kode: string, matkul: string) => {
    if (!kode || kode === '-') {
      toast.error('Kode presensi belum tersedia dari dosen. Silakan refresh nanti!');
      return;
    }
    if (navigator.vibrate) navigator.vibrate([20]);
    setActionLoading(id);
    try {
      await api.post(`/attendance/${id}?kode=${kode}&matkul=${encodeURIComponent(matkul)}`);
      
      if (navigator.vibrate) navigator.vibrate([20, 100, 20]);
      toast.success('Presensi berhasil dikirim!');
      
      // Trigger rocket animation on success
      setShowRocket(true);
      setTimeout(() => setShowRocket(false), 3500);
      
      // Refresh data
      fetchData();
    } catch (err: any) {
      if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
      toast.error(err.response?.data?.detail || 'Gagal mengirim presensi.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAuto = async () => {
    try {
      const res = await api.post('/toggle-auto');
      const newActiveStatus = res.data.is_active;
      setIsAutoActive(newActiveStatus);
      if (navigator.vibrate) navigator.vibrate([20]);
      
      if (newActiveStatus) {
         toast.success(
            <div>
              <b className="block">Auto Presensi Aktif</b>
              <span className="text-xs">Presensi akan dilakukan otomatis saat kode tersedia.</span>
            </div>,
            { duration: 4000 }
          );
      } else {
         toast(
            <div>
              <b className="block">Mode Manual Aktif</b>
              <span className="text-xs">Presensi otomatis dimatikan. Silakan presensi manual.</span>
            </div>,
            { icon: 'ℹ️', duration: 4000 }
          );
      }
      
      const newState = newActiveStatus ? 'active' : 'unavailable/manual';
      lastHealthStatusRef.current = newState;
      sessionStorage.setItem('last_bot_status', newState);
    } catch (err) {
      toast.error('Gagal mengubah status auto-monitoring');
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
  if (currentHour < 11) greeting = "Selamat Pagi";
  else if (currentHour < 15) greeting = "Selamat Siang";
  else if (currentHour < 18) greeting = "Selamat Sore";
  
  const firstName = userName ? userName.split(' ')[0] : '';

  return (
    <div 
      className="min-h-screen p-4 md:p-8 bg-transparent"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-4xl mx-auto space-y-6">

          
        {/* Compact Welcome Banner & Next Class */}
        <div className="flex flex-col gap-4">
          <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 relative overflow-hidden shadow-sm">
            {/* Background Graphic (CSS Moon & Clouds) */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-1/3 overflow-hidden flex items-center justify-end pointer-events-none">
              <div className="absolute right-[-10%] top-[-20%] w-48 h-48 sm:w-64 sm:h-64 bg-blue-50 dark:bg-blue-500/10 rounded-full" />
              <div className="absolute right-[20%] bottom-[-20%] w-24 h-24 sm:w-32 sm:h-32 bg-blue-100/50 dark:bg-blue-500/20 rounded-full" />
              <div className="absolute right-[40%] top-10 w-16 h-16 sm:w-24 sm:h-24 bg-blue-50 dark:bg-blue-500/20 rounded-full" />
              <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 mr-4 sm:mr-10 mb-2 sm:mb-6 rounded-full flex items-center justify-center">
                 <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
                   <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-300 dark:bg-yellow-500 rounded-full shadow-[inset_-4px_-4px_0_0_rgba(0,0,0,0.05)]" />
                 </div>
              </div>
            </div>

            <div className="relative z-10 md:w-2/3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white flex flex-wrap items-center gap-2 mb-4">
                {greeting}{firstName ? `, ${firstName}` : ''}
              </h2>
              
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span>{totalClassesToday} Kelas Hari Ini</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  {attendedClassesToday} Sudah Presensi 
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              
              {totalClassesToday > 0 && (
                <div className="mt-4 w-full sm:max-w-xs h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(attendedClassesToday / totalClassesToday) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              )}
            </div>
          </div>

          {loading && schedules.length === 0 && jadwalUjian.length === 0 ? (
            <div className="w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-3 sm:gap-4 animate-pulse">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 dark:bg-slate-700/50 shrink-0"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
                <div className="h-5 w-48 sm:w-64 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
                <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700/50 rounded mt-2"></div>
              </div>
            </div>
          ) : (
            <NextClassCard schedules={schedules} todayStr={todayStr} />
          )}
        </div>

        {/* Schedule Section */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-4 px-2 w-full">
            <h2 className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 sm:gap-2 truncate">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400 shrink-0" />
              <span className="truncate">Jadwal Perkuliahan</span>
            </h2>
            <div className="flex items-center gap-2 sm:gap-3 bg-white/50 dark:bg-slate-900/50 px-2 sm:px-4 py-1 sm:py-1.5 rounded-full border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none shrink-0">
              {isApproved && (
                <>
                  <button 
                    onClick={handleToggleAuto}
                    className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  >
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isAutoActive ? 'bg-emerald-500 dark:bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-400 dark:bg-slate-500'}`} />
                    <span className={`text-[8px] sm:text-[10px] font-bold tracking-wider ${isAutoActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                      {isAutoActive ? 'AUTO PRESENSI' : 'MANUAL PRESENSI'}
                    </span>
                  </button>
                  <div className="w-px h-3 sm:h-4 bg-slate-300 dark:bg-white/10" />
                </>
              )}
              <button 
                onClick={fetchData} 
                disabled={loading}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-50"
              >
                <span className="text-[10px] hidden sm:block">Terakhir update {lastUpdated}</span>
                <RefreshCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${loading ? 'animate-spin text-emerald-500 dark:text-emerald-400' : ''}`} />
              </button>
            </div>
          </div>

            {loading && schedules.length === 0 && jadwalUjian.length === 0 ? (
              <div className="space-y-5">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : schedules.length > 0 ? (
              <div className="space-y-5">
                <AnimatePresence>
                  {Object.entries(groupedSchedules).sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()).map(([date, items], groupIndex) => (
                    <ScheduleDateGroup 
                      key={date} 
                      date={date} 
                      items={items} 
                      groupIndex={groupIndex} 
                      actionLoading={actionLoading} 
                      handleManualAttendance={handleManualAttendance} 
                      isApproved={isApproved}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : jadwalUjian.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2 mb-6">
                  <div className="px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20">
                    <h3 className="font-bold text-orange-600 dark:text-orange-400 text-sm flex items-center gap-2">
                      Jadwal Ujian Akan Datang
                    </h3>
                  </div>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                </div>
                
                <AnimatePresence>
                  {jadwalUjian.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-dark rounded-3xl p-6 border-l-4 border-l-orange-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-white/90 dark:hover:bg-slate-900/60 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 text-xs font-semibold mb-3">
                          <span className="px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 uppercase border border-orange-200 dark:border-orange-500/30">
                            UJIAN
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{item.nama_matakuliah}</h3>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                          {item.tanggal && (
                            <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50">
                              <Calendar className="w-4 h-4 text-emerald-500" /> {item.tanggal}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50">
                            <Clock className="w-4 h-4 text-emerald-500" /> {item.jam_awal} - {item.jam_akhir}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:w-auto bg-slate-50 dark:bg-slate-950/50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none border md:border-none border-slate-200 dark:border-slate-800/50">
                        {item.ruang && (
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Ruang</span>
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{item.ruang}</span>
                          </div>
                        )}
                        {item.no_kursi && (
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Kursi</span>
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{item.no_kursi}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="glass-dark rounded-3xl p-16 text-center border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <span className="text-4xl">🎉</span>
                </div>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Tidak ada jadwal akademik hari ini</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">Tidak ada perkuliahan maupun ujian yang perlu diikuti. Selamat istirahat!</p>
              </div>
            )}
          </div>
        </div>

      {/* Rocket Animation Overlay */}
      <AnimatePresence>
        {showRocket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-slate-950/60 backdrop-blur-md pointer-events-none"
          >
            <motion.div
              initial={{ y: 600, scale: 0.5, rotate: -45 }}
              animate={{ y: -1000, scale: 3, rotate: -45 }}
              transition={{ duration: 3.0, ease: "easeInOut" }}
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
