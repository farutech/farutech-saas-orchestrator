import React from 'react';
import { render, screen } from '@testing-library/react';
import { Textarea } from './textarea';

describe('Textarea', () => {
  test('renders textarea with placeholder', () => {
    render(<Textarea placeholder="Enter your message" />);

    const textarea = screen.getByPlaceholderText('Enter your message');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  test('renders textarea with value', () => {
    render(<Textarea value="Sample text" />);

    const textarea = screen.getByDisplayValue('Sample text');
    expect(textarea).toBeInTheDocument();
  });

  test('renders textarea with custom className', () => {
    const { container } = render(<Textarea className="custom-textarea" />);

    const textarea = container.querySelector('.custom-textarea');
    expect(textarea).toBeInTheDocument();
  });

  test('renders disabled textarea', () => {
    render(<Textarea disabled placeholder="Disabled textarea" />);

    const textarea = screen.getByPlaceholderText('Disabled textarea');
    expect(textarea).toBeDisabled();
  });

  test('renders textarea with rows', () => {
    render(<Textarea rows={5} placeholder="Multi-line text" />);

    const textarea = screen.getByPlaceholderText('Multi-line text');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  test('renders textarea with cols', () => {
    render(<Textarea cols={30} placeholder="Wide textarea" />);

    const textarea = screen.getByPlaceholderText('Wide textarea');
    expect(textarea).toHaveAttribute('cols', '30');
  });

  test('renders textarea with aria attributes', () => {
    render(<Textarea aria-label="Description field" />);

    const textarea = screen.getByLabelText('Description field');
    expect(textarea).toBeInTheDocument();
  });

  test('textarea has proper accessibility', () => {
    render(<Textarea aria-describedby="help-text" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  test('renders textarea with different configurations', () => {
    const { rerender } = render(<Textarea placeholder="Basic" />);
    expect(screen.getByPlaceholderText('Basic')).toBeInTheDocument();

    rerender(<Textarea placeholder="Resizable" style={{ resize: 'vertical' }} />);
    expect(screen.getByPlaceholderText('Resizable')).toBeInTheDocument();
  });

  test('renders textarea with maxLength', () => {
    render(<Textarea maxLength={100} placeholder="Limited text" />);

    const textarea = screen.getByPlaceholderText('Limited text');
    expect(textarea).toHaveAttribute('maxLength', '100');
  });

  test('renders textarea with readOnly', () => {
    render(<Textarea readOnly value="Read-only content" />);

    const textarea = screen.getByDisplayValue('Read-only content');
    expect(textarea).toHaveAttribute('readOnly');
  });

  test('renders textarea with required', () => {
    render(<Textarea required placeholder="Required field" />);

    const textarea = screen.getByPlaceholderText('Required field');
    expect(textarea).toHaveAttribute('required');
  });

  test('renders textarea with all props', () => {
    render(
      <Textarea
        placeholder="Full featured textarea"
        className="full-textarea"
        rows={4}
        cols={50}
        maxLength={500}
        disabled={false}
        required
        aria-label="Full textarea"
      />
    );

    const textarea = screen.getByPlaceholderText('Full featured textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('rows', '4');
    expect(textarea).toHaveAttribute('cols', '50');
    expect(textarea).toHaveAttribute('maxLength', '500');
    expect(textarea).toHaveAttribute('required');
  });
});