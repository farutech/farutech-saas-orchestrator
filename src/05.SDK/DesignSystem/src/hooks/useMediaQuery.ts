import { useState, useEffect } from 'react';

export interface UseMediaQueryOptions {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
}

export function useMediaQuery(
  query: string,
  options: UseMediaQueryOptions = {}
): boolean {
  const { defaultValue = false, initializeWithValue = true } = options;

  const getMatches = (query: string): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return defaultValue;
  };

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }
    return defaultValue;
  });

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Update on mount
    setMatches(getMatches(query));

    const handleChange = () => {
      setMatches(getMatches(query));
    };

    // Use modern addEventListener if available
    if (matchMedia.addEventListener) {
      matchMedia.addEventListener('change', handleChange);
      return () => {
        matchMedia.removeEventListener('change', handleChange);
      };
    } else {
      // Fallback for older browsers
      matchMedia.addListener(handleChange);
      return () => {
        matchMedia.removeListener(handleChange);
      };
    }
  }, [query]);

  return matches;
}

// Convenience hooks for common breakpoints
export function useIsMobile() {
  return useMediaQuery('(max-width: 768px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1025px)');
}
