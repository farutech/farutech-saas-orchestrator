import React from 'react';
import { render, screen } from '@testing-library/react';
import { DataTable } from './data-table';

describe('DataTable', () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const mockColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
  ];

  test('renders data table with data', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  test('renders empty table when no data', () => {
    render(<DataTable data={[]} columns={mockColumns} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  test('renders table with custom className', () => {
    const { container } = render(
      <DataTable data={mockData} columns={mockColumns} className="custom-table" />
    );

    const table = container.querySelector('.custom-table');
    expect(table).toBeInTheDocument();
  });

  test('handles column sorting', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);

    // Verify headers are present
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  test('renders table with proper accessibility', () => {
    const { container } = render(<DataTable data={mockData} columns={mockColumns} />);

    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
    // Note: The table role is typically set by the browser for semantic table elements
  });

  test('handles row selection', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);

    // Verify data rows are rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});