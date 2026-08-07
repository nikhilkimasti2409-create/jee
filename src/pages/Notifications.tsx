import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ShieldAlert } from 'lucide-react';
import { useParent } from '../context/ParentContext';

export default function Notifications() {
  const [logs, setLogs] = useState<any[]>([]);
  const { selectedStudent } = useParent();

  useEffect(() => {
    if (!selectedStudent) {
       setLogs([]);
       return;
    }
    
    const fetchLogs = () => {
      api.getSecurityLogs(selectedStudent).then(setLogs).catch(console.error);
    };
    
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // Har 10 sec mein update
    return () => clearInterval(interval);
  }, [selectedStudent]);

  return (
    <div className="glass-card p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-headline font-bold text-2xl text-slate-800">Security Alerts & Notifications</h2>
          <p className="text-slate-500 text-sm mt-1">Review blocked distractions and extension status.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Mark all as read</button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-2">
        <button className="px-4 py-2 text-sm font-bold text-primary border-b-2 border-primary">Live Alerts</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {!logs || logs.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-slate-400">
             <ShieldAlert className="w-12 h-12 mb-3 text-emerald-300 opacity-50" />
             <p className="text-sm italic">All good! No security violations detected.</p>
           </div>
        ) : (
          logs.map((alert: any) => {
            const date = new Date(alert.timestamp);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString();
            
            return (
              <div key={alert.id} className="p-4 rounded-xl border bg-rose-50 border-rose-100 flex items-start gap-4 hover:shadow-md transition-shadow group animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mt-0.5 bg-white p-2 rounded-lg shadow-sm">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-slate-800 tracking-tight">Security Violation</h4>
                    <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-1 rounded shadow-sm">{timeStr}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{alert.details}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
