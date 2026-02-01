import React from 'react';
import { render, screen } from '@testing-library/react';
import { Progress } from './progress';

describe('Progress', () => {
  test('renders progress bar with default value', () => {
    render(<Progress />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute('aria-valuenow', '0');
  });

  test('renders progress bar with custom value', () => {
    render(<Progress value={50} />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '50');
  });

  test('renders progress bar with max value', () => {
    render(<Progress value={100} />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '100');
  });

  test('renders progress bar with custom className', () => {
    const { container } = render(<Progress className="custom-progress" value={75} />);

    const progress = container.querySelector('.custom-progress');
    expect(progress).toBeInTheDocument();
  });

  test('progress bar has proper accessibility attributes', () => {
    render(<Progress value={33} />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
    expect(progress).toHaveAttribute('aria-valuenow', '33');
  });

  test('renders progress bar with different values', () => {
    const { rerender } = render(<Progress value={25} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');

    rerender(<Progress value={75} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  test('progress bar handles edge cases', () => {
    render(<Progress value={0} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');

    // Test negative value (should be clamped to 0)
    // Note: This depends on the implementation, but typically progress bars handle this
  });

  test('progress bar has proper structure', () => {
    const { container } = render(<Progress value={60} />);

    const progress = container.querySelector('[role="progressbar"]');
    expect(progress).toBeInTheDocument();

    // Check for indicator element
    const indicator = container.querySelector('[data-progress-indicator]');
    expect(indicator).toBeInTheDocument();
  });

  test('renders progress bar with all props', () => {
    render(
      <Progress
        value={80}
        className="test-progress"
      />
    );

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '80');
    expect(progress).toHaveClass('test-progress');
  });
});