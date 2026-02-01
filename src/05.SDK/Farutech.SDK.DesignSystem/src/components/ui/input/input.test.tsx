import React from 'react';
import { render, screen } from '@testing-library/react';
import { Input } from './input';

describe('Input', () => {
  test('renders input with placeholder', () => {
    render(<Input placeholder="Enter text" />);

    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  test('renders input with custom type', () => {
    render(<Input type="email" placeholder="Enter email" />);

    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toHaveAttribute('type', 'email');
  });

  test('renders input with value', () => {
    render(<Input value="test value" />);

    const input = screen.getByDisplayValue('test value');
    expect(input).toBeInTheDocument();
  });

  test('renders input with custom className', () => {
    const { container } = render(<Input className="custom-input" />);

    const input = container.querySelector('.custom-input');
    expect(input).toBeInTheDocument();
  });

  test('renders disabled input', () => {
    render(<Input disabled placeholder="Disabled input" />);

    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
  });

  test('renders input with aria attributes', () => {
    render(<Input aria-label="Test input" />);

    const input = screen.getByLabelText('Test input');
    expect(input).toBeInTheDocument();
  });

  test('handles different input types', () => {
    const { rerender } = render(<Input type="password" placeholder="Password" />);
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');

    rerender(<Input type="number" placeholder="Number" />);
    expect(screen.getByPlaceholderText('Number')).toHaveAttribute('type', 'number');

    rerender(<Input type="search" placeholder="Search" />);
    expect(screen.getByPlaceholderText('Search')).toHaveAttribute('type', 'search');
  });

  test('input has proper accessibility', () => {
    render(<Input aria-describedby="description" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  test('renders input with all props', () => {
    render(
      <Input
        type="text"
        placeholder="Full featured input"
        className="full-input"
        disabled={false}
        value=""
      />
    );

    const input = screen.getByPlaceholderText('Full featured input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });
});