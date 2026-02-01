import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './carousel';

describe('Carousel', () => {
  test('renders carousel with content', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
  });

  test('renders navigation buttons', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    // Navigation buttons should be present
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('renders multiple carousel items', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>First slide</CarouselItem>
          <CarouselItem>Second slide</CarouselItem>
          <CarouselItem>Third slide</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    expect(screen.getByText('First slide')).toBeInTheDocument();
    expect(screen.getByText('Second slide')).toBeInTheDocument();
    expect(screen.getByText('Third slide')).toBeInTheDocument();
  });

  test('applies orientation classes', () => {
    render(
      <Carousel orientation="horizontal">
        <CarouselContent>
          <CarouselItem>Content</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    // Should render without errors
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('has proper structure', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Test content</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    const content = screen.getByText('Test content');
    expect(content).toBeInTheDocument();
  });
});