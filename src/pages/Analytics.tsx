import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CalendarDays, TrendingUp, Clock, Target } from 'lucide-react';
import clsx from 'clsx';
import { useParent } from '../context/ParentContext';

export default function Analytics() {
  const [history, setHistory] = useState<any[]>([]);
  const { selectedStudent } = useParent();

  useEffect(() => {
    if (!selectedStudent) {
       setHistory([]);
       return;
    }
    api.getHistory(selectedStudent).then(setHistory).catch(console.error);
  }, [selectedStudent]);

  // Compute stats
  const totalMs = history.reduce((acc, curr) => acc + curr.totalTimeMs, 0);
  const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
  const totalMins = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  
  const dailyAvgHours = history.length ? Math.floor(totalHours / history.length) : 0;
  const longestStreak = history.reduce((max, curr) => Math.max(max, curr.streak), 0);
  const consistencyScore = history.length ? Math.round((history.filter(d => d.totalTimeMs > 0).length / history.length) * 100) : 0;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="font-headline font-bold text-2xl text-slate-800">Analytics & Insights</h2>
        <div className="bg-white/60 p-1 rounded-lg border border-slate-200 flex gap-1 shadow-sm">
          {['All Time'].map((range, i) => (
            <button 
              key={range} 
              className={clsx("px-4 py-1.5 text-sm font-medium rounded-md transition-colors", i === 0 ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-100")}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Hours', val: `${totalHours}h ${totalMins}m`, icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Daily Average', val: `${dailyAvgHours}h`, icon: TrendingUp, color: 'text-sky-500', bg: 'bg-sky-50' },
          { label: 'Longest Streak', val: `${longestStreak} Days`, icon: CalendarDays, color: 'text-rose-500', bg: 'bg-rose-50' },
          { label: 'Consistency Score', val: `${consistencyScore}%`, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5 flex items-center gap-4">
            <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-label text-slate-500">{stat.label}</p>
              <p className="font-headline font-bold text-xl text-slate-800">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
        {/* Main Chart Area */}
        <div className="glass-card p-6 lg:col-span-2 flex flex-col">
          <h3 className="font-headline font-semibold text-lg text-slate-800 mb-6">Study Intensity Map</h3>
          
          <div className="flex-1 flex items-end justify-between gap-1 px-4 py-2 border-b border-slate-100 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 z-0 opacity-20">
              {[1,2,3,4].map(i => <div key={i} className="w-full border-b border-dashed border-slate-400 h-0" />)}
            </div>

            {history.slice(0, 30).reverse().map((day, i) => {
              const h = Math.min((day.totalTimeMs / (12 * 60 * 60 * 1000)) * 100, 100) || 5;
              const hrs = (day.totalTimeMs / (1000*60*60)).toFixed(1);
              return (
                <div key={i} className="w-full max-w-[16px] flex flex-col items-center group z-10">
                  <div className="w-full rounded-t-sm bg-indigo-500/20 group-hover:bg-indigo-500/80 transition-all cursor-pointer relative" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                      {hrs}h
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-label mt-3 px-4">
            <span>Older</span>
            <span>Recent</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="font-headline font-semibold text-lg text-slate-800 mb-6">Subject Totals</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {(() => {
               const pTotal = history.reduce((a, c) => a + c.physicsTime, 0);
               const cTotal = history.reduce((a, c) => a + c.chemTime, 0);
               const mTotal = history.reduce((a, c) => a + c.mathsTime, 0);
               const subTotal = pTotal + cTotal + mTotal;
               if (!subTotal) return <p className="text-slate-400 italic text-sm">No subject data</p>;
               
               return [
                 { site: 'Physics', cat: 'Subject', ms: pTotal, pct: (pTotal/subTotal)*100, color: 'bg-primary' },
                 { site: 'Chemistry', cat: 'Subject', ms: cTotal, pct: (cTotal/subTotal)*100, color: 'bg-purple-500' },
                 { site: 'Maths', cat: 'Subject', ms: mTotal, pct: (mTotal/subTotal)*100, color: 'bg-amber-400' },
               ].map((d, i) => (
                 <div key={i}>
                  <div className="flex justify-between items-end mb-1">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{d.site}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-600">{Math.round(d.ms / 3600000)}h {Math.round((d.ms % 3600000)/60000)}m</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`${d.color} rounded-full h-2`} style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
               ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
