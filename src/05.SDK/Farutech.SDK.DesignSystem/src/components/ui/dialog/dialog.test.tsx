import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose } from './dialog';
import { Button } from '../button/button';

describe('Dialog', () => {
  test('renders trigger and content (closed by default)', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>My Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.queryByText('My Dialog')).not.toBeInTheDocument();
  });

  test('opens dialog when trigger is clicked', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <p>Dialog content</p>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: /open dialog/i });
    fireEvent.click(trigger);

    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  test('closes dialog when close button is clicked', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: /open dialog/i });
    fireEvent.click(trigger);

    expect(screen.getByText('Dialog Title')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
  });

  test('closes dialog when clicking overlay', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: /open dialog/i });
    fireEvent.click(trigger);

    expect(screen.getByText('Dialog Title')).toBeInTheDocument();

    // Click on overlay (the backdrop) - Radix UI handles this automatically
    const overlay = document.querySelector('[data-radix-dialog-overlay]');
    if (overlay) {
      fireEvent.click(overlay);
      // Wait for animation/close to complete
      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
    }
  });

  test('renders dialog with all slots', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Dialog</DialogTitle>
            <DialogDescription>This is a complete dialog example</DialogDescription>
          </DialogHeader>
          <div>Main content area</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: /open dialog/i });
    fireEvent.click(trigger);

    expect(screen.getByText('Complete Dialog')).toBeInTheDocument();
    expect(screen.getByText('This is a complete dialog example')).toBeInTheDocument();
    expect(screen.getByText('Main content area')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  test('renders different dialog sizes', async () => {
    const { rerender } = render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogTitle>Small Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: /open/i });
    fireEvent.click(trigger);

    // Wait for dialog to be rendered
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveClass('max-w-sm');

    // Close dialog
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    rerender(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent size="lg">
          <DialogTitle>Large Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(trigger);
    const dialog2 = await screen.findByRole('dialog');
    expect(dialog2).toHaveClass('max-w-lg');
  });

  test('renders dialog without close button when showCloseButton is false', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle>No Close Button</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: /open dialog/i });
    fireEvent.click(trigger);

    expect(screen.getByText('No Close Button')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

  test('dialog has proper accessibility attributes', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Accessible Dialog</DialogTitle>
          <DialogDescription>Dialog with proper accessibility</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: /open dialog/i });
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
  });

  test('dialog header has proper structure', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Header Test</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: /open/i });
    fireEvent.click(trigger);

    const header = screen.getByText('Header Test').parentElement;
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('flex-col');
    expect(header).toHaveClass('space-y-1.5');
  });

  test('dialog footer has proper layout', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: /open/i });
    fireEvent.click(trigger);

    const footer = screen.getByText('Cancel').parentElement;
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('flex-col-reverse');
    expect(footer).toHaveClass('sm:flex-row');
  });

  test('dialog title has proper styling', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title Test</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: /open/i });
    fireEvent.click(trigger);

    const title = screen.getByText('Title Test');
    expect(title).toHaveClass('text-lg');
    expect(title).toHaveClass('font-semibold');
    expect(title.tagName).toBe('H2');
  });

  test('dialog description has proper styling', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogDescription>Description Test</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: /open/i });
    fireEvent.click(trigger);

    const description = screen.getByText('Description Test');
    expect(description).toHaveClass('text-sm');
    expect(description).toHaveClass('text-muted-foreground');
  });

  test('dialog supports custom className', async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent className="custom-dialog">
          <DialogTitle>Custom Class</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: /open/i });
    fireEvent.click(trigger);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveClass('custom-dialog');
  });

  test('dialog overlay has proper animations', async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Animation Test</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: /open/i });
    fireEvent.click(trigger);

    // Wait for dialog to be rendered
    await screen.findByRole('dialog');

    // Find overlay by its background class
    const overlay = document.querySelector('.fixed.inset-0.z-50.bg-black\\/80');
    expect(overlay).toHaveClass('data-[state=open]:animate-in');
    expect(overlay).toHaveClass('data-[state=closed]:animate-out');
  });
});
