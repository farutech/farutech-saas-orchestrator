import React from 'react';
import { render, screen } from '@testing-library/react';
import { Toggle } from './toggle';

describe('Toggle', () => {
  test('renders toggle with default props', () => {
    render(<Toggle>Toggle me</Toggle>);

    const toggle = screen.getByRole('button');
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('Toggle me')).toBeInTheDocument();
  });

  test('renders pressed toggle', () => {
    render(<Toggle pressed>Pressed Toggle</Toggle>);

    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Pressed Toggle')).toBeInTheDocument();
  });

  test('renders disabled toggle', () => {
    render(<Toggle disabled>Disabled Toggle</Toggle>);

    const toggle = screen.getByRole('button');
    expect(toggle).toBeDisabled();
    expect(screen.getByText('Disabled Toggle')).toBeInTheDocument();
  });

  test('renders toggle with custom className', () => {
    const { container } = render(<Toggle className="custom-toggle">Custom</Toggle>);

    const toggle = container.querySelector('.custom-toggle');
    expect(toggle).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  test('toggle has proper accessibility attributes', () => {
    render(<Toggle aria-label="Test toggle">Content</Toggle>);

    const toggle = screen.getByLabelText('Test toggle');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  test('renders toggle with different states', () => {
    const { rerender } = render(<Toggle pressed={false}>Toggle</Toggle>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');

    rerender(<Toggle pressed={true}>Toggle</Toggle>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  test('renders toggle with size variants', () => {
    const { rerender } = render(<Toggle size="sm">Small</Toggle>);
    expect(screen.getByText('Small')).toBeInTheDocument();

    rerender(<Toggle size="lg">Large</Toggle>);
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  test('renders toggle with variant', () => {
    render(<Toggle variant="outline">Outlined</Toggle>);

    expect(screen.getByText('Outlined')).toBeInTheDocument();
  });

  test('renders toggle with complex content', () => {
    render(
      <Toggle>
        <span>Icon</span>
        <span>Toggle with Icon</span>
      </Toggle>
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Toggle with Icon')).toBeInTheDocument();
  });

  test('renders toggle with all props', () => {
    render(
      <Toggle
        pressed={true}
        disabled={false}
        size="default"
        variant="default"
        className="test-toggle"
        aria-label="Test toggle"
      >
        Full Toggle
      </Toggle>
    );

    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(toggle).toHaveClass('test-toggle');
    expect(screen.getByText('Full Toggle')).toBeInTheDocument();
  });
});