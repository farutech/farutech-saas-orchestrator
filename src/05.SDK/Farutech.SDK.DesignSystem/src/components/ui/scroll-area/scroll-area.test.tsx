import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScrollArea, ScrollBar } from './scroll-area';

describe('ScrollArea', () => {
  test('renders scroll area with content', () => {
    render(
      <ScrollArea>
        <div>Scrollable content</div>
      </ScrollArea>
    );

    expect(screen.getByText('Scrollable content')).toBeInTheDocument();
  });

  test('renders scroll area with large content', () => {
    const largeContent = Array.from({ length: 20 }, (_, i) => `Line ${i + 1}`).join('\n');

    render(
      <ScrollArea className="h-32">
        <pre>{largeContent}</pre>
      </ScrollArea>
    );

    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 20')).toBeInTheDocument();
  });

  test('renders scroll area with custom className', () => {
    const { container } = render(
      <ScrollArea className="custom-scroll">
        <div>Content</div>
      </ScrollArea>
    );

    const scrollArea = container.querySelector('.custom-scroll');
    expect(scrollArea).toBeInTheDocument();
  });

  test('renders scroll area with horizontal scrollbar', () => {
    render(
      <ScrollArea>
        <div style={{ width: '200%' }}>Wide content</div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );

    expect(screen.getByText('Wide content')).toBeInTheDocument();
  });

  test('renders scroll area with vertical scrollbar', () => {
    render(
      <ScrollArea>
        <div style={{ height: '200%' }}>Tall content</div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    );

    expect(screen.getByText('Tall content')).toBeInTheDocument();
  });

  test('renders scroll area with both scrollbars', () => {
    render(
      <ScrollArea>
        <div style={{ width: '200%', height: '200%' }}>Large content</div>
        <ScrollBar orientation="horizontal" />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    );

    expect(screen.getByText('Large content')).toBeInTheDocument();
  });

  test('scroll area has proper accessibility', () => {
    render(
      <ScrollArea>
        <div>Accessible content</div>
      </ScrollArea>
    );

    const content = screen.getByText('Accessible content');
    expect(content).toBeInTheDocument();
  });

  test('renders scroll area with different orientations', () => {
    const { rerender } = render(
      <ScrollArea>
        <div>Content</div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();

    rerender(
      <ScrollArea>
        <div>Content</div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('scroll area handles empty content', () => {
    render(<ScrollArea />);

    // Should render without crashing
    const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
    expect(scrollArea).toBeInTheDocument();
  });

  test('renders scroll area with complex content', () => {
    render(
      <ScrollArea className="h-40">
        <div>
          <h1>Title</h1>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
          <p>Long paragraph with lots of text that should cause scrolling...</p>
        </div>
      </ScrollArea>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });
});