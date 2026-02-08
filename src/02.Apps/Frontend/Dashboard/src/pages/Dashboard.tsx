import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarutech } from '@/contexts/FarutechContext';
import { NewDashboardLayout } from '@/components/layout/NewDashboardLayout';
import { ERPDashboard } from '@/components/dashboard/erp/ERPDashboard';
import { HealthDashboard } from '@/components/dashboard/health/HealthDashboard';
import { VetDashboard } from '@/components/dashboard/vet/VetDashboard';
import { POSDashboard } from '@/components/dashboard/pos/POSDashboard';
import { DashboardSkeleton } from '@/components/dashboard/LoadingSkeleton';

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

  // Redirect to launcher if no module selected
  useEffect(() => {
    if (!currentModule) {
      navigate('/');
    }
  }, [currentModule, navigate]);

  if (!currentModule) {
    return null;
  }

  return (
    <NewDashboardLayout>
      <DashboardContent />
    </NewDashboardLayout>
  );
}
