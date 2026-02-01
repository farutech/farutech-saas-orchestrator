import { useCallback } from 'react';

export interface InstanceConfig {
  id: string;
  name: string;
  baseUrl: string;
  region: string;
}

export interface NavigationOptions {
  preserveSession?: boolean;
  target?: '_blank' | '_self';
  params?: Record<string, string>;
}

export interface UseInstanceNavigationReturn {
  navigateToInstance: (instanceId: string, path?: string, options?: NavigationOptions) => void;
  buildInstanceUrl: (instanceId: string, path?: string, params?: Record<string, string>) => string;
  getCurrentInstance: () => InstanceConfig | null;
  isValidInstance: (instanceId: string) => boolean;
  getAvailableInstances: () => InstanceConfig[];
}

/**
 * Hook for navigating between SaaS instances
 * Handles URL building, session transfer, and instance validation
 */
export const useInstanceNavigation = (): UseInstanceNavigationReturn => {
  // In a real implementation, this would come from a context or API
  const availableInstances: InstanceConfig[] = [
    { id: 'prod', name: 'Production', baseUrl: 'https://app.farutech.com', region: 'us-east-1' },
    { id: 'staging', name: 'Staging', baseUrl: 'https://staging.farutech.com', region: 'us-west-2' },
    { id: 'dev', name: 'Development', baseUrl: 'https://dev.farutech.com', region: 'us-central-1' },
  ];

  const getCurrentInstance = useCallback((): InstanceConfig | null => {
    // Extract instance from current URL or context
    const hostname = window.location.hostname;
    // Check if hostname matches any instance baseUrl
    return availableInstances.find(instance =>
      hostname === new URL(instance.baseUrl).hostname ||
      hostname.includes(instance.id)
    ) || null;
  }, [availableInstances]);

  const isValidInstance = useCallback((instanceId: string): boolean => {
    return availableInstances.some(instance => instance.id === instanceId);
  }, [availableInstances]);

  const getAvailableInstances = useCallback((): InstanceConfig[] => {
    return availableInstances;
  }, [availableInstances]);

  const buildInstanceUrl = useCallback((
    instanceId: string,
    path: string = '/',
    params: Record<string, string> = {}
  ): string => {
    const instance = availableInstances.find(inst => inst.id === instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    const url = new URL(path, instance.baseUrl);

    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    return url.toString();
  }, [availableInstances]);

  const navigateToInstance = useCallback((
    instanceId: string,
    path: string = '/',
    options: NavigationOptions = {}
  ): void => {
    const { preserveSession = true, target = '_self', params = {} } = options;

    if (!isValidInstance(instanceId)) {
      throw new Error(`Invalid instance: ${instanceId}`);
    }

    let finalParams = { ...params };

    // Preserve session if requested
    if (preserveSession) {
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        finalParams.sessionToken = sessionToken;
      }
    }

    const url = buildInstanceUrl(instanceId, path, finalParams);

    if (target === '_blank') {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  }, [isValidInstance, buildInstanceUrl]);

  return {
    navigateToInstance,
    buildInstanceUrl,
    getCurrentInstance,
    isValidInstance,
    getAvailableInstances,
  };
};