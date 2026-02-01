import type { Meta, StoryObj } from '@storybook/react';

const VIEWPORTS = {
  mobile: {
    name: 'Mobile',
    styles: {
      width: '375px',
      height: '667px',
    },
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1440px',
      height: '900px',
    },
  },
};
import { ChartContainer } from './chart';


const meta: Meta<typeof ChartContainer> = {
  title: 'UI/Chart',
  component: ChartContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible chart container component that provides consistent theming and responsive behavior for data visualizations.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'chart', 'data-visualization'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ChartContainer
      config={{
        desktop: {
          label: 'Desktop',
          color: 'hsl(var(--chart-1))',
        },
      }}
      className="h-[200px] w-[400px]"
    >
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Chart Container - Add your chart library here
      </div>
    </ChartContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Basic chart container with minimal configuration.',
      },
    },
  },
};

export const WithMultipleSeries: Story = {
  render: () => (
    <ChartContainer
      config={{
        desktop: {
          label: 'Desktop',
          color: 'hsl(var(--chart-1))',
        },
        mobile: {
          label: 'Mobile',
          color: 'hsl(var(--chart-2))',
        },
        tablet: {
          label: 'Tablet',
          color: 'hsl(var(--chart-3))',
        },
      }}
      className="h-[300px] w-[500px]"
    >
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Multi-Series Chart</h3>
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
              <span className="text-sm">Desktop</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
              <span className="text-sm">Mobile</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
              <span className="text-sm">Tablet</span>
            </div>
          </div>
        </div>
      </div>
    </ChartContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chart container configured for multiple data series with legend.',
      },
    },
  },
};

export const BarChartExample: Story = {
  render: () => (
    <ChartContainer
      config={{
        revenue: {
          label: 'Revenue',
          color: 'hsl(var(--chart-1))',
        },
        profit: {
          label: 'Profit',
          color: 'hsl(var(--chart-2))',
        },
      }}
      className="h-[300px] w-[600px]"
    >
      <div className="flex h-full items-end justify-center gap-4 p-4">
        {/* Simulated bar chart */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 bg-chart-1 rounded-t" style={{ height: '120px' }}></div>
          <span className="text-xs">Jan</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 bg-chart-1 rounded-t" style={{ height: '150px' }}></div>
          <span className="text-xs">Feb</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 bg-chart-1 rounded-t" style={{ height: '180px' }}></div>
          <span className="text-xs">Mar</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 bg-chart-2 rounded-t" style={{ height: '90px' }}></div>
          <span className="text-xs">Profit</span>
        </div>
      </div>
    </ChartContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a bar chart visualization within the chart container.',
      },
    },
  },
};

export const LineChartExample: Story = {
  render: () => (
    <ChartContainer
      config={{
        users: {
          label: 'Active Users',
          color: 'hsl(var(--chart-1))',
        },
      }}
      className="h-[250px] w-[600px]"
    >
      <div className="flex h-full items-center justify-center">
        <svg viewBox="0 0 600 250" className="w-full h-full">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="50" height="25" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 25" fill="none" stroke="hsl(var(--muted))" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Line chart path */}
          <path
            d="M 50 200 L 150 180 L 250 150 L 350 120 L 450 100 L 550 80"
            fill="none"
            stroke="hsl(var(--chart-1))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          <circle cx="50" cy="200" r="4" fill="hsl(var(--chart-1))" />
          <circle cx="150" cy="180" r="4" fill="hsl(var(--chart-1))" />
          <circle cx="250" cy="150" r="4" fill="hsl(var(--chart-1))" />
          <circle cx="350" cy="120" r="4" fill="hsl(var(--chart-1))" />
          <circle cx="450" cy="100" r="4" fill="hsl(var(--chart-1))" />
          <circle cx="550" cy="80" r="4" fill="hsl(var(--chart-1))" />
        </svg>
      </div>
    </ChartContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a line chart showing user growth over time.',
      },
    },
  },
};

