// ============================================================================
// FARUTECH DASHBOARD COMPONENT - Mini-Programa Architecture
// ============================================================================

import * as React from 'react';
import { cn } from '../utils/cn';
import { Button } from './ui/button';
import { Card } from './ui/card';
// import { Badge } from '@/components/ui/badge';
import { Separator } from './ui/separator';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  BarChart3,
  Package,
  Calendar,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  Menu,
  X,
  Home
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type IndustryType = 'erp' | 'health' | 'vet' | 'default';

export interface ModuleConfig {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  component: React.ComponentType;
  permissions?: string[];
  industry?: IndustryType[];
  badge?: string;
  description?: string;
}

export interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavigationItem[];
}

export interface DashboardConfig {
  industry: IndustryType;
  title: string;
  modules: ModuleConfig[];
  navigation: NavigationSection[];
  theme?: 'light' | 'dark' | 'auto';
  layout?: 'sidebar' | 'topbar' | 'minimal';
  showBreadcrumb?: boolean;
  showSearch?: boolean;
  permissions?: string[];
}

// ============================================================================
// DASHBOARD PROVIDER - Context Management
// ============================================================================

interface DashboardContextValue {
  config: DashboardConfig;
  currentModule: ModuleConfig | null;
  currentSection: NavigationSection | null;
  isLoading: boolean;
  setCurrentModule: (module: ModuleConfig | null) => void;
  setCurrentSection: (section: NavigationSection | null) => void;
  navigateToModule: (moduleId: string) => void;
  navigateToSection: (sectionId: string) => void;
}

const DashboardContext = React.createContext<DashboardContextValue | null>(null);

interface DashboardProviderProps {
  config: DashboardConfig;
  children: React.ReactNode;
}

