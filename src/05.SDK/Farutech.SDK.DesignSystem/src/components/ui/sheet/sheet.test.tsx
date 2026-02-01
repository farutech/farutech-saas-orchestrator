import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

describe('Sheet', () => {
  test('renders sheet trigger', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet description</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Open Sheet')).toBeInTheDocument();
  });

  test('renders sheet content when open', () => {
    render(
      <Sheet open>
        <SheetTrigger>Trigger</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Test Title</SheetTitle>
          </SheetHeader>
          <p>Sheet content</p>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Sheet content')).toBeInTheDocument();
  });

  test('renders sheet with all sections', () => {
    render(
      <Sheet open>
        <SheetTrigger>Trigger</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Description</SheetDescription>
          </SheetHeader>
          <div>Main content</div>
          <SheetFooter>
            <SheetClose>Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  test('renders sheet with different sides', () => {
    const { rerender } = render(
      <Sheet open>
        <SheetTrigger>Trigger</SheetTrigger>
        <SheetContent side="right">
          <p>Right sheet content</p>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Right sheet content')).toBeInTheDocument();

    rerender(
      <Sheet open>
        <SheetTrigger>Trigger</SheetTrigger>
        <SheetContent side="bottom">
          <p>Bottom sheet content</p>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Bottom sheet content')).toBeInTheDocument();
  });

  test('sheet has proper accessibility attributes', () => {
    render(
      <Sheet open>
        <SheetTrigger>Trigger</SheetTrigger>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    const title = screen.getByText('Title');
    expect(title).toBeInTheDocument();
  });

  test('renders sheet close button', () => {
    render(
      <Sheet open>
        <SheetTrigger>Trigger</SheetTrigger>
        <SheetContent>
          <SheetFooter>
            <SheetClose>Close Button</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Close Button')).toBeInTheDocument();
  });

  test('renders sheet with custom className', () => {
    const { container } = render(
      <Sheet open>
        <SheetTrigger>Trigger</SheetTrigger>
        <SheetContent className="custom-sheet">
          <p>Custom styled content</p>
        </SheetContent>
      </Sheet>
    );

    const content = container.querySelector('.custom-sheet');
    expect(content).toBeInTheDocument();
    expect(screen.getByText('Custom styled content')).toBeInTheDocument();
  });

  test('handles sheet with complex content', () => {
    render(
      <Sheet open>
        <SheetTrigger>Trigger</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Complex Sheet</SheetTitle>
            <SheetDescription>With multiple sections</SheetDescription>
          </SheetHeader>
          <div>
            <h4>Section 1</h4>
            <p>Content for section 1</p>
            <h4>Section 2</h4>
            <p>Content for section 2</p>
          </div>
          <SheetFooter>
            <button>Action 1</button>
            <SheetClose>Cancel</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Complex Sheet')).toBeInTheDocument();
    expect(screen.getByText('With multiple sections')).toBeInTheDocument();
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});