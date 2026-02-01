import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge', () => {
  test('renders badge with default props', () => {
    render(<Badge>New</Badge>);
    const badge = screen.getByText('New');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full');
  });

  test('renders badge with custom content', () => {
    render(<Badge>Custom Content</Badge>);
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  test('renders badge with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('bg-primary', 'text-primary-foreground');

    rerender(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary', 'text-secondary-foreground');

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText('Destructive')).toHaveClass('bg-destructive', 'text-destructive-foreground');

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toHaveClass('text-foreground');

    rerender(<Badge variant="highlight">Highlight</Badge>);
    expect(screen.getByText('Highlight')).toHaveClass('bg-primary/10', 'text-primary');
  });

  test('renders badge with custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-badge');
  });

  test('renders badge with proper base styling', () => {
    render(<Badge>Test</Badge>);
    const badge = screen.getByText('Test');
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'border');
    expect(badge).toHaveClass('px-2.5', 'py-0.5', 'text-xs', 'font-semibold');
    expect(badge).toHaveClass('transition-colors', 'focus:outline-none', 'focus:ring-2');
  });

  test('renders badge with focus styles', () => {
    render(<Badge>Test</Badge>);
    const badge = screen.getByText('Test');
    expect(badge).toHaveClass('focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2');
  });

  test('renders badge with different content types', () => {
    render(
      <Badge>
        <span>Icon</span>
        Label
      </Badge>
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  test('renders badge with numbers', () => {
    render(<Badge>42</Badge>);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  test('renders badge with special characters', () => {
    render(<Badge>★ Premium</Badge>);
    expect(screen.getByText('★ Premium')).toBeInTheDocument();
  });

  test('renders multiple badges', () => {
    render(
      <div>
        <Badge>One</Badge>
        <Badge>Two</Badge>
        <Badge>Three</Badge>
      </div>
    );
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
  });

  test('renders badge with long text', () => {
    const longText = 'This is a very long badge text that should still render properly';
    render(<Badge>{longText}</Badge>);
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  test('renders badge with empty content', () => {
    const { container } = render(<Badge></Badge>);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('inline-flex');
  });

  test('renders badge with aria-label', () => {
    render(<Badge aria-label="Status badge">Active</Badge>);
    const badge = screen.getByLabelText('Status badge');
    expect(badge).toBeInTheDocument();
  });

  test('renders badge with data attributes', () => {
    render(<Badge data-testid="custom-badge">Test</Badge>);
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
  });
});
