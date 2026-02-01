import React from 'react';
import { render, screen } from '@testing-library/react';
import { AnalyticsDashboard } from './AnalyticsDashboard';

describe('AnalyticsDashboard', () => {
  test('renders SDK Usage Analytics title', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText('SDK Usage Analytics')).toBeInTheDocument();
  });

  test('displays total installs metric', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('Total Installs')).toBeInTheDocument();
  });

  test('displays active projects metric', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
  });

  test('displays latest version metric', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText('2026.01.31.0')).toBeInTheDocument();
    expect(screen.getByText('Latest Version')).toBeInTheDocument();
  });

  test('renders three metric cards', () => {
    render(<AnalyticsDashboard />);
    const cards = screen.getAllByRole('generic').filter(
      element => element.className?.includes('bg-white')
    );
    expect(cards).toHaveLength(3);
  });

  test('has proper accessibility structure', () => {
    render(<AnalyticsDashboard />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('SDK Usage Analytics');
  });
});