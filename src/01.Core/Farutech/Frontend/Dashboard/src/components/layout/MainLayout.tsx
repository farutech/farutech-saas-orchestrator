import { Outlet } from 'react-router-dom';
import { AppHeader } from '@/components/layout/AppHeader';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Outlet />
    </div>
  );
}
