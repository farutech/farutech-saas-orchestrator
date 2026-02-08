/**
 * Card Component - Farutech Design System
 */

import React from 'react'
import { cn } from '../../utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
  footer?: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      header,
      footer,
      padding = 'md',
      hover = false,
      className,
      ...props
    },
    ref
  ) => {
    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'card',
          hover && 'hover:shadow-md transition-shadow cursor-pointer',
          className
        )}
        {...props}
      >
        {header && (
          <div className="px-6 py-4 border-b border-border">
            {header}
          </div>
        )}

        <div className={paddings[padding]}>{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-border bg-muted/50">
            {footer}
          </div>
        )}
      </div>
    )
  }
)

Card.displayName = 'Card'

export interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
