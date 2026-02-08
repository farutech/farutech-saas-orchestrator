import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { DashboardAppHeader } from './DashboardAppHeader';
import { ModuleSidebar } from './ModuleSidebar';

interface NewDashboardLayoutProps {
  children: ReactNode;
}

export function NewDashboardLayout({ children }: NewDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardAppHeader />
      
      <div className="flex pt-14">{/* pt-14 for header height */}
        <ModuleSidebar />
        
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6 overflow-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
