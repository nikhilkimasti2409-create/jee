import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AlertTriangle, Info, Bell, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';
import { useParent } from '../context/ParentContext';

export default function Notifications() {
  const [logs, setLogs] = useState<any[]>([]);
  const { selectedStudent } = useParent();

  useEffect(() => {
    if (!selectedStudent) {
       setLogs([]);
       return;
    }
    api.getSecurityLogs(selectedStudent).then(setLogs).catch(console.error);
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
        <button className="px-4 py-2 text-sm font-bold text-primary border-b-2 border-primary">All Alerts</button>
        <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">Security</button>
        <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">Study Updates</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {!logs || logs.length === 0 ? (
           <p className="text-sm text-slate-400 italic">No new security notifications or alerts.</p>
        ) : (
          logs.map((alert: any, i: number) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
              <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center shrink-0", 
                alert.type === 'alert' ? 'bg-rose-100 text-rose-500' :
                alert.type === 'warning' ? 'bg-amber-100 text-amber-500' : 'bg-sky-100 text-sky-500'
              )}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-slate-800">{alert.title}</h4>
                  <span className="text-xs font-semibold text-slate-400">{alert.time}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{alert.desc}</p>
              </div>
            </div>
          ))
        )}

        {/* Dummy Data for demonstration if backend is empty */}
        {logs.length === 0 && (
          <>
            <div className="p-4 rounded-xl border bg-rose-50 border-rose-100 flex items-start gap-4 hover:shadow-md">
              <div className="mt-0.5 bg-white p-2 rounded-lg shadow-sm"><ShieldAlert className="w-5 h-5 text-rose-500" /></div>
              <div>
                <h4 className="font-semibold text-slate-800">Distraction Blocked</h4>
                <p className="text-sm text-slate-600 mt-1">Attempted to access youtube.com during a scheduled study block.</p>
                <span className="text-xs text-slate-500 mt-2 font-mono bg-white/50 inline-block px-2 py-1 rounded">URL: https://youtube.com/shorts</span>
              </div>
            </div>
            <div className="p-4 rounded-xl border bg-amber-50 border-amber-100 flex items-start gap-4 hover:shadow-md">
              <div className="mt-0.5 bg-white p-2 rounded-lg shadow-sm"><AlertTriangle className="w-5 h-5 text-amber-500" /></div>
              <div>
                <h4 className="font-semibold text-slate-800">Extension Inactive</h4>
                <p className="text-sm text-slate-600 mt-1">JEE Guardian extension was disabled or uninstalled for 10 minutes.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
