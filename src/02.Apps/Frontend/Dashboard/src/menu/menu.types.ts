// ============================================================================
// MENU TYPES - Menu System Type Definitions
// ============================================================================

import type { ComponentType } from 'react';

export interface MenuItem {
  id: string;
  name: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  badge?: number | string;
  permissions?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  icon?: ComponentType<{ className?: string }>;
  items: MenuItem[];
  permissions?: string[];
  order?: number;
}

export interface MenuStructure {
  categories: MenuCategory[];
}
