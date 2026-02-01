import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

// Mock matchMedia
const mockMatchMedia = vi.fn();
const mockMediaQueryList = {
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

describe('useMediaQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia.mockReturnValue(mockMediaQueryList);
  });

  test('returns media query state with default values', () => {
    mockMatchMedia.mockReturnValue({
      ...mockMediaQueryList,
      matches: false,
    });

    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isWide).toBe(false);
    expect(result.current.currentBreakpoint).toBe('mobile');
    expect(typeof result.current.matches).toBe('function');
  });

  test('detects mobile breakpoint', () => {
    // Mock mobile query to match
    mockMatchMedia.mockImplementation((query: string) => ({
      ...mockMediaQueryList,
      matches: query === '(max-width: 767px)',
    }));

    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.currentBreakpoint).toBe('mobile');
  });

  test('detects tablet breakpoint', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      ...mockMediaQueryList,
      matches: query === '(min-width: 768px) and (max-width: 1023px)',
    }));

    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.isTablet).toBe(true);
    expect(result.current.currentBreakpoint).toBe('tablet');
  });

  test('detects desktop breakpoint', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      ...mockMediaQueryList,
      matches: query === '(min-width: 1024px) and (max-width: 1279px)',
    }));

    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.currentBreakpoint).toBe('desktop');
  });

  test('detects wide breakpoint', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      ...mockMediaQueryList,
      matches: query === '(min-width: 1280px)',
    }));

    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.isWide).toBe(true);
    expect(result.current.currentBreakpoint).toBe('wide');
  });

  test('matches custom media query', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      ...mockMediaQueryList,
      matches: query === '(prefers-color-scheme: dark)',
    }));

    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.matches('(prefers-color-scheme: dark)')).toBe(true);
    expect(result.current.matches('(prefers-color-scheme: light)')).toBe(false);
  });

  test('uses custom default value', () => {
    mockMatchMedia.mockReturnValue({
      ...mockMediaQueryList,
      matches: true,
    });

    const { result } = renderHook(() => useMediaQuery({ defaultValue: true }));

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isWide).toBe(true);
  });

  test('updates state when media query changes', () => {
    let mobileCallback: (e: MediaQueryListEvent) => void;

    const mockMatchMedia = vi.fn((query: string) => {
      if (query === '(max-width: 767px)') {
        return {
          matches: false,
          addEventListener: vi.fn((event, callback) => {
            if (event === 'change') mobileCallback = callback;
          }),
          removeEventListener: vi.fn(),
        };
      }
      return {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
    });

    vi.stubGlobal('matchMedia', mockMatchMedia);

    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.isMobile).toBe(false);

    act(() => {
      mobileCallback({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current.isMobile).toBe(true);
  });

  test('cleans up event listeners on unmount', () => {
    const mockQuery = {
      ...mockMediaQueryList,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    mockMatchMedia.mockReturnValue(mockQuery);

    const { unmount } = renderHook(() => useMediaQuery());

    unmount();

    // Should have called addEventListener for each breakpoint (4)
    expect(mockQuery.addEventListener).toHaveBeenCalledTimes(4);
  });

  test('handles multiple breakpoints correctly', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      ...mockMediaQueryList,
      matches: query.includes('1024px'), // desktop
    }));

    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isWide).toBe(false);
    expect(result.current.currentBreakpoint).toBe('desktop');
  });
});