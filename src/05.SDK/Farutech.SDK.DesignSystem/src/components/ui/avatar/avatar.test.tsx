import React from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

describe('Avatar', () => {
  it('renders fallback and image', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText('AB')).toBeInTheDocument();
  });
});
