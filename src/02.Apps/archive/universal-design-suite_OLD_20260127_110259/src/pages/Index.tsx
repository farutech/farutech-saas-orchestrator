import { useIndustry } from '@/contexts/IndustryContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ERPDashboard } from '@/components/dashboard/erp/ERPDashboard';
import { HealthDashboard } from '@/components/dashboard/health/HealthDashboard';
import { VetDashboard } from '@/components/dashboard/vet/VetDashboard';
import { DashboardSkeleton } from '@/components/dashboard/LoadingSkeleton';

function DashboardContent() {
  const { industry, isTransitioning } = useIndustry();

  if (isTransitioning) {
    return <DashboardSkeleton />;
  }

  switch (industry) {
    case 'erp':
      return <ERPDashboard />;
    case 'health':
      return <HealthDashboard />;
    case 'vet':
      return <VetDashboard />;
    default:
      return <ERPDashboard />;
  }
}

export default function Index() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
