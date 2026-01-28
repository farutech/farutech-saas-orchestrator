import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarutech } from '@/contexts/FarutechContext';
import { usePermissions } from '@/hooks/usePermissions';
import { NewDashboardLayout } from '@/components/layout/NewDashboardLayout';
import { ERPDashboard } from '@/components/dashboard/erp/ERPDashboard';
import { HealthDashboard } from '@/components/dashboard/health/HealthDashboard';
import { VetDashboard } from '@/components/dashboard/vet/VetDashboard';
import { POSDashboard } from '@/components/dashboard/pos/POSDashboard';
import { DashboardSkeleton } from '@/components/dashboard/LoadingSkeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldX } from 'lucide-react';

function DashboardContent() {
  const { currentModule, isTransitioning } = useFarutech();

  if (isTransitioning) {
    return <DashboardSkeleton />;
  }

  switch (currentModule) {
    case 'erp':
      return <ERPDashboard />;
    case 'medical':
      return <HealthDashboard />;
    case 'vet':
      return <VetDashboard />;
    case 'pos':
      return <POSDashboard />;
    default:
      return <ERPDashboard />;
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentModule } = useFarutech();
  const { hasPermission, loading: permissionsLoading } = usePermissions();

  // Check dashboard access permission
  const hasDashboardAccess = hasPermission('dashboard:access');

  // Redirect to launcher if no module selected
  useEffect(() => {
    if (!currentModule) {
      navigate('/');
    }
  }, [currentModule, navigate]);

  // Show loading while checking permissions
  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check dashboard access permission
  if (!hasDashboardAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert className="max-w-md">
          <ShieldX className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access the dashboard. Please contact your administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!currentModule) {
    return null;
  }

  return (
    <NewDashboardLayout>
      <DashboardContent />
    </NewDashboardLayout>
  );
}
