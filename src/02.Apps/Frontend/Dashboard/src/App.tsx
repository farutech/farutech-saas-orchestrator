import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { FarutechProvider } from "@/contexts/FarutechContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useEffect } from "react";

// Bootstrap MPs
import { bootstrapMps } from "./config/mp-registry";

// Auth Pages
import { LoginPage, ForgotPasswordPage, ResetPasswordPage, RegisterPage } from "./pages/auth";
import SelectContext from "./pages/auth/SelectContext";
import ConfirmEmail from "./pages/auth/ConfirmEmail";

// Shell & Core Pages
import { AppShell } from "./shell/AppShell";
import { MpLoader } from "./routing/MpLoader";
import { lazy, Suspense } from "react";

// Lazy load pages
const HomePage = lazy(() => import("./pages/Home"));
const LauncherPage = lazy(() => import("./pages/LauncherPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Legacy Pages (to be migrated to MPs)
import AppLauncher from "./pages/AppLauncher";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import ProfilePage from "./pages/settings/ProfilePage";

// App Pages (Universal Dashboard)
import AppDashboard from "./pages/app/AppDashboard";
import DesignSystemDemo from "./pages/app/DesignSystemDemo";

// Orchestrator Pages
import OrchestratorLayout from "./pages/orchestrator/OrchestratorLayout";
import CatalogPage from "./pages/orchestrator/CatalogPage";
import CustomersPage from "./pages/orchestrator/CustomersPage";
import ProvisioningPage from "./pages/orchestrator/ProvisioningPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Bootstrap MPs on app initialization
  useEffect(() => {
    bootstrapMps();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <FarutechProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner position="top-right" />
              <Suspense fallback={<div>Cargando...</div>}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/register" element={<RegisterPage />} />
                  <Route path="/auth/select-context" element={<SelectContext />} />
                  <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/confirm-email" element={<ConfirmEmail />} />

                  {/* Protected Routes with AppShell */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <AppShell />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/home" element={<HomePage />} />
                    
                    {/* Mini-Programs Routes */}
                    <Route path="/customers/*" element={<MpLoader mpId="customers" />} />
                    {/* Add more MP routes here */}
                  </Route>

                  {/* Legacy Protected Routes (to be migrated) */}
                  <Route
                    path="/launcher"
                    element={
                      <ProtectedRoute>
                        <LauncherPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/app-launcher"
                    element={
                      <ProtectedRoute>
                        <AppLauncher />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/*"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Orchestrator Routes (Admin Only) */}
                  <Route
                    path="/orchestrator"
                    element={
                      <ProtectedRoute requiresOrchestrator>
                        <OrchestratorLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to="/orchestrator/catalog" replace />} />
                    <Route path="catalog" element={<CatalogPage />} />
                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="provisioning" element={<ProvisioningPage />} />
                    <Route path="settings" element={<div className="text-white">Settings</div>} />
                  </Route>

                  {/* Universal Dashboard App Routes */}
                  <Route
                    path="/app/dashboard"
                    element={
                      <ProtectedRoute>
                        <AppDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/app/design-system"
                    element={
                      <ProtectedRoute>
                        <DesignSystemDemo />
                      </ProtectedRoute>
                    }
                  />

                  {/* Default & 404 */}
                  <Route path="/" element={<Navigate to="/launcher" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </TooltipProvider>
          </FarutechProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
