import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

describe('Avatar', () => {
  test('renders avatar with default props', () => {
    const { container } = render(<Avatar />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('relative', 'flex', 'h-10', 'w-10', 'shrink-0', 'overflow-hidden', 'rounded-full');
  });

  test('renders avatar with custom className', () => {
    const { container } = render(<Avatar className="custom-class" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('custom-class');
  });

  test('renders avatar with custom size', () => {
    const { container } = render(<Avatar className="h-16 w-16" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('h-16', 'w-16');
  });

  test('renders avatar image with valid src', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
      </Avatar>
    );
    const image = screen.getByAltText('User avatar');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(image).toHaveClass('aspect-square', 'h-full', 'w-full');
  });

  test('renders avatar image with custom className', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" className="custom-image" />
      </Avatar>
    );
    const image = screen.getByRole('img');
    expect(image).toHaveClass('custom-image');
  });

  test('renders fallback when image fails to load', async () => {
    render(
      <Avatar>
        <AvatarImage src="invalid-url.jpg" alt="User avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    // Initially, the image should be present
    const image = screen.getByAltText('User avatar');
    expect(image).toBeInTheDocument();

    // Simulate image load error
    image.dispatchEvent(new Event('error'));

    // Wait for fallback to appear
    await waitFor(() => {
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  test('renders fallback with text content', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );
    const fallback = screen.getByText('AB');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveClass('flex', 'h-full', 'w-full', 'items-center', 'justify-center', 'rounded-full', 'bg-muted');
  });

  test('renders fallback with custom className', () => {
    render(
      <Avatar>
        <AvatarFallback className="custom-fallback">AB</AvatarFallback>
      </Avatar>
    );
    const fallback = screen.getByText('AB');
    expect(fallback).toHaveClass('custom-fallback');
  });

  test('renders fallback with icon', () => {
    render(
      <Avatar>
        <AvatarFallback>
          <svg data-testid="user-icon" className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    );
    const icon = screen.getByTestId('user-icon');
    expect(icon).toBeInTheDocument();
  });

  test('renders fallback with single letter', () => {
    render(
      <Avatar>
        <AvatarFallback>J</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  test('renders fallback with emoji', () => {
    render(
      <Avatar>
        <AvatarFallback>😊</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('😊')).toBeInTheDocument();
  });

  test('renders multiple avatars', () => {
    render(
      <div>
        <Avatar>
          <AvatarFallback>A1</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>A2</AvatarFallback>
        </Avatar>
      </div>
    );
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('A2')).toBeInTheDocument();
  });

  test('renders avatar with aria-label', () => {
    const { container } = render(<Avatar aria-label="User profile picture" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveAttribute('aria-label', 'User profile picture');
  });

  test('renders avatar with data attributes', () => {
    render(<Avatar data-testid="avatar" data-user-id="123" />);
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveAttribute('data-user-id', '123');
  });

  test('renders avatar image with loading state', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
      </Avatar>
    );
    const image = screen.getByAltText('User avatar');
    expect(image).toBeInTheDocument();
    // Note: Loading state would typically be handled by the browser
  });

  test('renders fallback when no image provided', () => {
    render(
      <Avatar>
        <AvatarFallback>FB</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('FB')).toBeInTheDocument();
  });
});
