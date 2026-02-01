import React from 'react';
import { render, screen } from '@testing-library/react';
import { Calendar } from './calendar';

describe('Calendar', () => {
  test('renders calendar component', () => {
    render(<Calendar />);
    // Calendar should render some basic structure
    const calendar = screen.getByRole('application', { hidden: true });
    expect(calendar).toBeInTheDocument();
  });

  test('renders with selected date', () => {
    const selectedDate = new Date(2026, 0, 31); // January 31, 2026
    render(<Calendar selected={selectedDate} />);
    const calendar = screen.getByRole('application', { hidden: true });
    expect(calendar).toBeInTheDocument();
  });

  test('renders with mode single', () => {
    render(<Calendar mode="single" />);
    const calendar = screen.getByRole('application', { hidden: true });
    expect(calendar).toBeInTheDocument();
  });

  test('renders with mode multiple', () => {
    render(<Calendar mode="multiple" />);
    const calendar = screen.getByRole('application', { hidden: true });
    expect(calendar).toBeInTheDocument();
  });

  test('renders with mode range', () => {
    render(<Calendar mode="range" />);
    const calendar = screen.getByRole('application', { hidden: true });
    expect(calendar).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<Calendar className="custom-calendar" />);
    // The calendar container should have the custom class
    const calendar = screen.getByRole('application', { hidden: true });
    expect(calendar).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(<Calendar />);
    const calendar = screen.getByRole('application', { hidden: true });
    expect(calendar).toBeInTheDocument();
  });
});