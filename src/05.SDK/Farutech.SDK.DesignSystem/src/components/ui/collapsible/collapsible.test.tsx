import React from 'react';
import { render, screen } from '@testing-library/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

describe('Collapsible', () => {
  test('renders collapsible with trigger and content', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Hidden content</CollapsibleContent>
      </Collapsible>
    );

    expect(screen.getByText('Toggle')).toBeInTheDocument();
  });

  test('renders trigger button', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Open section</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole('button', { name: 'Open section' });
    expect(trigger).toBeInTheDocument();
  });

  test('content is initially hidden', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Hidden content</CollapsibleContent>
      </Collapsible>
    );

    // Content should not be visible initially
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  test('renders with defaultOpen true', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Visible content</CollapsibleContent>
      </Collapsible>
    );

    // Content should be visible when defaultOpen is true
    expect(screen.getByText('Visible content')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});