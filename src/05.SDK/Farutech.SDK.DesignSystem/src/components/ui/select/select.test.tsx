import React from 'react';
import { render, screen } from '@testing-library/react';
import { Select, SelectTrigger, SelectContent, SelectItem } from './select';

describe('Select', () => {
  it('renders trigger', () => {
    render(
      <Select>
        <SelectTrigger>Choose</SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText('Choose')).toBeInTheDocument();
  });
});
