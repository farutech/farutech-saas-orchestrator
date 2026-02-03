import React from 'react';
import { render, screen } from '@testing-library/react';
import { FarutechLogo } from './FarutechLogo';

describe('FarutechLogo', () => {
  test('renders logo with text by default', () => {
    render(<FarutechLogo />);
    expect(screen.getByText('Farutech')).toBeInTheDocument();
  });

  test('renders PNG image when usePng is true', () => {
    render(<FarutechLogo usePng={true} />);
    const img = screen.getByAltText('Farutech Logo');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/logo.png');
  });

  test('does not render PNG image when usePng is false', () => {
    render(<FarutechLogo usePng={false} />);
    expect(screen.queryByAltText('Farutech Logo')).not.toBeInTheDocument();
  });

  test('renders text when showText is true', () => {
    render(<FarutechLogo showText={true} />);
    expect(screen.getByText('Farutech')).toBeInTheDocument();
  });

  test('does not render text when showText is false', () => {
    render(<FarutechLogo showText={false} />);
    expect(screen.queryByText('Farutech')).not.toBeInTheDocument();
  });

  test('applies correct size classes for small size', () => {
    render(<FarutechLogo size="sm" />);
    const textElement = screen.getByText('Farutech');
    expect(textElement).toHaveClass('text-lg');
  });

  test('applies correct size classes for medium size', () => {
    render(<FarutechLogo size="md" />);
    const textElement = screen.getByText('Farutech');
    expect(textElement).toHaveClass('text-xl');
  });

  test('applies correct size classes for large size', () => {
    render(<FarutechLogo size="lg" />);
    const textElement = screen.getByText('Farutech');
    expect(textElement).toHaveClass('text-2xl');
  });

  test('applies correct size classes for extra large size', () => {
    render(<FarutechLogo size="xl" />);
    const textElement = screen.getByText('Farutech');
    expect(textElement).toHaveClass('text-4xl');
  });

  test('applies custom className', () => {
    render(<FarutechLogo className="custom-class" />);
    const container = screen.getByText('Farutech').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  test('has proper accessibility attributes', () => {
    render(<FarutechLogo />);
    const img = screen.getByAltText('Farutech Logo');
    expect(img).toHaveAttribute('alt', 'Farutech Logo');
  });

  test('renders with correct flex layout', () => {
    render(<FarutechLogo />);
    const container = screen.getByText('Farutech').parentElement;
    expect(container).toHaveClass('flex', 'items-center', 'gap-3');
  });

  test('PNG image has correct styling', () => {
    render(<FarutechLogo size="md" />);
    const img = screen.getByAltText('Farutech Logo');
    expect(img).toHaveClass('object-contain');
    // Inline style height should be set to 40px and width auto
    expect(img.style.height).toBe('40px');
    expect(img.style.width).toBe('auto');
  });

  test('text has correct styling', () => {
    render(<FarutechLogo />);
    const textElement = screen.getByText('Farutech');
    expect(textElement).toHaveClass('font-bold', 'tracking-tight', 'text-foreground');
  });
});