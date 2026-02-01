import { renderHook, act } from '@testing-library/react';
import { useInstanceNavigation } from './useInstanceNavigation';

// Mock window.location and localStorage
const mockLocation = {
  hostname: 'app.farutech.com',
  href: 'https://app.farutech.com/dashboard',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock window.open
Object.defineProperty(window, 'open', {
  value: vi.fn(),
  writable: true,
});

describe('useInstanceNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset location
    mockLocation.hostname = 'app.farutech.com';
    mockLocation.href = 'https://app.farutech.com/dashboard';
  });

  test('returns navigation functions', () => {
    const { result } = renderHook(() => useInstanceNavigation());

    expect(result.current.navigateToInstance).toBeDefined();
    expect(result.current.buildInstanceUrl).toBeDefined();
    expect(result.current.getCurrentInstance).toBeDefined();
    expect(result.current.isValidInstance).toBeDefined();
    expect(result.current.getAvailableInstances).toBeDefined();
  });

  test('getCurrentInstance returns correct instance', () => {
    const { result } = renderHook(() => useInstanceNavigation());

    const currentInstance = result.current.getCurrentInstance();
    expect(currentInstance).toEqual({
      id: 'prod',
      name: 'Production',
      baseUrl: 'https://app.farutech.com',
      region: 'us-east-1',
    });
  });

  test('getCurrentInstance returns null for unknown hostname', () => {
    mockLocation.hostname = 'unknown.farutech.com';

    const { result } = renderHook(() => useInstanceNavigation());

    const currentInstance = result.current.getCurrentInstance();
    expect(currentInstance).toBeNull();
  });

  test('isValidInstance returns true for valid instance', () => {
    const { result } = renderHook(() => useInstanceNavigation());

    expect(result.current.isValidInstance('prod')).toBe(true);
    expect(result.current.isValidInstance('staging')).toBe(true);
    expect(result.current.isValidInstance('dev')).toBe(true);
  });

  test('isValidInstance returns false for invalid instance', () => {
    const { result } = renderHook(() => useInstanceNavigation());

    expect(result.current.isValidInstance('invalid')).toBe(false);
    expect(result.current.isValidInstance('')).toBe(false);
  });

  test('getAvailableInstances returns all instances', () => {
    const { result } = renderHook(() => useInstanceNavigation());

    const instances = result.current.getAvailableInstances();
    expect(instances).toHaveLength(3);
    expect(instances).toEqual([
      { id: 'prod', name: 'Production', baseUrl: 'https://app.farutech.com', region: 'us-east-1' },
      { id: 'staging', name: 'Staging', baseUrl: 'https://staging.farutech.com', region: 'us-west-2' },
      { id: 'dev', name: 'Development', baseUrl: 'https://dev.farutech.com', region: 'us-central-1' },
    ]);
  });

  test('buildInstanceUrl builds correct URL without path or params', () => {
    const { result } = renderHook(() => useInstanceNavigation());

    const url = result.current.buildInstanceUrl('prod');
    expect(url).toBe('https://app.farutech.com/');
  });

  test('buildInstanceUrl builds correct URL with path', () => {
    const { result } = renderHook(() => useInstanceNavigation());

    const url = result.current.buildInstanceUrl('staging', '/dashboard');
    expect(url).toBe('https://staging.farutech.com/dashboard');
  });

  test('buildInstanceUrl builds correct URL with params', () => {
    const { result } = renderHook(() => useInstanceNavigation());

    const url = result.current.buildInstanceUrl('dev', '/users', { page: '1', sort: 'name' });
    expect(url).toBe('https://dev.farutech.com/users?page=1&sort=name');
  });

  test('buildInstanceUrl throws error for invalid instance', () => {
    const { result } = renderHook(() => useInstanceNavigation());

    expect(() => result.current.buildInstanceUrl('invalid', '/test')).toThrow('Instance invalid not found');
  });

  test('navigateToInstance navigates to instance with default options', () => {
    const { result } = renderHook(() => useInstanceNavigation());

    act(() => {
      result.current.navigateToInstance('staging', '/dashboard');
    });

    expect(window.location.href).toBe('https://staging.farutech.com/dashboard');
  });

  test('navigateToInstance preserves session token by default', () => {
    // Mock localStorage to return a session token
    vi.mocked(window.localStorage.getItem).mockReturnValue('mock-session-token');

    const { result } = renderHook(() => useInstanceNavigation());

    act(() => {
      result.current.navigateToInstance('dev', '/profile');
    });

    expect(window.location.href).toBe('https://dev.farutech.com/profile?sessionToken=mock-session-token');
  });

  test('navigateToInstance does not preserve session when disabled', () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue('mock-session-token');

    const { result } = renderHook(() => useInstanceNavigation());

    act(() => {
      result.current.navigateToInstance('prod', '/settings', { preserveSession: false });
    });

    expect(window.location.href).toBe('https://app.farutech.com/settings');
  });

  test('navigateToInstance opens in new tab when target is _blank', () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue('mock-session-token');

    const { result } = renderHook(() => useInstanceNavigation());

    act(() => {
      result.current.navigateToInstance('staging', '/reports', { target: '_blank' });
    });

    expect(window.open).toHaveBeenCalledWith('https://staging.farutech.com/reports?sessionToken=mock-session-token', '_blank');
  });

  test('navigateToInstance includes custom params', () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue('mock-session-token');

    const { result } = renderHook(() => useInstanceNavigation());

    act(() => {
      result.current.navigateToInstance('dev', '/search', {
        params: { query: 'test', filter: 'active' }
      });
    });

    expect(window.location.href).toBe('https://dev.farutech.com/search?query=test&filter=active&sessionToken=mock-session-token');
  });

  test('navigateToInstance throws error for invalid instance', () => {
    const { result } = renderHook(() => useInstanceNavigation());

    expect(() => {
      act(() => {
        result.current.navigateToInstance('invalid');
      });
    }).toThrow('Invalid instance: invalid');
  });
});