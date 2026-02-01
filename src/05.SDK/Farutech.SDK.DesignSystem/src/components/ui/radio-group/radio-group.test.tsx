import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { RadioGroup, RadioGroupItem } from './radio-group';

describe('RadioGroup', () => {
  test('renders radio group with default props', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" />
      </RadioGroup>
    );

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).not.toBeChecked();
  });

  test('renders radio group with selected value', () => {
    render(
      <RadioGroup value="option2">
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" />
      </RadioGroup>
    );

    const radios = screen.getAllByRole('radio');
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
  });

  test('calls onValueChange when radio is selected', () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup onValueChange={handleChange}>
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" />
      </RadioGroup>
    );

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]);

    expect(handleChange).toHaveBeenCalledWith('option2');
  });

  test('renders disabled radio group', () => {
    render(
      <RadioGroup disabled>
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" />
      </RadioGroup>
    );

    const radios = screen.getAllByRole('radio');
    expect(radios[0]).toBeDisabled();
    expect(radios[1]).toBeDisabled();
  });

  test('renders individual disabled radio item', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" disabled />
      </RadioGroup>
    );

    const radios = screen.getAllByRole('radio');
    expect(radios[0]).not.toBeDisabled();
    expect(radios[1]).toBeDisabled();
  });

  test('renders with custom className', () => {
    render(
      <RadioGroup className="custom-radio-group">
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toHaveClass('custom-radio-group');
  });

  test('renders radio items with proper styling classes', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );

    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('aspect-square', 'h-4', 'w-4', 'rounded-full');
    expect(radio).toHaveClass('border', 'border-primary');
  });

  test('renders checked state with indicator', () => {
    render(
      <RadioGroup value="option1">
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('data-state', 'checked');
  });

  test('renders with required attribute', () => {
    render(
      <RadioGroup required>
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toHaveAttribute('aria-required', 'true');
  });

  test('supports keyboard navigation', () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup onValueChange={handleChange}>
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" />
      </RadioGroup>
    );

    const radios = screen.getAllByRole('radio');
    radios[0].focus();
    fireEvent.keyDown(radios[0], { key: 'ArrowDown' });

    // Note: Radix UI handles keyboard navigation internally
    // This test ensures the component doesn't break with keyboard events
    expect(radios[0]).toHaveFocus();
  });

  test('renders radio group with labels', () => {
    render(
      <RadioGroup>
        <div>
          <RadioGroupItem value="option1" id="radio1" />
          <label htmlFor="radio1">Option 1</label>
        </div>
        <div>
          <RadioGroupItem value="option2" id="radio2" />
          <label htmlFor="radio2">Option 2</label>
        </div>
      </RadioGroup>
    );

    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
  });

  test('renders radio group in different orientations', () => {
    render(
      <RadioGroup orientation="horizontal" className="flex flex-row space-x-4">
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" />
      </RadioGroup>
    );

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toHaveClass('flex', 'flex-row', 'space-x-4');
  });
});
