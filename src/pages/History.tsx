import { Globe, Clock, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import clsx from 'clsx';

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    api.getHistory().then((data) => {
       setHistory(data);
       if (data.length > 0) setSelectedDate(data[0].id);
    }).catch(console.error);
  }, []);

  const selectedData = history.find(d => d.id === selectedDate);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-bold text-2xl text-slate-800">Study History & Log</h2>
          <p className="text-slate-500 text-sm mt-1">Detailed breakdown of browsing sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Left Side: Calendar / Dates */}
        <div className="glass-card p-5 lg:col-span-1 flex flex-col h-full overflow-y-auto">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-primary" /> Logged Days
          </h3>
          <div className="space-y-2">
            {history.map((day) => {
              const isSelected = selectedDate === day.id;
              const d = new Date(day.id);
              const ms = day.totalTimeMs;
              const timeStr = `${Math.floor(ms/3600000)}h ${Math.floor((ms%3600000)/60000)}m`;
              
              return (
                <button 
                  key={day.id}
                  onClick={() => setSelectedDate(day.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${isSelected ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'}`}
                >
                  <div>
                    <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                      {isNaN(d.getTime()) ? day.id : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className={`text-xs mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {timeStr} logged
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Timeline */}
        <div className="glass-card p-6 lg:col-span-3 flex flex-col h-full overflow-hidden">
          <h3 className="font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100">
            Timeline Details
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-4 space-y-8 relative">
            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-100 z-0" />
            
            {(!selectedData || !selectedData.studyLogs || selectedData.studyLogs.length === 0) ? (
               <div className="text-slate-400 text-sm italic relative z-10 pl-10">No detailed logs available for this date.</div>
            ) : (
              selectedData.studyLogs.map((logStr: string, i: number) => {
                 let type = 'study';
                 if (logStr.toLowerCase().includes('youtube') || logStr.toLowerCase().includes('google')) type = 'search';
                 return (
                  <div key={i} className="relative z-10 flex gap-6 group">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      {type === 'study' ? (
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-sky-500" />
                      )}
                    </div>
                    <div className="flex-1 bg-slate-50/50 group-hover:bg-slate-50 rounded-xl p-4 border border-transparent group-hover:border-slate-200 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-800">Activity Log</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                            {type}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{logStr}</p>
                    </div>
                  </div>
                 );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
