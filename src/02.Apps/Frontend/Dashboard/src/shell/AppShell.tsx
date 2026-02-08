// ============================================================================
// APP SHELL - Dashboard Layout Orchestrator
// ============================================================================

import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardAppHeader } from '../components/layout/DashboardAppHeader';
import { DashboardSidebar } from './Sidebar';
import { useSidebarStore } from '../store/sidebarStore';

export const AppShell: React.FC = () => {
  const { isOpen, sidebarWidth, isMobile } = useSidebarStore();

  // Calcular el margen izquierdo para el contenido principal
  const getMainMargin = () => {
    if (isMobile) return '0px';
    if (!isOpen) return '63px'; // Sidebar colapsado
    return `${sidebarWidth}px`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <DashboardAppHeader />

      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main
        style={{
          marginLeft: getMainMargin(),
          paddingTop: '56px', // Header height
        }}
        className="transition-all duration-500 ease-out min-h-screen"
      >
        <div className="container mx-auto p-6">
          {/* MP Content or Dashboard Pages */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

AppShell.displayName = 'AppShell';
