import React from 'react';
import { render, screen } from '@testing-library/react';
import { RadioGroup, RadioGroupItem } from './radio-group';

describe('RadioGroup', () => {
  it('renders radio group', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="1" />
      </RadioGroup>
    );

    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBeGreaterThan(0);
  });
});
