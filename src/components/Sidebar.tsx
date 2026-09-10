import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  History, 
  Bell, 
  Settings, 
  ShieldCheck,
  Users
} from 'lucide-react';
import clsx from 'clsx';
import { useParent } from '../context/ParentContext';

export default function Sidebar() {
  const location = useLocation();
  const { students, selectedStudent, setSelectedStudent } = useParent();

  return (
    <aside className="w-20 lg:w-64 flex-shrink-0 glass-panel flex flex-col items-center lg:items-stretch py-6 z-20 h-full">
      <div className="flex items-center justify-center lg:justify-start lg:px-6 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <span className="ml-3 font-headline font-bold text-lg hidden lg:block text-slate-800 tracking-tight">
          JEE Guardian
        </span>
      </div>

      <div className="px-4 mb-6 hidden lg:block">
        <label htmlFor="student-select" className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-1"><Users aria-hidden="true" className="w-3 h-3"/> Students</label>
        <select 
          id="student-select"
          value={selectedStudent || ''} 
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none"
        >
          {students.length === 0 && <option value="">No Students</option>}
          {students.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-3 lg:px-4">
        {[
          { id: '/', icon: LayoutDashboard, label: 'Dashboard' },
          { id: '/analytics', icon: BarChart3, label: 'Analytics' },
          { id: '/history', icon: History, label: 'History' },
          { id: '/notifications', icon: Bell, label: 'Notifications' },
          { id: '/settings', icon: Settings, label: 'Settings' },
        ].map((item) => (
          <Link
            key={item.id}
            to={item.id}
            aria-label={item.label}
            title={item.label}
            className={clsx(
              "flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg transition-all duration-200 group relative",
              location.pathname === item.id 
                ? "bg-primary text-white shadow-md shadow-primary/20" 
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <item.icon aria-hidden="true" className="w-5 h-5" />
            <span className="font-label font-medium hidden lg:block">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-3 lg:px-4 pb-4">
        <div className="p-2 lg:p-3 flex items-center justify-center lg:justify-start gap-3 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
          <img 
            src={localStorage.getItem('userPhoto') || "https://api.dicebear.com/7.x/notionists/svg?seed=Felix"} 
            alt="Parent Profile" 
            className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300"
          />
          <div className="hidden lg:block overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">{localStorage.getItem('userName') || 'Parent Account'}</p>
            <p className="text-xs text-slate-500 truncate" title={localStorage.getItem('userEmail') || 'Authenticated'}>
              {localStorage.getItem('userEmail') || 'Authenticated'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/login';
          }}
          className="w-full mt-2 text-xs text-slate-500 hover:text-rose-500 hidden lg:block"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
