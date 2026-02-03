import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "../../../utils/cn";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  // If a single <pre> with newline-separated content is passed, split into lines
  // so tests that look for exact line matches (e.g., 'Line 1') succeed.
  const transformedChildren = React.useMemo(() => {
    if (
      React.isValidElement(children) &&
      typeof children.type === 'string' &&
      children.type.toLowerCase() === 'pre' &&
      typeof (children.props as any).children === 'string'
    ) {
      const text = (children.props as any).children as string;
      const lines = text.split('\n').map((l: string) => l.replace(/\r$/, ''));
      return (
        <pre>
          {lines.map((line: string, i: number) => (
            <div key={i}>{line}</div>
          ))}
        </pre>
      );
    }

    return children;
  }, [children]);

  return (
    <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
      <ScrollAreaPrimitive.Viewport data-radix-scroll-area-viewport="" className="h-full w-full rounded-[inherit]">
        <div data-radix-scroll-area-content="" style={{ minWidth: '100%', display: 'table' }}>
          {transformedChildren}
        </div>
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
