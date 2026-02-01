import React from 'react';
import { render, screen } from '@testing-library/react';
import { Separator } from './separator';

describe('Separator', () => {
  test('renders horizontal separator', () => {
    const { container } = render(<Separator />);

    const separator = container.querySelector('[data-orientation="horizontal"]');
    expect(separator).toBeInTheDocument();
  });

  test('renders vertical separator', () => {
    const { container } = render(<Separator orientation="vertical" />);

    const separator = container.querySelector('[data-orientation="vertical"]');
    expect(separator).toBeInTheDocument();
  });

  test('renders separator with custom className', () => {
    const { container } = render(<Separator className="custom-separator" />);

    const separator = container.querySelector('.custom-separator');
    expect(separator).toBeInTheDocument();
  });

  test('renders decorative separator', () => {
    const { container } = render(<Separator decorative />);

    const separator = container.querySelector('[role="none"]');
    expect(separator).toBeInTheDocument();
  });

  test('renders non-decorative separator', () => {
    const { container } = render(<Separator decorative={false} />);

    const separator = container.querySelector('[aria-orientation]');
    expect(separator).toBeInTheDocument();
  });

  test('separator has proper accessibility attributes', () => {
    const { container } = render(<Separator />);

    const separator = container.querySelector('[role="separator"]');
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
  });

  test('vertical separator has correct orientation', () => {
    const { container } = render(<Separator orientation="vertical" />);

    const separator = container.querySelector('[aria-orientation="vertical"]');
    expect(separator).toBeInTheDocument();
  });

  test('renders separator with different orientations', () => {
    const { rerender, container } = render(<Separator orientation="horizontal" />);
    expect(container.querySelector('[aria-orientation="horizontal"]')).toBeInTheDocument();

    rerender(<Separator orientation="vertical" />);
    expect(container.querySelector('[aria-orientation="vertical"]')).toBeInTheDocument();
  });

  test('separator handles custom props', () => {
    render(
      <Separator
        orientation="horizontal"
        className="my-separator"
        decorative={false}
      />
    );

    // Should render without errors
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  test('renders separator in different contexts', () => {
    render(
      <div>
        <span>Content 1</span>
        <Separator />
        <span>Content 2</span>
      </div>
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});