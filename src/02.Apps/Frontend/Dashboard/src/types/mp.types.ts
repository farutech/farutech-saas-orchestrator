// ============================================================================
// MP CONFIG - Mini-Program Configuration Interface
// ============================================================================
// Contrato estándar que todos los MPs deben implementar

export interface MpConfig {
  /** Identificador único del MP */
  id: string;
  
  /** Nombre display del MP */
  name: string;
  
  /** Ruta base del MP (sin trailing slash) */
  basePath: string;
  
  /** Ícono del MP (heroicon name) */
  icon: string;
  
  /** Versión semver del MP */
  version: string;
  
  /** Permisos requeridos para acceder al MP */
  permissions: string[];
  
  /** Categoría para agrupación en menú */
  category?: string;
  
  /** Orden de visualización en menú */
  order?: number;
  
  /** Si el MP está habilitado */
  enabled?: boolean;
  
  /** Metadata adicional */
  metadata?: Record<string, any>;
}

export interface MpRoute {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  exact?: boolean;
  permissions?: string[];
}

export interface MpExport {
  config: MpConfig;
  routes: MpRoute[];
}
