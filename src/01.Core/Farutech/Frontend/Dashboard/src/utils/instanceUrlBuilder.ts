export interface InstanceUrlConfig {
  instanceSegment: string;
  orgCode: string;
  baseDomain: string;
  useSubdomain: boolean;
}

export class InstanceUrlBuilder {
  static buildUrl(
    instanceCode: string,
    orgCode: string,
    config?: Partial<InstanceUrlConfig>
  ): string {
    const {
      baseDomain = (import.meta.env.VITE_APP_DOMAIN as string) || 'localhost',
      useSubdomain = (import.meta.env.VITE_USE_SUBDOMAIN as string) === 'true'
    } = config || {};

    const instanceSegment = (instanceCode || '').split('-').pop() || instanceCode;

    // If not using subdomain or running in dev mode, build dev url
    if (!useSubdomain || import.meta.env.DEV) {
      return this.buildDevUrl(instanceSegment, orgCode, baseDomain);
    }

    return `https://${instanceSegment}.${orgCode}.app.${baseDomain}`;
  }

  private static buildDevUrl(
    instanceSegment: string,
    orgCode: string,
    baseDomain: string
  ): string {
    const port = (import.meta.env.VITE_APP_PORT as string) || '3000';
    const usePort = (import.meta.env.VITE_USE_PORT as string) === 'true';

    if (usePort) {
      // In dev, post to the session receiver route to allow SPA to process session
      return `http://localhost:${port}/session-receive?instance=${instanceSegment}&org=${orgCode}`;
    }

    // Fallback to a predictable local hostname for reverse-proxy setups
    return `http://${instanceSegment}.${orgCode}.app.localhost`;
  }
}

export default InstanceUrlBuilder;
