import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SessionReceiver() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const processSession = async () => {
      try {
        // 1. Try localStorage (if already present)
        let sessionData = localStorage.getItem('farutech_session');

        // 2. Try location.state (if navigation used history state)
        if (!sessionData && (location.state as any)?.farutech_session) {
          sessionData = (location.state as any).farutech_session;
        }

        // 3. Try query param (development fallback)
        if (!sessionData) {
          const params = new URLSearchParams(location.search);
          const sessionParam = params.get('session');
          if (sessionParam) {
            try {
              sessionData = atob(sessionParam);
            } catch (e) {
              // ignore
              sessionData = sessionParam;
            }
          }
        }

        if (sessionData) {
          const parsed = JSON.parse(sessionData as string);

          // validate timestamp (5 minutes)
          const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
          if (!parsed.timestamp || parsed.timestamp < fiveMinutesAgo) {
            setError('Sesión expirada o inválida');
            setLoading(false);
            return;
          }

          // Persist into localStorage for the tenant app
          localStorage.setItem('farutech_session', JSON.stringify(parsed));
          localStorage.setItem('user_data', JSON.stringify(parsed.user || {}));
          localStorage.setItem('auth_token', parsed.token || '');

          // Extract instance/org from URL if available
          const hostParts = window.location.hostname.split('.');
          if (hostParts.length >= 2) {
            localStorage.setItem('current_instance', hostParts[0]);
            localStorage.setItem('current_tenant', hostParts[1]);
          }

          // Redirect to tenant dashboard
          navigate('/app/dashboard');
          return;
        }

        setError('No se recibió sesión válida');
      } catch (err) {
        console.error('Error procesando sesión:', err);
        setError('Error procesando la sesión');
      } finally {
        setLoading(false);
      }
    };

    processSession();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Estableciendo sesión...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700">Error de sesión</h2>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={() => (window.location.href = (import.meta.env.VITE_DASHBOARD_URL as string) || '/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
}
