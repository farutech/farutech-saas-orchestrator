import { Transaction, Patient, Pet, ChartData, KPICardData } from '@/types/dashboard';

// ERP Data
export const erpKPIs: KPICardData[] = [
  { title: 'Ingresos Totales', value: '$124,500', change: 12.5, changeLabel: 'vs mes anterior', icon: 'DollarSign', trend: 'up' },
  { title: 'Gastos', value: '$45,200', change: -3.2, changeLabel: 'vs mes anterior', icon: 'TrendingDown', trend: 'down' },
  { title: 'Margen Neto', value: '36.3%', change: 8.1, changeLabel: 'vs mes anterior', icon: 'Percent', trend: 'up' },
  { title: 'Facturas Pendientes', value: '23', change: -15, changeLabel: 'vs semana pasada', icon: 'FileText', trend: 'down' },
];

export const cashFlowData: ChartData[] = [
  { name: 'Ene', ingresos: 45000, gastos: 32000 },
  { name: 'Feb', ingresos: 52000, gastos: 35000 },
  { name: 'Mar', ingresos: 48000, gastos: 30000 },
  { name: 'Abr', ingresos: 61000, gastos: 38000 },
  { name: 'May', ingresos: 55000, gastos: 42000 },
  { name: 'Jun', ingresos: 67000, gastos: 40000 },
];

export const transactions: Transaction[] = [
  { id: '1', description: 'Venta de productos', amount: 2500, status: 'paid', date: '2024-01-15', customer: 'Tech Solutions' },
  { id: '2', description: 'Servicios de consultoría', amount: 5000, status: 'pending', date: '2024-01-14', customer: 'Global Corp' },
  { id: '3', description: 'Licencia de software', amount: 1200, status: 'paid', date: '2024-01-13', customer: 'StartUp Inc' },
  { id: '4', description: 'Mantenimiento mensual', amount: 800, status: 'rejected', date: '2024-01-12', customer: 'Local Business' },
  { id: '5', description: 'Desarrollo web', amount: 3500, status: 'pending', date: '2024-01-11', customer: 'Digital Agency' },
];

// Health Data
export const healthKPIs: KPICardData[] = [
  { title: 'Pacientes en Espera', value: '12', change: -5, changeLabel: 'vs ayer', icon: 'Users', trend: 'down' },
  { title: 'Citas Hoy', value: '48', change: 15, changeLabel: 'vs promedio', icon: 'Calendar', trend: 'up' },
  { title: 'Doctores Activos', value: '8', icon: 'Stethoscope' },
  { title: 'Urgencias', value: '3', change: 2, changeLabel: 'nuevas', icon: 'AlertTriangle', trend: 'up' },
];

export const patients: Patient[] = [
  { id: '1', name: 'María García', age: 45, priority: 'high', waitTime: '5 min', condition: 'Dolor torácico', doctor: 'Dr. Rodríguez' },
  { id: '2', name: 'Juan López', age: 32, priority: 'medium', waitTime: '15 min', condition: 'Fiebre alta', doctor: 'Dra. Martínez' },
  { id: '3', name: 'Ana Sánchez', age: 28, priority: 'low', waitTime: '25 min', condition: 'Consulta general', doctor: 'Dr. González' },
  { id: '4', name: 'Pedro Ruiz', age: 67, priority: 'high', waitTime: '2 min', condition: 'Dificultad respiratoria', doctor: 'Dr. Rodríguez' },
  { id: '5', name: 'Laura Torres', age: 52, priority: 'medium', waitTime: '20 min', condition: 'Dolor abdominal', doctor: 'Dra. Martínez' },
];

export const bedOccupancyData: ChartData[] = [
  { name: 'UCI', value: 85 },
  { name: 'General', value: 72 },
  { name: 'Pediatría', value: 45 },
  { name: 'Maternidad', value: 60 },
  { name: 'Cirugía', value: 50 },
];

// Vet Data
export const vetKPIs: KPICardData[] = [
  { title: 'Mascotas Ingresadas', value: '15', change: 3, changeLabel: 'hoy', icon: 'Heart', trend: 'up' },
  { title: 'Vacunas Programadas', value: '28', icon: 'Syringe' },
  { title: 'Cirugías en Curso', value: '2', icon: 'Scissors', trend: 'neutral' },
  { title: 'Cola Peluquería', value: '7', change: -2, changeLabel: 'vs ayer', icon: 'Sparkles', trend: 'down' },
];

export const pets: Pet[] = [
  { id: '1', name: 'Max', species: 'Perro', breed: 'Golden Retriever', owner: 'Carlos Mendez', status: 'grooming', nextVaccine: '2024-02-15' },
  { id: '2', name: 'Luna', species: 'Gato', breed: 'Siamés', owner: 'María Fernández', status: 'admitted', nextVaccine: '2024-01-20' },
  { id: '3', name: 'Rocky', species: 'Perro', breed: 'Bulldog', owner: 'José García', status: 'surgery' },
  { id: '4', name: 'Michi', species: 'Gato', breed: 'Persa', owner: 'Ana López', status: 'waiting', nextVaccine: '2024-01-18' },
  { id: '5', name: 'Firulais', species: 'Perro', breed: 'Mestizo', owner: 'Pedro Ruiz', status: 'grooming' },
];

export const petStatsData: ChartData[] = [
  { name: 'Perros', value: 45 },
  { name: 'Gatos', value: 32 },
  { name: 'Aves', value: 12 },
  { name: 'Otros', value: 8 },
];
