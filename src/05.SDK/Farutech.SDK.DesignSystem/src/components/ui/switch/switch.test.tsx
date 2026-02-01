import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Switch } from './switch';

describe('Switch', () => {
  test('renders switch with default props', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).not.toBeChecked();
  });

  test('renders checked switch', () => {
    render(<Switch checked />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeChecked();
  });

  test('renders unchecked switch', () => {
    render(<Switch checked={false} />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).not.toBeChecked();
  });

  test('toggles checked state when clicked', () => {
    const handleChange = vi.fn();
    render(<Switch onCheckedChange={handleChange} />);

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  test('calls onCheckedChange with correct value', () => {
    const handleChange = vi.fn();
    render(<Switch checked onCheckedChange={handleChange} />);

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect(handleChange).toHaveBeenCalledWith(false);
  });

  test('renders disabled switch', () => {
    render(<Switch disabled />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeDisabled();
  });

  test('prevents interaction when disabled', () => {
    const handleChange = vi.fn();
    render(<Switch disabled onCheckedChange={handleChange} />);

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect(handleChange).not.toHaveBeenCalled();
  });

  test('renders with custom className', () => {
    render(<Switch className="custom-switch" />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('custom-switch');
  });

  test('renders with proper styling classes', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('inline-flex', 'h-6', 'w-11', 'shrink-0', 'cursor-pointer');
    expect(switchElement).toHaveClass('rounded-full', 'border-2', 'border-transparent');
    expect(switchElement).toHaveClass('data-[state=unchecked]:bg-input');
  });

  test('renders checked state with proper styling', () => {
    render(<Switch checked />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('data-state', 'checked');
    expect(switchElement).toHaveClass('data-[state=checked]:bg-primary');
  });

  test('renders with id and associates with label', () => {
    render(
      <>
        <Switch id="test-switch" />
        <label htmlFor="test-switch">Test Label</label>
      </>
    );
    const switchElement = screen.getByRole('switch');
    const label = screen.getByText('Test Label');

    expect(switchElement).toHaveAttribute('id', 'test-switch');
    expect(label).toHaveAttribute('for', 'test-switch');
  });

  test('supports aria-label', () => {
    render(<Switch aria-label="Test switch" />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-label', 'Test switch');
  });

  test('supports required attribute', () => {
    render(<Switch required />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-required', 'true');
  });

  test('renders thumb with proper styling', () => {
    render(<Switch />);
    // The thumb is a child element of the switch
    const switchElement = screen.getByRole('switch');
    const thumb = switchElement.querySelector('span');
    expect(thumb).toHaveClass('block', 'h-5', 'w-5', 'rounded-full', 'bg-background');
    expect(thumb).toHaveClass('data-[state=checked]:translate-x-5');
  });

  test('renders with value attribute', () => {
    render(<Switch value="on" />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('value', 'on');
  });
});
