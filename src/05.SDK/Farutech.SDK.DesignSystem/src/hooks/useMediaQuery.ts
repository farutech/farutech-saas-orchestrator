import { useState, useEffect, useCallback } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

export interface MediaQueryOptions {
  defaultValue?: boolean;
  ssr?: boolean;
}

export interface UseMediaQueryReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  currentBreakpoint: Breakpoint;
  matches: (query: string) => boolean;
}

/**
 * Breakpoint definitions following common responsive design patterns
 */
const BREAKPOINTS = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px) and (max-width: 1279px)',
  wide: '(min-width: 1280px)',
} as const;

/**
 * Hook for responsive design using media queries
 * Provides breakpoint detection and custom media query matching
 * SSR-compatible with configurable defaults
 */
export const useMediaQuery = (options: MediaQueryOptions = {}): UseMediaQueryReturn => {
  const { defaultValue = false, ssr = true } = options;

  // State for each breakpoint
  const [isMobile, setIsMobile] = useState<boolean>(defaultValue);
  const [isTablet, setIsTablet] = useState<boolean>(defaultValue);
  const [isDesktop, setIsDesktop] = useState<boolean>(defaultValue);
  const [isWide, setIsWide] = useState<boolean>(defaultValue);

  // Determine current breakpoint based on active media queries
  const currentBreakpoint: Breakpoint = isWide
    ? 'wide'
    : isDesktop
    ? 'desktop'
    : isTablet
    ? 'tablet'
    : 'mobile';

  // Generic media query matcher
  const matches = useCallback((query: string): boolean => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  }, [defaultValue]);

  useEffect(() => {
    // Skip on SSR unless explicitly enabled
    if (typeof window === 'undefined' && !ssr) {
      return;
    }

    // For SSR or initial render, set default values
    if (typeof window === 'undefined') {
      setIsMobile(defaultValue);
      setIsTablet(defaultValue);
      setIsDesktop(defaultValue);
      setIsWide(defaultValue);
      return;
    }

    // Create media query lists
    const mobileQuery = window.matchMedia(BREAKPOINTS.mobile);
    const tabletQuery = window.matchMedia(BREAKPOINTS.tablet);
    const desktopQuery = window.matchMedia(BREAKPOINTS.desktop);
    const wideQuery = window.matchMedia(BREAKPOINTS.wide);

    // Set initial values
    setIsMobile(mobileQuery.matches);
    setIsTablet(tabletQuery.matches);
    setIsDesktop(desktopQuery.matches);
    setIsWide(wideQuery.matches);

    // Event handlers
    const handleMobileChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    const handleTabletChange = (e: MediaQueryListEvent) => setIsTablet(e.matches);
    const handleDesktopChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    const handleWideChange = (e: MediaQueryListEvent) => setIsWide(e.matches);

    // Add listeners
    mobileQuery.addEventListener('change', handleMobileChange);
    tabletQuery.addEventListener('change', handleTabletChange);
    desktopQuery.addEventListener('change', handleDesktopChange);
    wideQuery.addEventListener('change', handleWideChange);

    // Cleanup
    return () => {
      mobileQuery.removeEventListener('change', handleMobileChange);
      tabletQuery.removeEventListener('change', handleTabletChange);
      desktopQuery.removeEventListener('change', handleDesktopChange);
      wideQuery.removeEventListener('change', handleWideChange);
    };
  }, [ssr, defaultValue]);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    currentBreakpoint,
    matches,
  };
};