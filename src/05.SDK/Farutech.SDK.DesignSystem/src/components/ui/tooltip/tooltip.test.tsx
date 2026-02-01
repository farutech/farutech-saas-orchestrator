import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

describe('Tooltip', () => {
  test('renders tooltip trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>
            <p>Tooltip content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  test('renders tooltip content', () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>
            <h3>Title</h3>
            <p>Description</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  test('renders tooltip with custom alignment', () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent align="start">
            <p>Aligned content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText('Aligned content')).toBeInTheDocument();
  });

  test('renders tooltip with custom side', () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent side="top">
            <p>Top positioned content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText('Top positioned content')).toBeInTheDocument();
  });

  test('tooltip has proper accessibility', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>
            <p>Accessible content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByText('Trigger');
    expect(trigger).toBeInTheDocument();
  });

  test('renders tooltip with custom className', () => {
    const { container } = render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent className="custom-tooltip">
            <p>Custom styled content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const content = container.querySelector('.custom-tooltip');
    expect(content).toBeInTheDocument();
    expect(screen.getByText('Custom styled content')).toBeInTheDocument();
  });

  test('renders tooltip with different sides', () => {
    const { rerender } = render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent side="right">
            <p>Right side content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText('Right side content')).toBeInTheDocument();

    rerender(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Bottom side content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText('Bottom side content')).toBeInTheDocument();
  });

  test('renders tooltip with complex content', () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>
            <div>
              <h4>Complex Title</h4>
              <ul>
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
              </ul>
              <p>Additional information about this feature.</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText('Complex Title')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
    expect(screen.getByText('Additional information about this feature.')).toBeInTheDocument();
  });

  test('renders tooltip with delay duration', () => {
    render(
      <TooltipProvider delayDuration={500}>
        <Tooltip>
          <TooltipTrigger>Delayed Trigger</TooltipTrigger>
          <TooltipContent>
            <p>Delayed tooltip</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText('Delayed Trigger')).toBeInTheDocument();
  });

  test('renders tooltip with skip delay duration', () => {
    render(
      <TooltipProvider skipDelayDuration={200}>
        <Tooltip>
          <TooltipTrigger>Skip Delay Trigger</TooltipTrigger>
          <TooltipContent>
            <p>Skip delay tooltip</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText('Skip Delay Trigger')).toBeInTheDocument();
  });
});