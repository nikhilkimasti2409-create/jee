import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  Flame, 
  CheckCircle2, 
  Circle, 
  BookOpen,
  Activity
} from 'lucide-react';
import clsx from 'clsx';
import { api } from '../services/api';
import { useParent } from '../context/ParentContext';

export default function Dashboard() {
  const [status, setStatus] = useState<any>(null);
  const { selectedStudent } = useParent();

  useEffect(() => {
    if (!selectedStudent) {
       setStatus(null);
       return;
    }
    // Fetch live status
    api.getLiveStatus(selectedStudent).then(setStatus).catch(console.error);
    
    // Auto refresh every 30s
    const interval = setInterval(() => {
      api.getLiveStatus(selectedStudent).then(setStatus).catch(console.error);
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedStudent]);

  return (
    <>
      {/* ROW 1: 4 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="glass-card p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <h3 className="text-slate-500 text-sm font-label mb-2">Today's Study Time</h3>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-headline font-bold text-slate-800 tracking-tight">
              {status?.dailyMetrics?.totalTime || '4h 32m'}
            </span>
            <span className="flex items-center text-emerald-600 text-sm font-semibold mb-1 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              On track
            </span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-[38%]" />
          </div>
        </div>

        <div className="glass-card p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <h3 className="text-slate-500 text-sm font-label mb-2">Current Streak</h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-headline font-bold text-slate-800 tracking-tight">15 Days</span>
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <Flame className="w-5 h-5 fill-current" />
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500 font-label">Best streak: 21 days</p>
        </div>

        <div className="glass-card p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <h3 className="text-slate-500 text-sm font-label mb-2">Tasks Completed</h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-headline font-bold text-slate-800 tracking-tight">7/10</span>
            <span className="text-slate-400 text-sm font-medium mb-1">70%</span>
          </div>
          <div className="mt-4 flex gap-1">
            {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-1.5 flex-1 bg-sky-500 rounded-full" />)}
            {[1,2,3].map(i => <div key={i} className="h-1.5 flex-1 bg-slate-100 rounded-full" />)}
          </div>
        </div>

        <div className="glass-card p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-500 text-sm font-label">Live Status</h3>
            <span className={clsx("flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wider", status?.isStudying ? "text-emerald-600 bg-emerald-50" : "text-slate-500 bg-slate-100")}>
              <span className={clsx("w-1.5 h-1.5 rounded-full", status?.isStudying ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
              {status?.isStudying ? 'Active' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="font-headline font-bold text-lg text-slate-800 truncate" title={status?.currentSubject || 'Not Studying'}>
                {status?.currentSubject || 'Not Studying'}
              </p>
              <p className="text-xs text-slate-500 font-label">{status?.url || 'No active study site'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Subject Breakdown & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline font-semibold text-lg text-slate-800">Subject Breakdown</h2>
            <button className="text-sm font-label text-primary hover:text-indigo-700 transition-colors font-medium">Detailed View</button>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {(!status?.physicsTime && !status?.chemTime && !status?.mathsTime) ? (
               <div className="h-12 w-full rounded-xl overflow-hidden flex shadow-inner border border-slate-100 bg-slate-100 items-center justify-center text-sm text-slate-400">
                 No study data today
               </div>
            ) : (() => {
               const pt = status.physicsTime || 0;
               const ct = status.chemTime || 0;
               const mt = status.mathsTime || 0;
               const total = pt + ct + mt;
               const pPct = total ? (pt / total) * 100 : 0;
               const cPct = total ? (ct / total) * 100 : 0;
               const mPct = total ? (mt / total) * 100 : 0;
               
               return (
                  <div className="h-12 w-full rounded-xl overflow-hidden flex shadow-inner border border-slate-100">
                    {pPct > 0 && <div className="bg-primary hover:brightness-110 transition-all flex items-center justify-center text-white text-xs font-bold" style={{ width: `${pPct}%` }}>{Math.round(pPct)}%</div>}
                    {cPct > 0 && <div className="bg-purple-500 hover:brightness-110 transition-all flex items-center justify-center text-white text-xs font-bold" style={{ width: `${cPct}%` }}>{Math.round(cPct)}%</div>}
                    {mPct > 0 && <div className="bg-amber-400 hover:brightness-110 transition-all flex items-center justify-center text-white text-xs font-bold text-amber-950" style={{ width: `${mPct}%` }}>{Math.round(mPct)}%</div>}
                  </div>
               );
            })()}
            
            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm font-medium text-slate-700">Physics ({status?.physicsTime ? Math.round(status.physicsTime/(1000*60)) : 0}m)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm font-medium text-slate-700">Chemistry ({status?.chemTime ? Math.round(status.chemTime/(1000*60)) : 0}m)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-sm font-medium text-slate-700">Maths ({status?.mathsTime ? Math.round(status.mathsTime/(1000*60)) : 0}m)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col">
          <h2 className="font-headline font-semibold text-lg text-slate-800 mb-4">Today's Missions</h2>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {!status?.tasks?.length ? (
              <p className="text-sm text-slate-400 italic">No tasks set for today.</p>
            ) : (
              status.tasks.map((task: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors group cursor-default">
                  {task.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                  )}
                  <span className={clsx("text-sm font-medium leading-relaxed", task.done ? "text-slate-400 line-through" : "text-slate-700")}>
                    {task.title || task.text || JSON.stringify(task)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ROW 3: Trend & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass-card p-6 h-80 flex flex-col">
          <h2 className="font-headline font-semibold text-lg text-slate-800 mb-6">Weekly Study Trend</h2>
          <div className="flex-1 w-full flex items-end justify-between gap-2 px-2">
            {(() => {
              const hist = status?.history || {};
              const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const chartData = [];
              for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toLocaleDateString();
                const dayStr = days[d.getDay()];
                const dayData = hist[dateStr];
                const ms = dayData?.time || 0;
                const hours = ms / (1000 * 60 * 60);
                chartData.push({ day: dayStr, h: Math.min((hours / 12) * 100, 100), val: hours.toFixed(1) + 'h', active: i === 0 });
              }
              return chartData.map((d, i) => (
                <div key={i} className="flex flex-col items-center flex-1 group">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-slate-600 mb-2">{d.val}</span>
                  <div className="w-full max-w-[40px] bg-slate-100 rounded-t-lg relative overflow-hidden" style={{ height: '160px' }}>
                    <div 
                      className={clsx("absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-500", d.active ? "bg-primary" : "bg-sky-400/60 group-hover:bg-sky-400")} 
                      style={{ height: `${Math.max(d.h, 2)}%` }} 
                    />
                  </div>
                  <span className={clsx("text-xs font-medium mt-3", d.active ? "text-primary font-bold" : "text-slate-500")}>{d.day}</span>
                </div>
              ));
            })()}
          </div>
        </div>

        <div className="glass-card p-6 h-80 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline font-semibold text-lg text-slate-800">Recent Activity</h2>
            <button className="text-slate-400 hover:text-slate-600"><Activity className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-5 pr-2">
            {!status?.screenTime || Object.keys(status.screenTime).length === 0 ? (
              <p className="text-sm text-slate-400 italic">No activity recorded today.</p>
            ) : (
              Object.entries(status.screenTime).slice(0, 5).map(([site, data]: [string, any], idx) => {
                const isStudy = data?.category === 'Study' || data?.category === 'Maths' || data?.category === 'Physics';
                const timeStr = Math.round((data?.time || 0) / 60000) + 'm';
                return (
                  <div key={idx} className="flex gap-4 relative">
                    <div className="absolute left-[11px] top-6 bottom-[-20px] w-0.5 bg-slate-100" />
                    <div className={clsx("w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shrink-0 z-10", isStudy ? "bg-emerald-100" : "bg-sky-100")}>
                      {isStudy ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Activity className="w-3 h-3 text-sky-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{site}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Duration: {timeStr} • {data?.category || 'General'}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
