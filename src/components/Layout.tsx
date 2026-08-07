import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout() {
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
