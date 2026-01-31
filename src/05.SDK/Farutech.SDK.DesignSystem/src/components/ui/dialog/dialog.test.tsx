import React from 'react';
import { render, screen } from '@testing-library/react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from './dialog';

describe('Dialog', () => {
  it('renders trigger and content (closed by default)', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>My Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});
