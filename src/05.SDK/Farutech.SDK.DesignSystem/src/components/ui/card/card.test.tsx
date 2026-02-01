import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';

describe('Card', () => {
  test('renders default card with children', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  test('renders card with all slots', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>Main content area</CardContent>
        <CardFooter>Actions or footer content</CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
    expect(screen.getByText('Main content area')).toBeInTheDocument();
    expect(screen.getByText('Actions or footer content')).toBeInTheDocument();
  });

  test('renders card with default variant', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('text-card-foreground');
    expect(card).toHaveClass('shadow-sm'); // default elevation
  });

  test('renders card with outline variant', () => {
    const { container } = render(<Card variant="outline">Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('bg-background');
    expect(card).toHaveClass('border-2');
    expect(card).toHaveClass('text-foreground');
  });

  test('renders card with filled variant', () => {
    const { container } = render(<Card variant="filled">Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('bg-muted');
    expect(card).toHaveClass('text-muted-foreground');
  });

  test('renders card with different elevations', () => {
    const { rerender, container } = render(<Card elevation={0}>Content</Card>);
    let card = container.firstChild as HTMLElement;
    expect(card).not.toHaveClass('shadow-sm');
    expect(card).not.toHaveClass('shadow-md');
    expect(card).not.toHaveClass('shadow-lg');

    rerender(<Card elevation={1}>Content</Card>);
    card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-sm');

    rerender(<Card elevation={2}>Content</Card>);
    card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-md');

    rerender(<Card elevation={3}>Content</Card>);
    card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-lg');
  });

  test('renders card with custom className', () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('custom-card');
    expect(card).toHaveClass('rounded-lg'); // default classes still applied
  });

  test('card header has proper structure', () => {
    const { container } = render(
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
    );
    const header = container.firstChild as HTMLElement;

    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('flex-col');
    expect(header).toHaveClass('space-y-1.5');
    expect(header).toHaveClass('p-6');
  });

  test('card title has proper styling', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    const title = container.firstChild as HTMLElement;

    expect(title).toHaveClass('text-2xl');
    expect(title).toHaveClass('font-semibold');
    expect(title.tagName).toBe('H3');
  });

  test('card description has proper styling', () => {
    const { container } = render(<CardDescription>Description</CardDescription>);
    const description = container.firstChild as HTMLElement;

    expect(description).toHaveClass('text-sm');
    expect(description).toHaveClass('text-muted-foreground');
    expect(description.tagName).toBe('P');
  });

  test('card content has proper padding', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    const content = container.firstChild as HTMLElement;

    expect(content).toHaveClass('p-6');
    expect(content).toHaveClass('pt-0');
  });

  test('card footer has proper layout', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;

    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('items-center');
    expect(footer).toHaveClass('p-6');
    expect(footer).toHaveClass('pt-0');
  });

  test('card has proper accessibility', () => {
    render(<Card>Content</Card>);
    // Card should be a generic container, no specific ARIA requirements
    const card = screen.getByText('Content').parentElement;
    expect(card).toBeInTheDocument();
  });
});
