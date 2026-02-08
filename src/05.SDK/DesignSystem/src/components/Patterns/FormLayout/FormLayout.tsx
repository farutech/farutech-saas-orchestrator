import { Container } from '../../Layout/Container';
import { Stack } from '../../Layout/Stack';
import { cn } from '../../../utils/cn';

export interface FormLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  sections?: {
    title?: string;
    description?: string;
    children: React.ReactNode;
  }[];
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function FormLayout({
  title,
  description,
  sections,
  footer,
  maxWidth = 'lg',
  children,
  className,
  ...props
}: FormLayoutProps) {
  return (
    <Container maxWidth={maxWidth} className={cn('py-8', className)} {...props}>
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="mt-2 text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <Stack spacing={8}>
        {sections
          ? sections.map((section, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card p-6 shadow-sm"
              >
                {(section.title || section.description) && (
                  <div className="mb-6">
                    {section.title && (
                      <h3 className="text-lg font-semibold">
                        {section.title}
                      </h3>
                    )}
                    {section.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    )}
                  </div>
                )}
                {section.children}
              </div>
            ))
          : children && (
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                {children}
              </div>
            )}

        {footer && (
          <div className="flex justify-end gap-3 border-t pt-6">
            {footer}
          </div>
        )}
      </Stack>
    </Container>
  );
}
