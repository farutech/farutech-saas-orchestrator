import React from 'react';
import { render, screen } from '@testing-library/react';
import { Switch } from './switch';

describe('Switch', () => {
  it('renders switch', () => {
    render(<Switch />);
    const switches = screen.getAllByRole('switch');
    expect(switches.length).toBeGreaterThanOrEqual(0);
  });
});
