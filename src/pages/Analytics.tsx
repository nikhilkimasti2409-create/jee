import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useParent } from '../context/ParentContext';
import {
  CalendarDays,
  Clock,
  Target,
  TrendingUp,
  Play,
  GraduationCap,
  MessageCircle,
  Sparkles,
  Clapperboard,
  Globe
} from 'lucide-react';
import clsx from 'clsx';

const PLATFORM_META: Record<string, { icon: any; bar: string; text: string; bg: string }> = {
  'YouTube': { icon: Play, bar: 'bg-red-500', text: 'text-red-500', bg: 'bg-red-50' },
  'Physics Wallah': { icon: GraduationCap, bar: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-50' },
  'Instagram': { icon: MessageCircle, bar: 'bg-pink-500', text: 'text-pink-500', bg: 'bg-pink-50' },
  'Gemini AI': { icon: Sparkles, bar: 'bg-cyan-500', text: 'text-cyan-500', bg: 'bg-cyan-50' },
  'Movies/Series': { icon: Clapperboard, bar: 'bg-purple-500', text: 'text-purple-500', bg: 'bg-purple-50' },
  'Other': { icon: Globe, bar: 'bg-slate-500', text: 'text-slate-500', bg: 'bg-slate-50' },
};

const getPlatform = (url: string): string => {
  const u = url.toLowerCase();
  if (u.includes('youtube.com')) return 'YouTube';
  if (u.includes('pw.live')) return 'Physics Wallah';
  if (u.includes('instagram.com')) return 'Instagram';
  if (u.includes('gemini.google')) return 'Gemini AI';
  if (u.includes('netmirror') || u.includes('tmovies') || u.includes('cineby')) return 'Movies/Series';
  return 'Other';
};

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

export default function Analytics() {
  const [activeMode, setActiveMode] = useState<'weekly' | 'monthly'>('weekly');
  const [status, setStatus] = useState<any>(null);
  const { selectedStudent } = useParent();

  useEffect(() => {
    if (!selectedStudent) {
       setStatus(null);
       return;
    }
    api.getLiveStatus(selectedStudent).then(setStatus).catch(console.error);
  }, [selectedStudent]);

  if (!status) return <div className="h-full flex items-center justify-center text-slate-400">Loading...</div>;

  const history = status.history || {};
  const appUsageData = status.screenTime || {};
  const today = new Date();

  // ----- Weekly Data -----
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toLocaleDateString();
    const record = history[dateStr];
    
    let totalTime = 0, physics = 0, chemistry = 0, maths = 0;
    if (i === 0) { // Today (pull from live status if possible, otherwise history)
      physics = status.physicsTime || 0;
      chemistry = status.chemTime || 0;
      maths = status.mathsTime || 0;
      totalTime = physics + chemistry + maths;
    } else if (record) {
      totalTime = typeof record === 'number' ? record : record.time || 0;
      physics = record.subjects?.Physics || 0;
      chemistry = record.subjects?.Chemistry || 0;
      maths = record.subjects?.Maths || 0;
    }
    weeklyData.push({ date: dateStr, dayName: d.toLocaleDateString('en-US', { weekday: 'short' }), totalTime, physics, chemistry, maths, isToday: i === 0 });
  }

  // ----- Monthly Data -----
  const monthlyData = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toLocaleDateString();
    const record = history[dateStr];
    let totalTime = 0;
    if (i === 0) {
      totalTime = (status.physicsTime || 0) + (status.chemTime || 0) + (status.mathsTime || 0);
    } else if (record) {
      totalTime = typeof record === 'number' ? record : record.time || 0;
    }
    monthlyData.push({ date: dateStr, dayOfMonth: d.getDate(), monthLabel: d.toLocaleDateString('en-US', { month: 'short' }), totalTime });
  }

  // ----- App Usage (Last 7 Days) -----
  const weekPlatformTotals: Record<string, number> = { 'YouTube': 0, 'Physics Wallah': 0, 'Instagram': 0, 'Gemini AI': 0, 'Movies/Series': 0, 'Other': 0 };
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayUsage = appUsageData[d.toLocaleDateString()] || {};
    Object.values(dayUsage).forEach((item: any) => {
      weekPlatformTotals[getPlatform(item.url || '')] += item.time || 0;
    });
  }

  // Stats
  const weekTotal = weeklyData.reduce((a, d) => a + d.totalTime, 0);
  const weekPhysics = weeklyData.reduce((a, d) => a + d.physics, 0);
  const weekChemistry = weeklyData.reduce((a, d) => a + d.chemistry, 0);
  const weekMaths = weeklyData.reduce((a, d) => a + d.maths, 0);
  const activeDays = weeklyData.filter(d => d.totalTime > 0).length;
  
  const monthTotal = monthlyData.reduce((a, d) => a + d.totalTime, 0);
  const monthActiveDays = monthlyData.filter(d => d.totalTime > 0).length;

  const currentTotal = activeMode === 'weekly' ? weekTotal : monthTotal;
  const currentActive = activeMode === 'weekly' ? activeDays : monthActiveDays;
  const currentAvgHours = currentActive > 0 ? (currentTotal / currentActive / 3600000).toFixed(1) : '0';

  // Calendar Heatmap Config
  const parseDate = (s: string) => { const [dd, mm, yyyy] = s.split('/').map(Number); return new Date(yyyy, mm - 1, dd); };
  const firstMonthDate = parseDate(monthlyData[0].date);
  const startCol = firstMonthDate.getDay();
  const cells = [];
  for (let i = 0; i < 35; i++) {
    const idx = i - startCol;
    cells.push(idx >= 0 && idx < monthlyData.length ? monthlyData[idx] : null);
  }

  return (
    <div className="space-y-6 h-full flex flex-col pb-8">
      <div className="flex items-center justify-between">
        <h2 className="font-headline font-bold text-2xl text-slate-800">Analytics & Insights</h2>
        <div className="bg-white/60 p-1 rounded-lg border border-slate-200 flex gap-1 shadow-sm">
          {(['weekly', 'monthly'] as const).map(mode => (
            <button 
              key={mode} 
              onClick={() => setActiveMode(mode)}
              className={clsx("px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize", activeMode === mode ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-100")}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Time', val: `${Math.floor(currentTotal / 3600000)}h ${Math.floor((currentTotal % 3600000) / 60000)}m`, icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Daily Average', val: `${currentAvgHours}h / day`, icon: TrendingUp, color: 'text-sky-500', bg: 'bg-sky-50' },
          { label: 'Active Days', val: `${currentActive} / ${activeMode === 'weekly' ? 7 : 30}`, icon: CalendarDays, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Current Streak', val: `${status.streak} Days`, icon: Target, color: 'text-rose-500', bg: 'bg-rose-50' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2 flex flex-col min-h-[400px]">
          <h3 className="font-headline font-semibold text-lg text-slate-800 mb-6">
            {activeMode === 'weekly' ? '7-Day Activity Trend' : '30-Day Heatmap'}
          </h3>
          
          {activeMode === 'weekly' ? (
            <div className="flex-1 flex items-end justify-between gap-2 px-2 mt-4 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 z-0 opacity-20">
                {[1,2,3,4].map(i => <div key={i} className="w-full border-b border-dashed border-slate-400 h-0" />)}
              </div>
              {weeklyData.map((d, i) => {
                const h = Math.max(Math.min((d.totalTime / TWELVE_HOURS) * 100, 100), 2);
                const hrs = (d.totalTime / 3600000).toFixed(1);
                return (
                  <div key={i} className="flex flex-col items-center flex-1 group z-10">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-slate-600 mb-2">{hrs}h</span>
                    <div className="w-full max-w-[40px] bg-slate-100 rounded-t-lg relative overflow-hidden" style={{ height: '240px' }}>
                      <div className={clsx("absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-500", d.isToday ? "bg-primary" : "bg-sky-400/60 group-hover:bg-sky-400")} style={{ height: `${h}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{d.dayName}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2 h-full">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-2">{d}</div>
              ))}
              {cells.map((day, i) => {
                if (!day) return <div key={i} className="rounded-xl bg-slate-50/50 border border-slate-100/50" />;
                const active = day.totalTime > 0;
                const pct = active ? Math.min((day.totalTime / TWELVE_HOURS) * 100, 100) : 0;
                let bgCls = "bg-slate-100 text-slate-400";
                if (pct > 75) bgCls = "bg-emerald-500 text-white font-bold";
                else if (pct > 40) bgCls = "bg-emerald-400/80 text-white font-bold";
                else if (pct > 0) bgCls = "bg-emerald-300/50 text-emerald-900";
                
                return (
                  <div key={i} className={clsx("rounded-xl border border-slate-100 p-2 flex flex-col items-center justify-center relative group cursor-pointer transition-colors", bgCls)}>
                    <span className="text-xs z-10">{day.dayOfMonth}</span>
                    {active && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 shadow-lg">
                        {(day.totalTime / 3600000).toFixed(1)}h
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="glass-card p-6 flex flex-col space-y-6">
          {/* Subjects */}
          <div>
            <h3 className="font-headline font-semibold text-lg text-slate-800 mb-4">Subject Focus (7 Days)</h3>
            <div className="space-y-4">
              {[
                { site: 'Physics', ms: weekPhysics, color: 'bg-primary' },
                { site: 'Chemistry', ms: weekChemistry, color: 'bg-purple-500' },
                { site: 'Maths', ms: weekMaths, color: 'bg-amber-400' },
              ].map((d, i) => {
                const pct = weekTotal ? (d.ms / weekTotal) * 100 : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between items-end mb-1">
                      <p className="text-sm font-semibold text-slate-700">{d.site}</p>
                      <span className="text-sm font-medium text-slate-600">{Math.floor(d.ms / 3600000)}h {Math.floor((d.ms % 3600000)/60000)}m</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`${d.color} rounded-full h-2`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-slate-200" />

          {/* App Usage */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <h3 className="font-headline font-semibold text-lg text-slate-800 mb-4">App Usage (7 Days)</h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 pb-4">
              {Object.entries(weekPlatformTotals).sort((a,b) => b[1] - a[1]).filter(([_, ms]) => ms > 0).length === 0 ? (
                <p className="text-sm text-slate-400 italic">No app usage tracked yet.</p>
              ) : (
                Object.entries(weekPlatformTotals)
                  .sort((a, b) => b[1] - a[1])
                  .filter(([_, ms]) => ms > 60000)
                  .map(([name, ms], i) => {
                    const meta = PLATFORM_META[name] || PLATFORM_META['Other'];
                    const Icon = meta.icon;
                    const maxMs = Math.max(...Object.values(weekPlatformTotals));
                    const pct = (ms / maxMs) * 100;
                    return (
                      <div key={i} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={clsx("w-6 h-6 rounded-md flex items-center justify-center", meta.bg, meta.text)}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">{name}</span>
                          </div>
                          <span className="text-sm text-slate-500 font-label">{Math.floor(ms / 3600000)}h {Math.floor((ms % 3600000) / 60000)}m</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className={clsx("h-full rounded-full", meta.bar)} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
