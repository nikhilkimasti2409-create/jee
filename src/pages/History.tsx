import { Globe, Clock, Monitor, Search, Calendar, Target, Activity, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useParent } from '../context/ParentContext';
import clsx from 'clsx';

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dateSearch, setDateSearch] = useState('');
  const { selectedStudent } = useParent();

  useEffect(() => {
    if (!selectedStudent) {
       setHistory([]);
       return;
    }
    api.getHistory(selectedStudent).then((data) => {
       // Parse DD/MM/YYYY to proper date for sorting (Newest first)
       const sorted = [...data].sort((a, b) => {
         const parseDate = (d: string) => {
           const [day, month, year] = d.split('/').map(Number);
           return new Date(year, month - 1, day).getTime();
         };
         return parseDate(b.id) - parseDate(a.id);
       });
       setHistory(sorted);
       if (sorted.length > 0) setSelectedDate(sorted[0].id);
    }).catch(console.error);
  }, [selectedStudent]);

  const filteredHistory = history.filter(day => {
    if (!dateSearch) return true;
    const d = new Date(day.id.split('/').reverse().join('-'));
    const friendly = isNaN(d.getTime()) ? day.id : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toLowerCase();
    return day.id.includes(dateSearch) || friendly.includes(dateSearch.toLowerCase());
  });

  const selectedData = history.find(d => d.id === selectedDate);
  const d = selectedData ? new Date(selectedData.id.split('/').reverse().join('-')) : new Date();
  const friendlyDate = isNaN(d.getTime()) ? selectedDate : d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6 h-full flex flex-col pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-bold text-2xl text-slate-800">Study History & Log</h2>
          <p className="text-slate-500 text-sm mt-1">Detailed breakdown of past browsing sessions and activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Left Side: Calendar / Dates */}
        <div className="glass-card p-5 xl:col-span-1 flex flex-col h-[700px]">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Select Date
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search date (e.g. 15/08 or Aug 15)" 
                value={dateSearch}
                onChange={(e) => setDateSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-label"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredHistory.length === 0 ? (
               <p className="text-sm text-slate-400 italic text-center mt-4">No dates found.</p>
            ) : (
              filteredHistory.map((day) => {
                const isSelected = selectedDate === day.id;
                const dateObj = new Date(day.id.split('/').reverse().join('-'));
                const ms = day.totalTimeMs;
                const timeStr = `${Math.floor(ms/3600000)}h ${Math.floor((ms%3600000)/60000)}m`;
                
                return (
                  <button 
                    key={day.id}
                    onClick={() => setSelectedDate(day.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group border ${isSelected ? 'bg-primary border-primary text-white shadow-md' : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-600'}`}
                  >
                    <div>
                      <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                        {isNaN(dateObj.getTime()) ? day.id : dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {timeStr} logged
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Timeline & Analytics */}
        <div className="xl:col-span-3 flex flex-col h-[700px] gap-6">
          
          {selectedData ? (
            <>
              {/* Daily Analytics Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                <div className="glass-card p-5 bg-gradient-to-br from-indigo-500 to-primary text-white col-span-1 md:col-span-4 lg:col-span-1 flex flex-col justify-center">
                  <h3 className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Selected Date</h3>
                  <p className="text-lg font-headline font-bold">{friendlyDate}</p>
                </div>
                
                {[
                  { label: 'Total Time', val: `${Math.floor(selectedData.totalTimeMs/3600000)}h ${Math.floor((selectedData.totalTimeMs%3600000)/60000)}m`, icon: Clock, color: 'text-indigo-500' },
                  { label: 'Physics', val: `${Math.floor((selectedData.physicsTime||0)/3600000)}h ${Math.floor(((selectedData.physicsTime||0)%3600000)/60000)}m`, icon: Activity, color: 'text-sky-500' },
                  { label: 'Chemistry', val: `${Math.floor((selectedData.chemTime||0)/3600000)}h ${Math.floor(((selectedData.chemTime||0)%3600000)/60000)}m`, icon: Target, color: 'text-emerald-500' },
                  { label: 'Maths', val: `${Math.floor((selectedData.mathsTime||0)/3600000)}h ${Math.floor(((selectedData.mathsTime||0)%3600000)/60000)}m`, icon: Target, color: 'text-rose-500' },
                ].map((stat, i) => (
                  <div key={i} className="glass-card p-4 flex items-center gap-3">
                    <div className={clsx("w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center", stat.color)}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                      <p className="font-headline font-bold text-lg text-slate-800">{stat.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subject Distribution Bar */}
              <div className="glass-card p-5 shrink-0 flex flex-col justify-center">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Subject Time Distribution</h3>
                {selectedData.totalTimeMs > 0 ? (
                  <div className="w-full h-4 bg-slate-100 rounded-full flex overflow-hidden shadow-inner">
                    {selectedData.physicsTime > 0 && <div className="bg-primary h-full transition-all" style={{ width: `${(selectedData.physicsTime / selectedData.totalTimeMs) * 100}%` }} title="Physics" />}
                    {selectedData.chemTime > 0 && <div className="bg-purple-500 h-full transition-all" style={{ width: `${(selectedData.chemTime / selectedData.totalTimeMs) * 100}%` }} title="Chemistry" />}
                    {selectedData.mathsTime > 0 && <div className="bg-amber-400 h-full transition-all" style={{ width: `${(selectedData.mathsTime / selectedData.totalTimeMs) * 100}%` }} title="Maths" />}
                  </div>
                ) : (
                  <div className="w-full h-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">No Subject Data</span>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="glass-card p-6 flex-1 flex flex-col min-h-0">
                <h3 className="font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-indigo-500" /> Detailed Activity Logs
                </h3>
                
                <div className="flex-1 overflow-y-auto pr-4 space-y-6 relative">
                  <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-100 z-0" />
                  
                  {(!selectedData.studyLogs || selectedData.studyLogs.length === 0) ? (
                     <div className="text-slate-400 text-sm italic relative z-10 pl-10">No detailed logs available for this date.</div>
                  ) : (
                    selectedData.studyLogs.map((logStr: string, i: number) => {
                       let type = 'study';
                       let Icon = Clock;
                       let color = 'text-indigo-500';
                       
                       if (logStr.toLowerCase().includes('youtube') || logStr.toLowerCase().includes('google')) {
                         type = 'search';
                         Icon = Globe;
                         color = 'text-sky-500';
                       } else if (logStr.toLowerCase().includes('blocked') || logStr.toLowerCase().includes('warning')) {
                         type = 'alert';
                         Icon = Target;
                         color = 'text-rose-500';
                       } else if (logStr.toLowerCase().includes('completed') || logStr.toLowerCase().includes('done')) {
                         type = 'success';
                         Icon = CheckCircle2;
                         color = 'text-emerald-500';
                       }

                       return (
                        <div key={i} className="relative z-10 flex gap-6 group">
                          <div className={clsx("w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center shrink-0 mt-1 shadow-sm", color.replace('text-', 'border-').replace('500', '100'))}>
                            <Icon className={clsx("w-3.5 h-3.5", color)} />
                          </div>
                          <div className="flex-1 bg-white hover:bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-sm transition-all group-hover:shadow-md">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-slate-800">Activity Event</span>
                                <span className={clsx("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", color.replace('text-', 'bg-').replace('500', '50'), color)}>
                                  {type}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">{logStr}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card flex-1 flex flex-col items-center justify-center text-slate-400">
              <Calendar className="w-12 h-12 mb-4 text-slate-200" />
              <p>Select a date from the left to view its timeline and analytics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
