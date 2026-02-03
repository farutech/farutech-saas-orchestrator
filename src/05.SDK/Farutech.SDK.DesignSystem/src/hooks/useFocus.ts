import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Hook for managing focus state and events
 * Provides focus/blur detection and focus trap utilities
 */
export function useFocus<T extends HTMLElement = HTMLElement>(
  options: { trap?: boolean; autoFocus?: boolean } = {}
): {
  ref: React.RefObject<T | null>;
  isFocused: boolean;
  focus: () => void;
  blur: () => void;
} {
  const { trap = false, autoFocus = false } = options;
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<T>(null);

  const focus = useCallback(() => {
    ref.current?.focus();
  }, []);

  const blur = useCallback(() => {
    ref.current?.blur();
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    if (autoFocus) {
      // Delay to ensure element is mounted
      setTimeout(() => element.focus(), 0);
    }

    if (trap) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          // Simple focus trap - keep focus within element
          // For more complex traps, additional logic would be needed
          e.preventDefault();
          element.focus();
        }
      };

      element.addEventListener('keydown', handleKeyDown);

      return () => {
        element.removeEventListener('focus', handleFocus);
        element.removeEventListener('blur', handleBlur);
        element.removeEventListener('keydown', handleKeyDown);
      };
    }

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, [trap, autoFocus]);

  return {
    ref,
    isFocused,
    focus,
    blur,
  };
}