export function DashboardProvider({ config, children }: DashboardProviderProps) {
  const [currentModule, setCurrentModule] = React.useState<ModuleConfig | null>(null);
  const [currentSection, setCurrentSection] = React.useState<NavigationSection | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const navigateToModule = React.useCallback((moduleId: string) => {
    setIsLoading(true);
    const module = config.modules.find(m => m.id === moduleId);
    if (module) {
      setCurrentModule(module);
      // Aquí iría la lógica de navegación real (React Router, etc.)
      console.log(`Navigating to module: ${module.name}`);
    }
    setTimeout(() => setIsLoading(false), 300); // Simular carga
  }, [config.modules]);

  const navigateToSection = React.useCallback((sectionId: string) => {
    const section = config.navigation.find(s => s.id === sectionId);
    setCurrentSection(section || null);
  }, [config.navigation]);

  const value: DashboardContextValue = {
    config,
    currentModule,
    currentSection,
    isLoading,
    setCurrentModule,
    setCurrentSection,
    navigateToModule,
    navigateToSection,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = React.useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

// ============================================================================
// MODULE SELECTOR - Combo para selección dinámica de módulos
// ============================================================================

interface ModuleSelectorProps {
  modules: ModuleConfig[];
  currentModule: ModuleConfig | null;
  onModuleChange: (module: ModuleConfig) => void;
  placeholder?: string;
  className?: string;
}

export function ModuleSelector({
  modules,
  currentModule,
  onModuleChange,
  placeholder = "Seleccionar módulo...",
  className
}: ModuleSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <div className="flex items-center gap-2">
          {currentModule?.icon && (
            <currentModule.icon className="h-4 w-4" />
          )}
          <span>{currentModule?.name || placeholder}</span>
          {currentModule?.badge && (
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold">
              {currentModule.badge}
            </span>
          )}
        </div>
        <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-background border rounded-md shadow-lg z-50">
            <div className="p-2">
              <input
                type="text"
                placeholder="Buscar módulo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md"
              />
            </div>
            <Separator />
            <div className="max-h-60 overflow-y-auto">
              {filteredModules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => {
                    onModuleChange(module);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <module.icon className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">{module.name}</div>
                    {module.description && (
                      <div className="text-xs text-muted-foreground">{module.description}</div>
                    )}
                  </div>
                  {module.badge && (
                    <span className="inline-flex items-center rounded-full border text-foreground px-2 py-0.5 text-xs font-semibold">
                      {module.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

// ============================================================================
// DASHBOARD HEADER - Header configurable
// ============================================================================

interface DashboardHeaderProps {
  title?: string;
  actions?: React.ReactNode;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

export function DashboardHeader({
  title,
  actions,
  showSearch = false,
  onSearch,
  className
}: DashboardHeaderProps) {
  const { config } = useDashboard();

  return (
    <header className={cn("flex items-center justify-between p-4 border-b bg-background", className)}>
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">{title || config.title}</h1>
        {showSearch && (
          <input
            type="text"
            placeholder="Buscar..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="px-3 py-2 text-sm border rounded-md w-64"
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions}
      </div>
    </header>
  );
}

// ============================================================================
// DASHBOARD SIDEBAR - Sidebar con navegación
// ============================================================================

interface DashboardSidebarProps {
  sections: NavigationSection[];
  currentSection?: NavigationSection | null;
  onSectionChange?: (section: NavigationSection) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export function DashboardSidebar({
  sections,
  currentSection,
  onSectionChange,
  collapsed = false,
  onToggleCollapse,
  className
}: DashboardSidebarProps) {
  const { config, navigateToSection } = useDashboard();

  return (
    <aside className={cn(
      "flex flex-col border-r bg-background transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <span className="font-semibold">{config.title}</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-2">
        {sections.map((section) => (
          <div key={section.id}>
            {!collapsed && (
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {section.label}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateToSection(item.id);
                    onSectionChange?.(section);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors",
                    currentSection?.id === section.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="inline-flex items-center rounded-full border border-transparent bg-secondary text-secondary-foreground px-2 py-0.5 text-xs font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

// ============================================================================
// DASHBOARD CONTENT - Área principal de contenido
// ============================================================================

interface DashboardContentProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function DashboardContent({
  children,
  showBreadcrumb = true,
  breadcrumbItems = [],
  className
}: DashboardContentProps) {
  const { config } = useDashboard();

  return (
    <main className={cn("flex-1 flex flex-col min-h-0", className)}>
      {showBreadcrumb && config.showBreadcrumb && (
        <div className="px-6 py-3 border-b bg-background">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Home className="h-4 w-4" />
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                <span>/</span>
                {item.href ? (
                  <a href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </a>
                ) : (
                  <span className="text-foreground font-medium">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      )}
      <div className="flex-1 p-6 overflow-auto">
        <div
          key={breadcrumbItems[breadcrumbItems.length - 1]?.label}
          className="transition-opacity duration-200"
        >
          {children}
        </div>
      </div>
    </main>
  );
}

// ============================================================================
// DASHBOARD COMPONENT PRINCIPAL - Composición completa
// ============================================================================

interface DashboardProps {
  config: DashboardConfig;
  children?: React.ReactNode;
  className?: string;
}

export function Dashboard({ config, children, className }: DashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState<NavigationSection | null>(
    config.navigation[0] || null
  );

  return (
    <DashboardProvider config={config}>
      <div className={cn("flex h-screen bg-background", className)}>
        <DashboardSidebar
          sections={config.navigation}
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader
            showSearch={config.showSearch}
          />
          <DashboardContent
            showBreadcrumb={config.showBreadcrumb}
            breadcrumbItems={[
              { label: 'Dashboard', href: '/' },
              { label: currentSection?.label || 'Home' }
            ]}
          >
            {children || (
              <div className="space-y-6">
                <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
                  <h2 className="text-2xl font-bold mb-4">Bienvenido al Dashboard</h2>
                  <p className="text-muted-foreground">
                    Selecciona un módulo para comenzar a trabajar.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {config.modules.slice(0, 6).map((module) => (
                    <Card key={module.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3">
                        <module.icon className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-semibold">{module.name}</h3>
                          {module.description && (
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </DashboardContent>
        </div>
      </div>
    </DashboardProvider>
  );
}

// ============================================================================
// EXPORTACIÓN DE COMPONENTES
// ============================================================================

Dashboard.Provider = DashboardProvider;
Dashboard.Header = DashboardHeader;
Dashboard.Sidebar = DashboardSidebar;
Dashboard.Content = DashboardContent;
Dashboard.ModuleSelector = ModuleSelector;

export default Dashboard;