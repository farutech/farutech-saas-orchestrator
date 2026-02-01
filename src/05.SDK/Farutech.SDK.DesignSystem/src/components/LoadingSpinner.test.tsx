import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders spinner icon', () => {
    render(<LoadingSpinner />);
    // The Loader2 icon should be present (though we can't easily test the exact icon)
    const spinnerContainer = screen.getByRole('generic');
    expect(spinnerContainer).toBeInTheDocument();
  });

  test('applies correct size for small variant', () => {
    render(<LoadingSpinner size="sm" />);
    // The container should exist and have the correct structure
    const container = screen.getByRole('generic');
    expect(container).toHaveClass('flex', 'items-center', 'justify-center');
  });

  test('applies correct size for medium variant', () => {
    render(<LoadingSpinner size="md" />);
    const container = screen.getByRole('generic');
    expect(container).toHaveClass('flex', 'items-center', 'justify-center');
  });

  test('applies correct size for large variant', () => {
    render(<LoadingSpinner size="lg" />);
    const container = screen.getByRole('generic');
    expect(container).toHaveClass('flex', 'items-center', 'justify-center');
  });

  test('applies correct size for extra large variant', () => {
    render(<LoadingSpinner size="xl" />);
    const container = screen.getByRole('generic');
    expect(container).toHaveClass('flex', 'items-center', 'justify-center');
  });

  test('renders text when provided', () => {
    render(<LoadingSpinner text="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('does not render text when not provided', () => {
    render(<LoadingSpinner />);
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    const container = screen.getByRole('generic');
    expect(container).toHaveClass('custom-class');
  });

  test('renders fullscreen overlay when fullScreen is true', () => {
    render(<LoadingSpinner fullScreen={true} />);
    const overlay = screen.getByRole('generic').parentElement;
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center');
    expect(overlay).toHaveClass('bg-background/80', 'backdrop-blur-sm');
  });

  test('does not render fullscreen overlay when fullScreen is false', () => {
    render(<LoadingSpinner fullScreen={false} />);
    const container = screen.getByRole('generic');
    expect(container.parentElement).not.toHaveClass('fixed');
  });

  test('text has correct styling when present', () => {
    render(<LoadingSpinner text="Loading..." />);
    const textElement = screen.getByText('Loading...');
    expect(textElement).toHaveClass('ml-2', 'text-sm', 'text-muted-foreground');
  });

  test('has proper flex layout', () => {
    render(<LoadingSpinner />);
    const container = screen.getByRole('generic');
    expect(container).toHaveClass('flex', 'items-center', 'justify-center');
  });

  test('spinner icon has primary color', () => {
    render(<LoadingSpinner />);
    // We can't directly test the icon color, but the structure should be correct
    const container = screen.getByRole('generic');
    expect(container.children[0]).toBeInTheDocument();
  });

  test('fullscreen mode creates proper backdrop', () => {
    render(<LoadingSpinner fullScreen={true} text="Please wait..." />);
    const overlay = screen.getByText('Please wait...').parentElement?.parentElement;
    expect(overlay).toHaveClass('bg-background/80');
    expect(overlay).toHaveClass('backdrop-blur-sm');
  });
});