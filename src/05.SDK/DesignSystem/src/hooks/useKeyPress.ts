import { useEffect, useCallback } from 'react';

export function useKeyPress(
  targetKey: string,
  onKeyPress: (event: KeyboardEvent) => void,
  options: {
    enabled?: boolean;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
  } = {}
) {
  const { enabled = true, ctrl = false, shift = false, alt = false } = options;

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const keyMatch = event.key === targetKey;
      const ctrlMatch = ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
      const altMatch = alt ? event.altKey : !event.altKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        onKeyPress(event);
      }
    },
    [targetKey, onKeyPress, ctrl, shift, alt]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress, enabled]);
}
