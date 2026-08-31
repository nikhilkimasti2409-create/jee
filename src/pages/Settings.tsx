import { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Download, Trash2, KeyRound, Lock, Bell, BellOff, Info } from 'lucide-react';
import clsx from 'clsx';
import { useParent } from '../context/ParentContext';

export default function Settings() {
  const [pin, setPin] = useState('');
  const [isPinEnabled, setIsPinEnabled] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dailyReports, setDailyReports] = useState(true);
  const [saved, setSaved] = useState(false);
  
  const { selectedStudent } = useParent();

  useEffect(() => {
    setIsPinEnabled(localStorage.getItem('dashboard_pin') !== null);
    setEmailAlerts(localStorage.getItem('email_alerts') !== 'false');
    setDailyReports(localStorage.getItem('daily_reports') !== 'false');
  }, []);

  const handleSavePin = () => {
    if (pin.length >= 4) {
      localStorage.setItem('dashboard_pin', pin);
      setIsPinEnabled(true);
      setPin('');
      triggerSave();
    }
  };

  const handleRemovePin = () => {
    localStorage.removeItem('dashboard_pin');
    setIsPinEnabled(false);
    triggerSave();
  };

  const toggleEmailAlerts = () => {
    const newVal = !emailAlerts;
    setEmailAlerts(newVal);
    localStorage.setItem('email_alerts', String(newVal));
    triggerSave();
  };

  const toggleDailyReports = () => {
    const newVal = !dailyReports;
    setDailyReports(newVal);
    localStorage.setItem('daily_reports', String(newVal));
    triggerSave();
  };

  const clearCache = () => {
    if (window.confirm("Are you sure you want to clear the local dashboard cache? You will need to log in again.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const downloadReport = () => {
    alert("Generating PDF Report for " + (selectedStudent || 'all students') + "...\n(This feature will connect to the backend PDF generator in the future.)");
  };

  const triggerSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 h-full flex flex-col pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-bold text-2xl text-slate-800">Preferences & Settings</h2>
          <p className="text-slate-500 text-sm mt-1">Manage security, notifications, and dashboard data.</p>
        </div>
        {saved && (
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
            <ShieldCheck className="w-4 h-4" /> Saved Successfully
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        <div className="space-y-6">
          {/* Security & Access */}
          <div className="glass-card p-6">
            <h3 className="font-headline font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-500" /> Security & Access Control
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Set a PIN code to prevent unauthorized access to this dashboard on shared devices.
            </p>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-700">Dashboard PIN Protection</p>
                <p className="text-xs text-slate-500">{isPinEnabled ? 'Active' : 'Currently Disabled'}</p>
              </div>
              <div className={clsx("px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full", isPinEnabled ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500")}>
                {isPinEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>

            {!isPinEnabled ? (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="Enter 4+ digit PIN" 
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-label"
                  />
                </div>
                <button 
                  onClick={handleSavePin}
                  disabled={pin.length < 4}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
                >
                  Enable PIN
                </button>
              </div>
            ) : (
              <button 
                onClick={handleRemovePin}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Remove PIN Protection
              </button>
            )}
          </div>

          {/* Notifications */}
          <div className="glass-card p-6">
            <h3 className="font-headline font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-sky-500" /> Notification Preferences
            </h3>
            
            <div className="space-y-3">
              <button
                type="button"
                role="switch"
                aria-checked={emailAlerts}
                onClick={toggleEmailAlerts}
                className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center", emailAlerts ? "bg-sky-100 text-sky-500" : "bg-slate-100 text-slate-400")}>
                    {emailAlerts ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">Real-time Security Alerts</p>
                    <p className="text-xs text-slate-500">Get emails immediately when a distraction is blocked.</p>
                  </div>
                </div>
                <div className={clsx("w-10 h-5 rounded-full relative transition-colors", emailAlerts ? "bg-primary" : "bg-slate-300")}>
                  <div className={clsx("w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm", emailAlerts ? "left-5" : "left-1")} />
                </div>
              </button>

              <button
                type="button"
                role="switch"
                aria-checked={dailyReports}
                onClick={toggleDailyReports}
                className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center", dailyReports ? "bg-sky-100 text-sky-500" : "bg-slate-100 text-slate-400")}>
                    {dailyReports ? <Mail className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">Daily Summary Reports</p>
                    <p className="text-xs text-slate-500">Receive a daily breakdown of study analytics at 9 PM.</p>
                  </div>
                </div>
                <div className={clsx("w-10 h-5 rounded-full relative transition-colors", dailyReports ? "bg-primary" : "bg-slate-300")}>
                  <div className={clsx("w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm", dailyReports ? "left-5" : "left-1")} />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Data Export */}
          <div className="glass-card p-6">
            <h3 className="font-headline font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-500" /> Export & Reports
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Download a comprehensive PDF report of the selected student's study habits, timeline, and analytics over the past 30 days.
            </p>
            
            <button 
              onClick={downloadReport}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" /> Generate PDF Report
            </button>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed">
                PDF Reports are securely generated and can be used to track long-term progress or shared with tutors and counselors.
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-card p-6 border-rose-100">
            <h3 className="font-headline font-semibold text-lg text-rose-600 mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Danger Zone
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Clearing the cache will sign you out and remove all locally saved preferences (including the PIN). Cloud data will remain untouched.
            </p>
            <button 
              onClick={clearCache}
              className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 rounded-lg font-bold text-sm transition-colors"
            >
              Clear Local Cache & Sign Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
