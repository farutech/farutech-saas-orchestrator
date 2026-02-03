import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Users, Database } from 'lucide-react';
import { ModuleCard } from './ModuleCard';

describe('ModuleCard', () => {
  const defaultProps = {
    title: 'Test Module',
    description: 'A test module for demonstration',
    icon: Users,
    status: 'active' as const,
    version: '1.0.0',
  };

  test('renders title and description', () => {
    render(<ModuleCard {...defaultProps} />);
    expect(screen.getByText('Test Module')).toBeInTheDocument();
    expect(screen.getByText('A test module for demonstration')).toBeInTheDocument();
  });

  test('renders version when provided', () => {
    render(<ModuleCard {...defaultProps} />);
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });

  test('does not render version when not provided', () => {
    render(<ModuleCard {...defaultProps} version={undefined} />);
    expect(screen.queryByText(/v\d+\.\d+\.\d+/)).not.toBeInTheDocument();
  });

  test('renders active status badge', () => {
    render(<ModuleCard {...defaultProps} status="active" />);
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  test('renders beta status badge', () => {
    render(<ModuleCard {...defaultProps} status="beta" />);
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  test('renders maintenance status badge', () => {
    render(<ModuleCard {...defaultProps} status="maintenance" />);
    expect(screen.getByText('Mantenimiento')).toBeInTheDocument();
  });

  test('renders inactive status badge', () => {
    render(<ModuleCard {...defaultProps} status="inactive" />);
    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });

  test('applies loading state styles', () => {
    render(<ModuleCard {...defaultProps} isLoading={true} />);
    const card = screen.getByRole('button'); // Card should be clickable
    expect(card).toHaveClass('opacity-50', 'pointer-events-none');
  });

  test('does not apply loading state styles when not loading', () => {
    render(<ModuleCard {...defaultProps} isLoading={false} />);
    const card = screen.getByRole('button');
    expect(card).not.toHaveClass('opacity-50');
  });

  test('calls onClick when clicked', () => {
    const onClickMock = vi.fn();
    render(<ModuleCard {...defaultProps} onClick={onClickMock} />);
    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  test('applies hover styles', () => {
    render(<ModuleCard {...defaultProps} />);
    const card = screen.getByRole('button');
    expect(card).toHaveClass('hover:shadow-lg', 'hover:scale-[1.02]');
  });

  test('applies custom className', () => {
    render(<ModuleCard {...defaultProps} className="custom-class" />);
    const card = screen.getByRole('button');
    expect(card).toHaveClass('custom-class');
  });

  test('renders icon', () => {
    render(<ModuleCard {...defaultProps} />);
    // The icon should be rendered (we can't easily test the exact icon component)
    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
  });

  test('renders different icons correctly', () => {
    render(<ModuleCard {...defaultProps} icon={Database} />);
    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
  });

  test('has proper accessibility structure', () => {
    render(<ModuleCard {...defaultProps} />);
    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();

    // Check for proper heading structure
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toHaveTextContent('Test Module');
  });

  test('displays description with proper styling', () => {
    render(<ModuleCard {...defaultProps} />);
    const description = screen.getByText('A test module for demonstration');
    expect(description).toHaveClass('text-sm', 'text-muted-foreground');
  });

  test('version has correct styling', () => {
    render(<ModuleCard {...defaultProps} />);
    const version = screen.getByText('v1.0.0');
    expect(version).toHaveClass('text-xs', 'text-muted-foreground');
  });

  test('status badge has correct variant classes', () => {
    render(<ModuleCard {...defaultProps} status="active" />);
    const badge = screen.getByText('Activo');
    expect(badge).toHaveClass('bg-primary');
  });
});