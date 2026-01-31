import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import InstanceUrlBuilder from '@/utils/instanceUrlBuilder';
import { navigateToInstance as externalNavigation } from '@/services/navigationService';

export const useInstanceNavigation = () => {
  const { selectContext, user } = useAuth();

  const prepareSessionData = useCallback(() => {
    const token = localStorage.getItem('auth_token');
    const userData = user || JSON.parse(localStorage.getItem('user_data') || '{}');

    return {
      userId: userData?.id,
      userEmail: userData?.email,
      userName: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim(),
      token,
      timestamp: Date.now(),
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }, [user]);

  const navigateToInstance = useCallback(async (
    tenantId: string,
    instanceId: string,
    orgCode: string,
    instanceCode: string,
    options?: {
      preserveSession?: boolean;
      openInNewTab?: boolean;
      method?: 'GET' | 'POST';
    }
  ) => {
    console.log('🚀 Iniciando navegación a instancia:', {
      tenantId,
      instanceId,
      orgCode,
      instanceCode
    });

    // 1. Construir URL de destino (URL EXTERNA de la app tenant)
    const targetUrl = InstanceUrlBuilder.buildUrl(instanceCode, orgCode);
    
    console.log('✅ URL construida:', targetUrl);

    // 2. Preparar datos de sesión
    const sessionData = options?.preserveSession ? prepareSessionData() : null;
    
    // 3. IMPORTANTE: NO llamar a selectContext para URLs externas
    // Solo guardar estado localmente sin navegación interna
    localStorage.setItem('farutech_last_tenant', tenantId);
    localStorage.setItem('farutech_last_instance', instanceId);
    localStorage.setItem('farutech_last_org', orgCode);
    
    // 4. Ejecutar navegación EXTERNA directamente
    externalNavigation({
      url: targetUrl,
      sessionData,
      openInNewTab: options?.openInNewTab,
      method: options?.method || 'POST',
      onBeforeNavigate: () => {
        console.log('📤 Redirigiendo a aplicación tenant:', targetUrl);
      }
    });
  }, [prepareSessionData]);

  const navigateToInstanceSelection = useCallback((tenantId: string) => {
    console.log('🔍 Navegando a selección de instancias para tenant:', tenantId);
    // Esta función SÍ debe navegar internamente a /select-instance
    selectContext(tenantId, '/select-instance');
  }, [selectContext]);

  return { 
    navigateToInstance, 
    navigateToInstanceSelection,
    prepareSessionData
  };
};

export default useInstanceNavigation;
