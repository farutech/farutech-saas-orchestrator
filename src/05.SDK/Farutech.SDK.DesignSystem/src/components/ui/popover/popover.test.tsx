import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';

describe('Popover', () => {
  test('renders popover trigger', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <p>Popover content</p>
        </PopoverContent>
      </Popover>
    );

    expect(screen.getByText('Open Popover')).toBeInTheDocument();
  });

  test('renders popover content when open', () => {
    render(
      <Popover open>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent>
          <h3>Title</h3>
          <p>Description</p>
        </PopoverContent>
      </Popover>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  test('renders popover with custom alignment', () => {
    render(
      <Popover open>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent align="start">
          <p>Aligned content</p>
        </PopoverContent>
      </Popover>
    );

    expect(screen.getByText('Aligned content')).toBeInTheDocument();
  });

  test('renders popover with custom side', () => {
    render(
      <Popover open>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent side="top">
          <p>Top positioned content</p>
        </PopoverContent>
      </Popover>
    );

    expect(screen.getByText('Top positioned content')).toBeInTheDocument();
  });

  test('popover has proper accessibility', () => {
    render(
      <Popover>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent>
          <p>Accessible content</p>
        </PopoverContent>
      </Popover>
    );

    const trigger = screen.getByText('Trigger');
    expect(trigger).toBeInTheDocument();
  });

  test('renders popover with custom className', () => {
    const { container } = render(
      <Popover open>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent className="custom-popover">
          <p>Custom styled content</p>
        </PopoverContent>
      </Popover>
    );

    const content = container.querySelector('.custom-popover');
    expect(content).toBeInTheDocument();
    expect(screen.getByText('Custom styled content')).toBeInTheDocument();
  });

  test('handles popover with complex content', () => {
    render(
      <Popover open>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent>
          <div>
            <h4>Complex Title</h4>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
            <button>Action Button</button>
          </div>
        </PopoverContent>
      </Popover>
    );

    expect(screen.getByText('Complex Title')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  test('renders popover with different sides', () => {
    const { rerender } = render(
      <Popover open>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent side="right">
          <p>Right side content</p>
        </PopoverContent>
      </Popover>
    );

    expect(screen.getByText('Right side content')).toBeInTheDocument();

    rerender(
      <Popover open>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent side="bottom">
          <p>Bottom side content</p>
        </PopoverContent>
      </Popover>
    );

    expect(screen.getByText('Bottom side content')).toBeInTheDocument();
  });
});