export const PieChartExample: Story = {
  render: () => (
    <ChartContainer
      config={{
        chrome: {
          label: 'Chrome',
          color: 'hsl(var(--chart-1))',
        },
        safari: {
          label: 'Safari',
          color: 'hsl(var(--chart-2))',
        },
        firefox: {
          label: 'Firefox',
          color: 'hsl(var(--chart-3))',
        },
        edge: {
          label: 'Edge',
          color: 'hsl(var(--chart-4))',
        },
        other: {
          label: 'Other',
          color: 'hsl(var(--chart-5))',
        },
      }}
      className="h-[300px] w-[300px]"
    >
      <div className="flex h-full items-center justify-center">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {/* Pie chart slices */}
          <circle cx="150" cy="150" r="100" fill="none" stroke="hsl(var(--muted))" strokeWidth="1"/>
          <path d="M 150 50 A 100 100 0 0 1 250 150 L 150 150 Z" fill="hsl(var(--chart-1))" />
          <path d="M 250 150 A 100 100 0 0 1 150 250 L 150 150 Z" fill="hsl(var(--chart-2))" />
          <path d="M 150 250 A 100 100 0 0 1 50 150 L 150 150 Z" fill="hsl(var(--chart-3))" />
          <path d="M 50 150 A 100 100 0 0 1 150 50 L 150 150 Z" fill="hsl(var(--chart-4))" />
          <circle cx="150" cy="150" r="40" fill="white" />
        </svg>
      </div>
    </ChartContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a pie chart showing browser usage statistics.',
      },
    },
  },
};

export const DashboardCharts: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartContainer
        config={{
          sales: {
            label: 'Sales',
            color: 'hsl(var(--chart-1))',
          },
        }}
        className="h-[200px]"
      >
        <div className="p-4">
          <h3 className="text-sm font-medium mb-2">Monthly Sales</h3>
          <div className="flex h-32 items-end justify-between gap-2">
            {[40, 60, 45, 80, 65, 90].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-chart-1 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-muted-foreground">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </ChartContainer>

      <ChartContainer
        config={{
          users: {
            label: 'Users',
            color: 'hsl(var(--chart-2))',
          },
          sessions: {
            label: 'Sessions',
            color: 'hsl(var(--chart-3))',
          },
        }}
        className="h-[200px]"
      >
        <div className="p-4">
          <h3 className="text-sm font-medium mb-2">User Analytics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Users</span>
              <span className="text-lg font-bold">12,345</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Sessions</span>
              <span className="text-lg font-bold">8,921</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Bounce Rate</span>
              <span className="text-lg font-bold">24.5%</span>
            </div>
          </div>
        </div>
      </ChartContainer>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dashboard layout with multiple chart containers showing different metrics.',
      },
    },
  },
};

export const ResponsiveChart: Story = {
  render: () => (
    <ChartContainer
      config={{
        data: {
          label: 'Data Points',
          color: 'hsl(var(--chart-1))',
        },
      }}
      className="h-[200px] w-full max-w-md"
    >
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Responsive Chart</h3>
          <p className="text-sm text-muted-foreground">
            This chart container adapts to different screen sizes
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-4 h-4 bg-chart-1 rounded-full"></div>
            <div className="w-4 h-4 bg-chart-2 rounded-full"></div>
            <div className="w-4 h-4 bg-chart-3 rounded-full"></div>
          </div>
        </div>
      </div>
    </ChartContainer>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Responsive chart container that works well on mobile devices.',
      },
    },
  },
};

export const ChartWithLegend: Story = {
  render: () => (
    <div className="space-y-4">
      <ChartContainer
        config={{
          series1: {
            label: 'Series 1',
            color: 'hsl(var(--chart-1))',
          },
          series2: {
            label: 'Series 2',
            color: 'hsl(var(--chart-2))',
          },
          series3: {
            label: 'Series 3',
            color: 'hsl(var(--chart-3))',
          },
        }}
        className="h-[200px] w-[500px]"
      >
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Chart with Legend</h3>
            <p className="text-sm text-muted-foreground">Multiple data series visualization</p>
          </div>
        </div>
      </ChartContainer>

      <div className="flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
          <span className="text-sm">Series 1</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
          <span className="text-sm">Series 2</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
          <span className="text-sm">Series 3</span>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chart container with a separate legend component below.',
      },
    },
  },
};

export const EmptyState: Story = {
  render: () => (
    <ChartContainer
      config={{
        data: {
          label: 'No Data',
          color: 'hsl(var(--muted-foreground))',
        },
      }}
      className="h-[200px] w-[400px]"
    >
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-2">
          <svg className="w-12 h-12 text-muted-foreground mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-sm font-medium">No data available</h3>
          <p className="text-xs text-muted-foreground">Chart will appear here when data is loaded</p>
        </div>
      </div>
    </ChartContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chart container showing an empty state when no data is available.',
      },
    },
  },
};

export const LoadingState: Story = {
  render: () => (
    <ChartContainer
      config={{
        loading: {
          label: 'Loading',
          color: 'hsl(var(--muted))',
        },
      }}
      className="h-[200px] w-[400px]"
    >
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chart-1"></div>
          </div>
          <p className="text-sm text-muted-foreground">Loading chart data...</p>
        </div>
      </div>
    </ChartContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chart container showing a loading state while data is being fetched.',
      },
    },
  },
};




