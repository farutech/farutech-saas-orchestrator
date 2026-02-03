import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--ft-color-primary,#0EA5A4)] text-[var(--ft-color-primary-foreground,#ffffff)] hover:bg-[var(--ft-color-primary-dark,#0B9B99)]",
        destructive:
          "bg-[var(--ft-color-danger,#EF4444)] text-[var(--ft-color-danger-foreground,#ffffff)] hover:brightness-90",
        outline:
          "border border-[var(--ft-color-muted,#6B7280)] bg-[var(--ft-color-background,#ffffff)] hover:bg-[var(--ft-color-accent,#6366F1)] hover:text-white",
        secondary:
          "bg-[var(--ft-color-accent,#6366F1)] text-white hover:brightness-95",
        ghost: "bg-transparent hover:bg-[var(--ft-color-surface,#f3f4f6)]",
        link: "bg-transparent text-[var(--ft-color-primary,#0EA5A4)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
