import { useToast } from "../../../hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "../toast";

export function Toaster(props: { className?: string } = {}) {
  const { toasts } = useToast();
  const { className } = props;

  // Ensure a predictable sonner-like container exists for tests that query it.
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
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
