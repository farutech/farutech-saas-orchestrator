import '@testing-library/jest-dom';

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  constructor(cb: ResizeObserverCallback) {
    this.cb = cb;
  }
  cb: ResizeObserverCallback;
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Cached, instrumented matchMedia helper so tests can spy and dispatch events reliably
declare global {
  interface Window {
    __setMatchMediaMatches?: (query: string, matches: boolean) => void;
    __clearMatchMediaCache?: () => void;
  }
}

const mediaQueryCache = new Map<string, any>();

function createMQL(query: string) {
  let matches = false;
  const listeners = new Set<(e: { matches: boolean }) => void>();

  const mql: any = {
    matches,
    media: query,
    onchange: null,
    addListener(fn: (e: { matches: boolean }) => void) {
      listeners.add(fn);
    },
    removeListener(fn: (e: { matches: boolean }) => void) {
      listeners.delete(fn);
    },
    addEventListener(_type: string, fn: (e: { matches: boolean }) => void) {
      listeners.add(fn);
    },
    removeEventListener(_type: string, fn: (e: { matches: boolean }) => void) {
      listeners.delete(fn);
    },
    dispatchEvent(e: { matches: boolean }) {
      listeners.forEach((l) => l(e));
      if (typeof mql.onchange === 'function') {
        try {
          mql.onchange(e as any);
        } catch (err) {
          // ignore
        }
      }
      return true;
    },
    // Test helper to set matches and notify listeners
    setMatches(value: boolean) {
      mql.matches = value;
      mql.dispatchEvent({ matches: value });
    },
  };

  return mql;
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: (query: string) => {
    if (!mediaQueryCache.has(query)) {
      mediaQueryCache.set(query, createMQL(query));
    }
    return mediaQueryCache.get(query);
  },
});

// Expose a test helper to set matches for a query from tests
window.__setMatchMediaMatches = (query: string, matches: boolean) => {
  if (!mediaQueryCache.has(query)) mediaQueryCache.set(query, createMQL(query));
  const m = mediaQueryCache.get(query);
  m.setMatches(matches);
};

window.__clearMatchMediaCache = () => mediaQueryCache.clear();

// Expose factory for tests to create an instrumented MediaQueryList
// Tests can call `window.__createMatchMedia(query)` to get an object
// whose add/remove listeners are spied and which can dispatch events.
window.__createMatchMedia = (query: string) => {
  if (!mediaQueryCache.has(query)) mediaQueryCache.set(query, createMQL(query));
  return mediaQueryCache.get(query);
};

// Expose internal cache for debugging and advanced test control
window.__matchMediaCache = mediaQueryCache;

// Mock IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];
  
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
} as any;

// Mock requestAnimationFrame
globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 16);
globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id);

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
});

// Mock HTMLDialogElement methods
HTMLDialogElement.prototype.showModal = function() {};
HTMLDialogElement.prototype.close = function() {};

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOMTestUtils')
  ) {
    return;
  }
  originalConsoleError.call(console, ...args);
};
