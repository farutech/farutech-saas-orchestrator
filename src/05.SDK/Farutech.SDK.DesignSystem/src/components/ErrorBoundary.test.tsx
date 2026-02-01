import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

// Component that throws an error
const ErrorThrowingComponent = () => {
  throw new Error('Test error');
};

// Component that doesn't throw an error
const NormalComponent = () => <div>Normal content</div>;

describe('ErrorBoundary', () => {
  // Mock console.error to avoid noise in test output
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  test('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  test('renders fallback UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText('Ha ocurrido un error inesperado. Por favor, intenta recargar la página.')).toBeInTheDocument();
  });

  test('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Algo salió mal')).not.toBeInTheDocument();
  });

  test('calls onError callback when error occurs', () => {
    const onErrorMock = jest.fn();

    render(
      <ErrorBoundary onError={onErrorMock}>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    expect(onErrorMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object)
    );
  });

  test('retry functionality works', async () => {
    let shouldThrow = true;

    const RetryComponent = () => {
      if (shouldThrow) {
        shouldThrow = false;
        throw new Error('Retry test error');
      }
      return <div>Recovered content</div>;
    };

    render(
      <ErrorBoundary>
        <RetryComponent />
      </ErrorBoundary>
    );

    // Initially shows error
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /reintentar/i });
    fireEvent.click(retryButton);

    // Should show recovered content
    await waitFor(() => {
      expect(screen.getByText('Recovered content')).toBeInTheDocument();
    });
  });

  test('has proper accessibility attributes', () => {
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    const alertIcon = screen.getByRole('img', { hidden: true }); // AlertTriangle icon
    expect(alertIcon).toBeInTheDocument();

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Algo salió mal');
  });

  test('logs error to console', () => {
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );
  });
});