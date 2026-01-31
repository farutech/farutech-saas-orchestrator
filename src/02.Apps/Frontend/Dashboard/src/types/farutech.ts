// Farutech Module Types
export type ModuleType = 'medical' | 'vet' | 'erp' | 'pos';

export interface ModuleConfig {
  id: ModuleType;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  primaryColor: string;
}

export const moduleConfigs: Record<ModuleType, ModuleConfig> = {
  medical: {
    id: 'medical',
    name: 'Médico',
    description: 'Gestión de clínicas, pacientes y citas médicas',
    icon: 'Stethoscope',
    gradient: 'gradient-medical',
    primaryColor: 'hsl(174 72% 46%)',
  },
  vet: {
    id: 'vet',
    name: 'Veterinaria',
    description: 'Control de mascotas, vacunas y servicios veterinarios',
    icon: 'PawPrint',
    gradient: 'gradient-vet',
    primaryColor: 'hsl(25 95% 53%)',
  },
  erp: {
    id: 'erp',
    name: 'ERP',
    description: 'Gestión empresarial, finanzas e inventario',
    icon: 'Building2',
    gradient: 'gradient-erp',
    primaryColor: 'hsl(221 83% 53%)',
  },
  pos: {
    id: 'pos',
    name: 'POS',
    description: 'Punto de venta, ventas y transacciones',
    icon: 'ShoppingCart',
    gradient: 'gradient-pos',
    primaryColor: 'hsl(280 87% 57%)',
  },
};

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'viewer';
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}
