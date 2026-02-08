// ============================================================================
// UNIVERSAL SIDEBAR - Dynamic sidebar with app-specific navigation
// ============================================================================

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LucideIcon,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface SidebarNavItem {
  id: string;
  label: string;
  href?: string;
  icon?: LucideIcon;
  badge?: string | number;
  badgeVariant?: 'default' | 'destructive' | 'success';
  children?: SidebarNavItem[];
  dividerBefore?: boolean;
  permission?: string;
}

export interface SidebarSection {
  id: string;
  label?: string;
  items: SidebarNavItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

interface UniversalSidebarProps {
  sections: SidebarSection[];
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  // Permission check function
  hasPermission?: (permission: string) => boolean;
}

// ============================================================================
// Component
// ============================================================================

export function UniversalSidebar({
  sections,
  isCollapsed = false,
  onCollapsedChange,
  logo,
  footer,
  className,
  hasPermission = () => true,
}: UniversalSidebarProps) {
  const location = useLocation();

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const filterByPermission = (items: SidebarNavItem[]): SidebarNavItem[] => {
    return items.filter((item) => {
      if (item.permission && !hasPermission(item.permission)) return false;
      if (item.children) {
        item.children = filterByPermission(item.children);
      }
      return true;
    });
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'fixed left-0 top-0 z-30 flex h-screen flex-col border-r bg-sidebar-background text-sidebar-foreground',
        className
      )}
    >
      {/* Header / Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!isCollapsed && logo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              {logo}
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => onCollapsedChange?.(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {sections.map((section) => {
            const filteredItems = filterByPermission(section.items);
            if (filteredItems.length === 0) return null;

            return (
              <div key={section.id}>
                {section.label && !isCollapsed && (
                  <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                    {section.label}
                  </p>
                )}
                
                <ul className="space-y-1">
                  {filteredItems.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      isCollapsed={isCollapsed}
                      isActive={isActive}
                    />
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {footer && !isCollapsed && (
        <div className="border-t border-sidebar-border p-4">
          {footer}
        </div>
      )}
    </motion.aside>
  );
}

// ============================================================================
// NavItem Component
// ============================================================================

interface NavItemProps {
  item: SidebarNavItem;
  isCollapsed: boolean;
  isActive: (href?: string) => boolean;
  depth?: number;
}

function NavItem({ item, isCollapsed, isActive, depth = 0 }: NavItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const active = isActive(item.href);
  const Icon = item.icon;

  // Check if any child is active
  const hasActiveChild = React.useMemo(() => {
    if (!item.children) return false;
    const checkActive = (items: SidebarNavItem[]): boolean => {
      return items.some((child) => {
        if (isActive(child.href)) return true;
        if (child.children) return checkActive(child.children);
        return false;
      });
    };
    return checkActive(item.children);
  }, [item.children, isActive]);

  // Auto-expand if child is active
  React.useEffect(() => {
    if (hasActiveChild) setIsOpen(true);
  }, [hasActiveChild]);

  const content = (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        depth > 0 && 'ml-6'
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          
          {item.badge && (
            <span
              className={cn(
                'ml-auto rounded-full px-2 py-0.5 text-xs',
                item.badgeVariant === 'destructive'
                  ? 'bg-destructive text-destructive-foreground'
                  : item.badgeVariant === 'success'
                  ? 'bg-success text-success-foreground'
                  : 'bg-sidebar-accent text-sidebar-accent-foreground'
              )}
            >
              {item.badge}
            </span>
          )}
          
          {hasChildren && (
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          )}
        </>
      )}
    </div>
  );

  // Collapsed state with tooltip
  if (isCollapsed) {
    return (
      <li>
        {item.dividerBefore && (
          <div className="my-2 border-t border-sidebar-border" />
        )}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {item.href ? (
              <Link to={item.href}>{content}</Link>
            ) : (
              <button className="w-full">{content}</button>
            )}
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.label}
            {item.badge && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {item.badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      </li>
    );
  }

  // Has children - collapsible
  if (hasChildren) {
    return (
      <li>
        {item.dividerBefore && (
          <div className="my-2 border-t border-sidebar-border" />
        )}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full">{content}</button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="mt-1 space-y-1">
              {item.children!.map((child) => (
                <NavItem
                  key={child.id}
                  item={child}
                  isCollapsed={isCollapsed}
                  isActive={isActive}
                  depth={depth + 1}
                />
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </li>
    );
  }

  // Simple link
  return (
    <li>
      {item.dividerBefore && (
        <div className="my-2 border-t border-sidebar-border" />
      )}
      {item.href ? (
        <Link to={item.href}>{content}</Link>
      ) : (
        <button className="w-full">{content}</button>
      )}
    </li>
  );
}
