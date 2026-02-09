import { AlertCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function TenantNotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Instancia no encontrada
        </h1>
        
        <p className="text-gray-600 mb-2">
          La instancia a la que intentas acceder no existe o no está disponible.
        </p>
        
        <p className="text-sm text-gray-500 mb-6">
          Verifica que la URL sea correcta o contacta con tu administrador.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={() => window.location.href = import.meta.env.VITE_ORCHESTRATOR_URL || 'http://farutech.local'}
            className="w-full"
            size="lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Ir al Portal Principal
          </Button>
          
          <Button
            onClick={() => navigate('/auth/login')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Intentar Iniciar Sesión
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Si crees que esto es un error, por favor contacta con soporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
}
