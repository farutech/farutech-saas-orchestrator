import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { FarutechProvider } from "@/contexts/FarutechContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SelectContext from "./pages/auth/SelectContext";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ConfirmEmail from "./pages/auth/ConfirmEmail";

// Main Pages
import LauncherPage from "./pages/LauncherPage";
import AppLauncher from "./pages/AppLauncher";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <FarutechProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-right" />
            <Routes>
              {/* Public Routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/select-context" element={<SelectContext />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/confirm-email" element={<ConfirmEmail />} />

              {/* Protected Routes */}
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
          </TooltipProvider>
        </FarutechProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
