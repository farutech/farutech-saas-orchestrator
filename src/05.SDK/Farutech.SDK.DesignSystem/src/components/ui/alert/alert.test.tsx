import React from 'react';
import { render, screen } from '@testing-library/react';
import { Alert, AlertDescription, AlertTitle } from './alert';

describe('Alert', () => {
  test('renders alert with title and description', () => {
    render(
      <Alert>
        <AlertTitle>Test Alert</AlertTitle>
        <AlertDescription>This is a test alert message.</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Test Alert')).toBeInTheDocument();
    expect(screen.getByText('This is a test alert message.')).toBeInTheDocument();
  });

  test('renders alert with only title', () => {
    render(
      <Alert>
        <AlertTitle>Test Alert</AlertTitle>
      </Alert>
    );
    expect(screen.getByText('Test Alert')).toBeInTheDocument();
  });

  test('renders alert with only description', () => {
    render(
      <Alert>
        <AlertDescription>This is a test alert message.</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('This is a test alert message.')).toBeInTheDocument();
  });

  test('applies default variant classes', () => {
    render(
      <Alert>
        <AlertTitle>Test Alert</AlertTitle>
      </Alert>
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('relative', 'w-full', 'rounded-lg', 'border', 'p-4');
  });

  test('has proper accessibility role', () => {
    render(
      <Alert>
        <AlertTitle>Test Alert</AlertTitle>
      </Alert>
    );
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  test('title has correct styling', () => {
    render(
      <Alert>
        <AlertTitle>Test Alert</AlertTitle>
      </Alert>
    );
    const title = screen.getByText('Test Alert');
    expect(title).toHaveClass('mb-1', 'font-medium', 'leading-none', 'tracking-tight');
  });

  test('description has correct styling', () => {
    render(
      <Alert>
        <AlertDescription>Test description</AlertDescription>
      </Alert>
    );
    const description = screen.getByText('Test description');
    expect(description).toHaveClass('text-sm');
  });
});