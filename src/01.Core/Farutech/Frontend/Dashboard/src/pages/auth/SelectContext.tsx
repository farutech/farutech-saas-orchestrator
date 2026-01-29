// ============================================================================
// SELECT CONTEXT PAGE - Organization/Tenant Selection
// ============================================================================

import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function SelectContext() {
  const { availableTenants, selectContext, user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to home since context selection is now integrated there
  useEffect(() => {
    navigate('/home');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Redirigiendo...</p>
      </div>
    </div>
  );
}
