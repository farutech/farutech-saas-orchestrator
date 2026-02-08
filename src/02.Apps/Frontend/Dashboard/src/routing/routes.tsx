// ============================================================================
// DASHBOARD ROUTES - Main Router Configuration
// ============================================================================

import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../shell/AppShell';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MpLoader } from './MpLoader';
import { LoginPage, ForgotPasswordPage, ResetPasswordPage, RegisterPage } from '../pages/auth';

// Lazy load pages
const HomePage = lazy(() => import('../pages/Home'));
const LauncherPage = lazy(() => import('../pages/LauncherPage'));

export const DashboardRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes with AppShell */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        {/* Dashboard Home */}
        <Route path="/launcher" element={<LauncherPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* MP Routes - Dynamic Loading */}
        <Route path="/customers/*" element={<MpLoader mpId="customers" />} />
        <Route path="/products/*" element={<MpLoader mpId="products" />} />
        <Route path="/orders/*" element={<MpLoader mpId="orders" />} />
        
        {/* Add more MP routes here */}
      </Route>

      {/* Default & 404 */}
      <Route path="/" element={<Navigate to="/launcher" replace />} />
      <Route path="*" element={<Navigate to="/launcher" replace />} />
    </Routes>
  );
};
