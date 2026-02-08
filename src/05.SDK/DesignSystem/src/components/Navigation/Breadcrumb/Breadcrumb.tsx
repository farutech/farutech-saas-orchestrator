import { Fragment } from 'react';
import { cn } from '../../../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
}

export function Breadcrumb({
  items,
  separator = '/',
  maxItems,
  className,
  ...props
}: BreadcrumbProps) {
  const displayItems =
    maxItems && items.length > maxItems
      ? [items[0], { label: '...' }, ...items.slice(-(maxItems - 1))]
      : items;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-sm', className)}
      {...props}
    >
      <ol className="flex items-center space-x-2">
        {displayItems.map((item, index) => (
          <Fragment key={index}>
            <li className="flex items-center">
              {item && item.href ? (
                <a
                  href={item.href}
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </a>
              ) : item ? (
                <span
                  className={cn(
                    'flex items-center',
                    index === displayItems.length - 1
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </span>
              ) : null}
            </li>
            {index < displayItems.length - 1 && (
              <li
                className="text-muted-foreground"
                aria-hidden="true"
              >
                {separator}
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
