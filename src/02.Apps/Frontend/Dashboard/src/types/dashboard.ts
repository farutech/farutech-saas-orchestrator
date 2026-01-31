export type IndustryMode = 'erp' | 'health' | 'vet';

export interface KPICardData {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'rejected';
  date: string;
  customer: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  priority: 'high' | 'medium' | 'low';
  waitTime: string;
  condition: string;
  doctor: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  owner: string;
  nextVaccine?: string;
  status: 'admitted' | 'grooming' | 'surgery' | 'waiting';
  avatar?: string;
}

export interface ChartData {
  name: string;
  value?: number;
  ingresos?: number;
  gastos?: number;
  [key: string]: string | number | undefined;
}

export interface NavItem {
  title: string;
  icon: string;
  href: string;
  badge?: number;
}
