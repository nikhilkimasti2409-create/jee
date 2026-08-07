import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Lock, KeyRound } from 'lucide-react';

export default function Layout() {
  const storedPin = localStorage.getItem('dashboard_pin');
  const [isLocked, setIsLocked] = useState(!!storedPin);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);

  const handleUnlock = () => {
    if (pinInput === storedPin) {
      setIsLocked(false);
    } else {
      setError(true);
      setPinInput('');
      setTimeout(() => setError(false), 2000);
    }
  };

  if (isLocked) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center font-body relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="glass-card p-10 max-w-sm w-full mx-4 flex flex-col items-center z-10 relative shadow-2xl shadow-indigo-500/10 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-headline text-2xl font-bold text-slate-800 mb-2">Dashboard Locked</h2>
          <p className="text-slate-500 text-sm text-center mb-8">
            Please enter your Parent PIN to access the dashboard.
          </p>

          <div className="w-full relative mb-6">
            <KeyRound className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="password" 
              autoFocus
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-center text-xl tracking-[1em] font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
            {error && <p className="absolute -bottom-6 left-0 right-0 text-center text-xs text-rose-500 font-bold animate-pulse">Incorrect PIN</p>}
          </div>

          <button 
            onClick={handleUnlock}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold transition-colors shadow-md"
          >
            Unlock Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-on-surface overflow-hidden font-body relative">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[30%] bg-sky-200/40 rounded-full blur-[100px] pointer-events-none" />
        
        <TopBar />
        
        <div className="flex-1 overflow-y-auto p-8 z-10 space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
