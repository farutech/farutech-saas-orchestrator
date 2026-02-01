import React from 'react';
import { render, screen } from '@testing-library/react';
import { Toaster, toast } from './sonner';

describe('Sonner', () => {
  test('renders toaster component', () => {
    render(<Toaster />);

    // Toaster should be in the document
    const toaster = document.querySelector('[data-sonner-toaster]');
    expect(toaster).toBeInTheDocument();
  });

  test('renders toaster with custom position', () => {
    render(<Toaster position="top-center" />);

    const toaster = document.querySelector('[data-sonner-toaster]');
    expect(toaster).toBeInTheDocument();
  });

  test('renders toaster with different themes', () => {
    const { rerender } = render(<Toaster theme="light" />);
    expect(document.querySelector('[data-sonner-toaster]')).toBeInTheDocument();

    rerender(<Toaster theme="dark" />);
    expect(document.querySelector('[data-sonner-toaster]')).toBeInTheDocument();
  });

  test('renders toaster with custom className', () => {
    render(<Toaster className="custom-toaster" />);

    const toaster = document.querySelector('.custom-toaster');
    expect(toaster).toBeInTheDocument();
  });

  test('toaster has proper structure', () => {
    render(<Toaster />);

    const toaster = document.querySelector('[data-sonner-toaster]');
    expect(toaster).toBeInTheDocument();
  });

  test('renders toaster with different positions', () => {
    const positions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];

    positions.forEach(position => {
      const { rerender } = render(<Toaster position={position as any} />);
      const toaster = document.querySelector('[data-sonner-toaster]');
      expect(toaster).toBeInTheDocument();
    });
  });

  test('renders toaster with rich colors', () => {
    render(<Toaster richColors />);

    const toaster = document.querySelector('[data-sonner-toaster]');
    expect(toaster).toBeInTheDocument();
  });

  test('renders toaster with close button', () => {
    render(<Toaster closeButton />);

    const toaster = document.querySelector('[data-sonner-toaster]');
    expect(toaster).toBeInTheDocument();
  });

  test('renders toaster with custom duration', () => {
    render(<Toaster duration={5000} />);

    const toaster = document.querySelector('[data-sonner-toaster]');
    expect(toaster).toBeInTheDocument();
  });

  test('renders toaster with visible toasts', () => {
    render(<Toaster visibleToasts={3} />);

    const toaster = document.querySelector('[data-sonner-toaster]');
    expect(toaster).toBeInTheDocument();
  });

  test('toaster handles different configurations', () => {
    render(
      <Toaster
        position="bottom-right"
        theme="dark"
        richColors
        closeButton
        duration={4000}
        visibleToasts={5}
        className="test-toaster"
      />
    );

    const toaster = document.querySelector('.test-toaster');
    expect(toaster).toBeInTheDocument();
  });

  test('renders toaster in different contexts', () => {
    render(
      <div>
        <h1>App Content</h1>
        <Toaster />
      </div>
    );

    expect(screen.getByText('App Content')).toBeInTheDocument();
    const toaster = document.querySelector('[data-sonner-toaster]');
    expect(toaster).toBeInTheDocument();
  });
});