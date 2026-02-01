import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SDKVersionDashboard } from './SDKVersionDashboard';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('SDKVersionDashboard', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  test('renders loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<SDKVersionDashboard />);
    expect(screen.getByText('SDK Versions')).toBeInTheDocument();
  });

  test('renders title and current version section', () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));
    render(<SDKVersionDashboard />);

    expect(screen.getByText('SDK Versions')).toBeInTheDocument();
    expect(screen.getByText(/Currently using:/)).toBeInTheDocument();
  });

  test('displays package icon', () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));
    render(<SDKVersionDashboard />);

    // The Package icon should be present
    const iconContainer = screen.getByRole('generic');
    expect(iconContainer).toBeInTheDocument();
  });

  test('fetches current version from package.json', async () => {
    const mockPackageJson = {
      dependencies: {
        '@farutech/design-system': '2026.01.31.0'
      }
    };

    mockFetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockPackageJson)
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve([])
        })
      );

    render(<SDKVersionDashboard />);

    await waitFor(() => {
      expect(screen.getByText('2026.01.31.0')).toBeInTheDocument();
    });
  });

  test('fetches and displays version tags from GitHub API', async () => {
    const mockTags = [
      {
        name: 'v2026.01.31.0',
        commit: {
          sha: 'abc123456789',
          committer: {
            date: '2026-01-31T10:00:00Z'
          }
        }
      },
      {
        name: 'v2026.01.30.1',
        commit: {
          sha: 'def987654321',
          committer: {
            date: '2026-01-30T10:00:00Z'
          }
        }
      }
    ];

    mockFetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ dependencies: {} })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockTags)
        })
      );

    render(<SDKVersionDashboard />);

    await waitFor(() => {
      expect(screen.getByText('2026.01.31.0')).toBeInTheDocument();
      expect(screen.getByText('2026.01.30.1')).toBeInTheDocument();
    });
  });

  test('filters and processes version tags correctly', async () => {
    const mockTags = [
      {
        name: 'v2026.01.31.0',
        commit: {
          sha: 'abc123456789',
          committer: {
            date: '2026-01-31T10:00:00Z'
          }
        }
      },
      {
        name: 'v2025.12.31.0', // Should be filtered out
        commit: {
          sha: 'def987654321',
          committer: {
            date: '2025-12-31T10:00:00Z'
          }
        }
      }
    ];

    mockFetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ dependencies: {} })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockTags)
        })
      );

    render(<SDKVersionDashboard />);

    await waitFor(() => {
      expect(screen.getByText('2026.01.31.0')).toBeInTheDocument();
      expect(screen.queryByText('2025.12.31.0')).not.toBeInTheDocument();
    });
  });

  test('determines environment correctly', async () => {
    const mockTags = [
      {
        name: 'v2026.01.31.0',
        commit: {
          sha: 'abc123456789',
          committer: {
            date: '2026-01-31T10:00:00Z'
          }
        }
      },
      {
        name: 'v2026.01.30.0-beta',
        commit: {
          sha: 'def987654321',
          committer: {
            date: '2026-01-30T10:00:00Z'
          }
        }
      },
      {
        name: 'v2026.01.29.0-alpha',
        commit: {
          sha: 'ghi987654321',
          committer: {
            date: '2026-01-29T10:00:00Z'
          }
        }
      }
    ];

    mockFetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ dependencies: {} })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockTags)
        })
      );

    render(<SDKVersionDashboard />);

    await waitFor(() => {
      expect(screen.getByText('prod')).toBeInTheDocument();
      expect(screen.getByText('qa')).toBeInTheDocument();
      expect(screen.getByText('dev')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    mockFetch
      .mockImplementationOnce(() =>
        Promise.reject(new Error('Network error'))
      )
      .mockImplementationOnce(() =>
        Promise.reject(new Error('API error'))
      );

    // Mock console.error to avoid test output noise
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<SDKVersionDashboard />);

    // Component should still render without crashing
    expect(screen.getByText('SDK Versions')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  test('displays commit hashes correctly', async () => {
    const mockTags = [
      {
        name: 'v2026.01.31.0',
        commit: {
          sha: 'abc123456789def',
          committer: {
            date: '2026-01-31T10:00:00Z'
          }
        }
      }
    ];

    mockFetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ dependencies: {} })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockTags)
        })
      );

    render(<SDKVersionDashboard />);

    await waitFor(() => {
      expect(screen.getByText('abc1234')).toBeInTheDocument(); // First 7 chars
    });
  });

  test('has proper accessibility structure', () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));
    render(<SDKVersionDashboard />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('SDK Versions');
  });
});