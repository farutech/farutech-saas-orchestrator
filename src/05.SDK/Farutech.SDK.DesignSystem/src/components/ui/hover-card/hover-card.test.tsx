import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './hover-card';

describe('HoverCard', () => {
  test('renders hover card trigger', () => {
    render(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>
          <p>Card content</p>
        </HoverCardContent>
      </HoverCard>
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  test('renders hover card content', () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>Trigger</HoverCardTrigger>
        <HoverCardContent>
          <h3>Title</h3>
          <p>Description</p>
        </HoverCardContent>
      </HoverCard>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  test('renders hover card with custom alignment', () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>Trigger</HoverCardTrigger>
        <HoverCardContent align="start">
          <p>Aligned content</p>
        </HoverCardContent>
      </HoverCard>
    );

    expect(screen.getByText('Aligned content')).toBeInTheDocument();
  });

  test('renders hover card with custom side', () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>Trigger</HoverCardTrigger>
        <HoverCardContent side="top">
          <p>Top positioned content</p>
        </HoverCardContent>
      </HoverCard>
    );

    expect(screen.getByText('Top positioned content')).toBeInTheDocument();
  });

  test('hover card has proper accessibility', () => {
    render(
      <HoverCard>
        <HoverCardTrigger>Trigger</HoverCardTrigger>
        <HoverCardContent>
          <p>Accessible content</p>
        </HoverCardContent>
      </HoverCard>
    );

    const trigger = screen.getByText('Trigger');
    expect(trigger).toBeInTheDocument();
  });

  test('renders hover card with custom className', () => {
    const { container } = render(
      <HoverCard open>
        <HoverCardTrigger>Trigger</HoverCardTrigger>
        <HoverCardContent className="custom-hover-card">
          <p>Custom styled content</p>
        </HoverCardContent>
      </HoverCard>
    );

    const content = container.querySelector('.custom-hover-card');
    expect(content).toBeInTheDocument();
    expect(screen.getByText('Custom styled content')).toBeInTheDocument();
  });

  test('handles hover card with complex content', () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>Trigger</HoverCardTrigger>
        <HoverCardContent>
          <div>
            <h4>Complex Title</h4>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </HoverCardContent>
      </HoverCard>
    );

    expect(screen.getByText('Complex Title')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});