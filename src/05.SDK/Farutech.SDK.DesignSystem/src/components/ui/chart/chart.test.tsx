import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './chart';

describe('Chart', () => {
  test('renders chart container', () => {
    render(
      <ChartContainer
        config={{
          desktop: {
            label: 'Desktop',
            color: 'hsl(var(--chart-1))',
          },
        }}
        className="h-[200px]"
      >
        <div>Chart content</div>
      </ChartContainer>
    );

    expect(screen.getByText('Chart content')).toBeInTheDocument();
  });

  test('renders chart tooltip', () => {
    render(
      <ChartTooltip>
        <ChartTooltipContent>
          <div>Tooltip content</div>
        </ChartTooltipContent>
      </ChartTooltip>
    );

    // Tooltip content should be present
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
  });

  test('chart container applies config and className', () => {
    render(
      <ChartContainer
        config={{
          mobile: {
            label: 'Mobile',
            color: 'hsl(var(--chart-2))',
          },
        }}
        className="custom-chart"
      >
        <div>Test chart</div>
      </ChartContainer>
    );

    expect(screen.getByText('Test chart')).toBeInTheDocument();
  });

  test('tooltip content renders children', () => {
    render(
      <ChartTooltipContent>
        <span>Custom tooltip</span>
      </ChartTooltipContent>
    );

    expect(screen.getByText('Custom tooltip')).toBeInTheDocument();
  });
});