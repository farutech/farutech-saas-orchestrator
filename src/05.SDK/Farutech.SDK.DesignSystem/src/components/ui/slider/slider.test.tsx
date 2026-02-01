import React from 'react';
import { render, screen } from '@testing-library/react';
import { Slider } from './slider';

describe('Slider', () => {
  test('renders slider with default props', () => {
    render(<Slider />);

    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
  });

  test('renders slider with custom value', () => {
    render(<Slider value={[50]} />);

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  test('renders slider with range values', () => {
    render(<Slider value={[20, 80]} />);

    // Just verify the component renders with range values
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  test('renders slider with min and max', () => {
    render(<Slider min={0} max={100} value={[25]} />);

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
    expect(slider).toHaveAttribute('aria-valuenow', '25');
  });

  test('renders slider with step', () => {
    render(<Slider step={5} value={[10]} />);

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '10');
  });

  test('renders disabled slider', () => {
    render(<Slider disabled value={[30]} />);

    // Check for disabled state via data attribute or class
    const slider = document.querySelector('[data-disabled]');
    expect(slider).toBeInTheDocument();
  });

  test('renders slider with custom className', () => {
    const { container } = render(<Slider className="custom-slider" />);

    const slider = container.querySelector('.custom-slider');
    expect(slider).toBeInTheDocument();
  });

  test('slider has proper accessibility attributes', () => {
    render(<Slider value={[40]} min={0} max={100} />);

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
    expect(slider).toHaveAttribute('aria-valuenow', '40');
  });

  test('renders slider with different orientations', () => {
    const { rerender } = render(<Slider orientation="horizontal" value={[50]} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();

    rerender(<Slider orientation="vertical" value={[50]} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  test('renders slider with multiple thumbs', () => {
    render(<Slider value={[25, 75]} />);

    // Just verify the component renders with multiple values
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  test('slider handles edge values', () => {
    render(<Slider value={[0]} min={0} max={100} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0');

    // Test max value
    // Note: This would require rerendering with new props
  });

  test('renders slider with all props', () => {
    render(
      <Slider
        value={[33]}
        min={0}
        max={100}
        step={1}
        disabled={false}
        orientation="horizontal"
        className="test-slider"
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '33');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
  });
});