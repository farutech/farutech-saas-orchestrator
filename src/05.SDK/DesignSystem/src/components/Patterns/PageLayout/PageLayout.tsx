import { Container } from '../../Layout/Container';
import { Breadcrumb, BreadcrumbItem } from '../../Navigation/Breadcrumb';
import { cn } from '../../../utils/cn';

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  fullWidth?: boolean;
}

export function PageLayout({
  title,
  description,
  breadcrumbs,
  actions,
  sidebar,
  footer,
  fullWidth = false,
  children,
  className,
  ...props
}: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)} {...props}>
      <Container
        maxWidth={fullWidth ? 'full' : '7xl'}
        className="py-6"
        padding="md"
      >
        {breadcrumbs && <Breadcrumb items={breadcrumbs} className="mb-4" />}

        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {description && (
                <p className="mt-2 text-muted-foreground">{description}</p>
              )}
            </div>
            {actions && <div className="flex gap-3">{actions}</div>}
          </div>
        </div>

        <div className={cn('flex gap-6', sidebar ? 'flex-col lg:flex-row' : '')}>
          {sidebar && (
            <aside className="w-full lg:w-64 shrink-0">
              <div className="sticky top-6">
                {sidebar}
              </div>
            </aside>
          )}
          <main className="flex-1 min-w-0">{children}</main>
        </div>

        {footer && (
          <footer className="mt-12 border-t pt-6">{footer}</footer>
        )}
      </Container>
    </div>
  );
}
