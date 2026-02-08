// ============================================================================
// LAUNCHER PAGE - Unified Dashboard & Instance Selector
// ============================================================================

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================================================
// Main Component
// ============================================================================

export default function HomePage() {
  const navigate = useNavigate();

  // Auto-redirect to dashboard (main page)
  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  // The rest of the component will not render due to the redirect
  return null;
}
