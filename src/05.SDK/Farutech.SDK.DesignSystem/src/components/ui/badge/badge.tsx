import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "border bg-transparent text-foreground",
        highlight: "border bg-primary/10 text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, style, ...props }: BadgeProps) {
  const variantStyle: React.CSSProperties = React.useMemo(() => {
    switch (variant) {
      case "secondary":
        return { backgroundColor: "var(--ft-color-accent)", color: "#ffffff" };
      case "destructive":
        return { backgroundColor: "var(--ft-color-danger)", color: "#ffffff" };
      case "outline":
        return { backgroundColor: "transparent", color: "var(--ft-color-text)", borderColor: "var(--ft-color-muted)" };
      case "highlight":
        return { backgroundColor: "transparent", color: "var(--ft-color-primary)", borderColor: "var(--ft-color-primary)" };
      case "default":
      default:
        return { backgroundColor: "var(--ft-color-primary)", color: "#ffffff" };
    }
  }, [variant]);

  const mergedStyle: React.CSSProperties = { ...variantStyle, ...style };

  return <div className={cn(badgeVariants({ variant }), className)} style={mergedStyle} {...props} />;
}

export { Badge, badgeVariants };
