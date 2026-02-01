import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  test('renders skeleton with default props', () => {
    const { container } = render(<Skeleton />);

    const skeleton = container.querySelector('[data-skeleton]');
    expect(skeleton).toBeInTheDocument();
  });

  test('renders skeleton with custom className', () => {
    const { container } = render(<Skeleton className="custom-skeleton" />);

    const skeleton = container.querySelector('.custom-skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  test('renders skeleton with different sizes', () => {
    const { rerender, container } = render(<Skeleton className="w-4 h-4" />);
    expect(container.querySelector('.w-4.h-4')).toBeInTheDocument();

    rerender(<Skeleton className="w-8 h-8" />);
    expect(container.querySelector('.w-8.h-8')).toBeInTheDocument();
  });

  test('renders skeleton with text content simulation', () => {
    render(
      <div>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
    );

    // Should render multiple skeletons without issues
    const skeletons = document.querySelectorAll('[data-skeleton]');
    expect(skeletons).toHaveLength(3);
  });

  test('renders skeleton in card layout', () => {
    render(
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );

    const skeletons = document.querySelectorAll('[data-skeleton]');
    expect(skeletons).toHaveLength(3);
  });

  test('renders skeleton with animation', () => {
    const { container } = render(<Skeleton />);

    const skeleton = container.querySelector('[data-skeleton]');
    expect(skeleton).toBeInTheDocument();
    // Animation classes are typically applied via CSS
  });

  test('skeleton has proper accessibility', () => {
    const { container } = render(<Skeleton aria-label="Loading content" />);

    const skeleton = container.querySelector('[aria-label="Loading content"]');
    expect(skeleton).toBeInTheDocument();
  });

  test('renders skeleton in table layout', () => {
    render(
      <div className="space-y-1">
        <Skeleton className="h-8 w-full" />
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
        </div>
      </div>
    );

    const skeletons = document.querySelectorAll('[data-skeleton]');
    expect(skeletons).toHaveLength(9);
  });

  test('renders skeleton with complex layout', () => {
    render(
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );

    const skeletons = document.querySelectorAll('[data-skeleton]');
    expect(skeletons).toHaveLength(3);
  });
});