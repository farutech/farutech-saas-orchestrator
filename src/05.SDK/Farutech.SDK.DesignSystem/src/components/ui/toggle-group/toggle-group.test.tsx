import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  ToggleGroup,
  ToggleGroupItem,
} from './toggle-group';

describe('ToggleGroup', () => {
  test('renders toggle group with single selection', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
        <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
        <ToggleGroupItem value="option3">Option 3</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  test('renders toggle group with multiple selection', () => {
    render(
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
        <ToggleGroupItem value="c">C</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  test('renders toggle group with selected value', () => {
    render(
      <ToggleGroup type="single" value="selected">
        <ToggleGroupItem value="selected">Selected</ToggleGroupItem>
        <ToggleGroupItem value="not-selected">Not Selected</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByText('Selected')).toBeInTheDocument();
    expect(screen.getByText('Not Selected')).toBeInTheDocument();
  });

  test('renders toggle group with multiple selected values', () => {
    render(
      <ToggleGroup type="multiple" value={['first', 'third']}>
        <ToggleGroupItem value="first">First</ToggleGroupItem>
        <ToggleGroupItem value="second">Second</ToggleGroupItem>
        <ToggleGroupItem value="third">Third</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  test('renders toggle group with disabled item', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="enabled">Enabled</ToggleGroupItem>
        <ToggleGroupItem value="disabled" disabled>Disabled</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  test('renders toggle group with custom className', () => {
    const { container } = render(
      <ToggleGroup type="single" className="custom-group">
        <ToggleGroupItem value="item">Item</ToggleGroupItem>
      </ToggleGroup>
    );

    const group = container.querySelector('.custom-group');
    expect(group).toBeInTheDocument();
    expect(screen.getByText('Item')).toBeInTheDocument();
  });

  test('toggle group has proper accessibility', () => {
    render(
      <ToggleGroup type="single" aria-label="Test group">
        <ToggleGroupItem value="test">Test Item</ToggleGroupItem>
      </ToggleGroup>
    );

    const group = document.querySelector('[role="group"]');
    expect(group).toBeInTheDocument();
  });

  test('renders toggle group with different orientations', () => {
    const { rerender } = render(
      <ToggleGroup type="single" orientation="horizontal">
        <ToggleGroupItem value="h">Horizontal</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByText('Horizontal')).toBeInTheDocument();

    rerender(
      <ToggleGroup type="single" orientation="vertical">
        <ToggleGroupItem value="v">Vertical</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByText('Vertical')).toBeInTheDocument();
  });

  test('renders toggle group with size variants', () => {
    render(
      <ToggleGroup type="single" size="sm">
        <ToggleGroupItem value="small">Small</ToggleGroupItem>
        <ToggleGroupItem value="large">Large</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  test('renders toggle group with variant', () => {
    render(
      <ToggleGroup type="single" variant="outline">
        <ToggleGroupItem value="outlined">Outlined</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByText('Outlined')).toBeInTheDocument();
  });

  test('renders complex toggle group', () => {
    render(
      <ToggleGroup type="multiple" value={['bold', 'italic']}>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <strong>B</strong>
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <em>I</em>
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <u>U</u>
        </ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByLabelText('Bold')).toBeInTheDocument();
    expect(screen.getByLabelText('Italic')).toBeInTheDocument();
    expect(screen.getByLabelText('Underline')).toBeInTheDocument();
  });
});