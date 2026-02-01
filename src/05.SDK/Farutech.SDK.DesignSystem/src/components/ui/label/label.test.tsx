import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from './label';

describe('Label', () => {
  test('renders label with text', () => {
    render(<Label>Test Label</Label>);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  test('renders label with htmlFor attribute', () => {
    render(<Label htmlFor="test-input">Input Label</Label>);

    const label = screen.getByText('Input Label');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  test('renders label with custom className', () => {
    const { container } = render(<Label className="custom-label">Custom Label</Label>);

    const label = container.querySelector('.custom-label');
    expect(label).toBeInTheDocument();
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  test('renders label associated with input', () => {
    render(
      <div>
        <Label htmlFor="username">Username</Label>
        <input id="username" />
      </div>
    );

    const label = screen.getByText('Username');
    const input = screen.getByRole('textbox');

    expect(label).toHaveAttribute('for', 'username');
    expect(input).toHaveAttribute('id', 'username');
  });

  test('label has proper accessibility role', () => {
    render(<Label>Accessible Label</Label>);

    const label = screen.getByText('Accessible Label');
    expect(label.tagName).toBe('LABEL');
  });

  test('renders label with nested elements', () => {
    render(
      <Label>
        <span>Icon</span>
        Label with Icon
      </Label>
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Label with Icon')).toBeInTheDocument();
  });

  test('renders label with all props', () => {
    render(
      <Label htmlFor="test" className="test-label">
        Complete Label
      </Label>
    );

    const label = screen.getByText('Complete Label');
    expect(label).toHaveAttribute('for', 'test');
    expect(label).toHaveClass('test-label');
  });
});