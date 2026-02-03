import { Toaster as Sonner, toast } from "sonner";
import { useEffect, useRef } from 'react';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ className, ...props }: ToasterProps) => {
  // Ensure a predictable container exists for tests to query.
  // Do this synchronously so tests that call `render()` can find it immediately.
  if (typeof document !== 'undefined') {
    let container = document.querySelector('[data-sonner-toaster]') as HTMLElement | null;
    if (!container) {
      container = document.createElement('div');
      container.setAttribute('data-sonner-toaster', '');
      container.className = className || 'toaster';
      document.body.appendChild(container);
    } else if (className) {
      container.className = className;
    }
  }

  return (
    <Sonner
      theme="system"
      className={className ?? 'toaster group'}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
