// ============================================================================
// MENU BUILDER - Dynamic Menu Construction from MPs
// ============================================================================

import type { MpConfig } from '../types/mp.types';
import type { MenuCategory, MenuItem, MenuStructure } from './menu.types';
import * as HeroIcons from '@heroicons/react/24/outline';

export class MenuBuilder {
  private mps: MpConfig[] = [];
  private userPermissions: string[] = [];

  constructor(userPermissions: string[] = []) {
    this.userPermissions = userPermissions;
  }

  /**
   * Registra MPs en el builder
   */
  registerMps(mps: MpConfig[]): this {
    this.mps = mps.filter(mp => mp.enabled !== false);
    return this;
  }

  /**
   * Verifica si el usuario tiene permisos
   */
  private hasPermissions(required?: string[]): boolean {
    if (!required || required.length === 0) return true;
    return required.some(perm => this.userPermissions.includes(perm));
  }

  /**
   * Obtiene el ícono desde Heroicons
   */
  private getIcon(iconName: string) {
    const Icon = (HeroIcons as any)[iconName];
    return Icon || HeroIcons.Square3Stack3DIcon;
  }

  /**
   * Construye el menú desde los MPs registrados
   */
  build(): MenuStructure {
    // Agrupar MPs por categoría
    const categoriesMap = new Map<string, MenuItem[]>();

    this.mps
      .filter(mp => this.hasPermissions(mp.permissions))
      .sort((a, b) => (a.order || 999) - (b.order || 999))
      .forEach(mp => {
        const category = mp.category || 'General';
        
        if (!categoriesMap.has(category)) {
          categoriesMap.set(category, []);
        }

        const menuItem: MenuItem = {
          id: mp.id,
          name: mp.name,
          href: mp.basePath,
          icon: this.getIcon(mp.icon),
          permissions: mp.permissions,
        };

        categoriesMap.get(category)!.push(menuItem);
      });

    // Convertir a estructura de categorías
    const categories: MenuCategory[] = Array.from(categoriesMap.entries()).map(
      ([name, items], index) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        icon: this.getCategoryIcon(name),
        items,
        order: index,
      })
    );

    return { categories };
  }

  /**
   * Obtiene ícono por defecto para categoría
   */
  private getCategoryIcon(categoryName: string) {
    const iconMap: Record<string, any> = {
      'CRM': HeroIcons.UserGroupIcon,
      'Ventas': HeroIcons.ShoppingCartIcon,
      'Inventario': HeroIcons.CubeIcon,
      'Reportes': HeroIcons.ChartBarIcon,
      'Configuración': HeroIcons.Cog6ToothIcon,
      'General': HeroIcons.Square3Stack3DIcon,
    };

    return iconMap[categoryName] || HeroIcons.Square3Stack3DIcon;
  }

  /**
   * Obtiene configuración de un MP por ID
   */
  getMpById(id: string): MpConfig | undefined {
    return this.mps.find(mp => mp.id === id);
  }

  /**
   * Obtiene MP por ruta
   */
  getMpByPath(path: string): MpConfig | undefined {
    return this.mps.find(mp => path.startsWith(mp.basePath));
  }
}
