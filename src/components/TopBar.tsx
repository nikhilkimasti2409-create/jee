import { Search } from 'lucide-react';
import { useParent } from '../context/ParentContext';

export default function TopBar() {
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const { searchQuery, setSearchQuery } = useParent();

  return (
    <header className="h-20 px-8 flex items-center justify-between z-10 shrink-0 border-b border-slate-200/50 bg-white/40 backdrop-blur-md">
      <div>
        <h1 className="text-2xl font-headline font-bold text-slate-800">
          Good Morning 👋
        </h1>
        <p className="text-sm text-slate-500 font-label mt-0.5">
          {date}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search aria-hidden="true" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            aria-label="Search activities"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities..." 
            className="pl-9 pr-4 py-2 bg-white/60 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all w-64 font-label"
          />
        </div>
      </div>
    </header>
  );
}
