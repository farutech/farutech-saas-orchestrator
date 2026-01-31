import React from 'react';
import { render, screen } from '@testing-library/react';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders checkbox', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });
});
