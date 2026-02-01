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
import { Badge } from './badge';


const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A small label component used to highlight status, categories, or counts. Perfect for displaying metadata, status indicators, and categorization.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'badge'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline', 'highlight'],
      description: 'The visual style variant of the badge.',
    },
    children: {
      control: 'text',
      description: 'The content to display inside the badge.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic badge with default styling.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="highlight">Highlight</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different badge variants for various contexts.',
      },
    },
  },
};

export const Status: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inactive</Badge>
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Draft</Badge>
      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Published</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Status badges with custom colors for different states.',
      },
    },
  },
};

export const WithDot: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="outline" className="gap-1">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        Online
      </Badge>
      <Badge variant="outline" className="gap-1">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        Offline
      </Badge>
      <Badge variant="outline" className="gap-1">
        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        Away
      </Badge>
      <Badge variant="outline" className="gap-1">
        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        Busy
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges with status dots for user presence indicators.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge className="text-xs px-2 py-1">Small</Badge>
      <Badge>Default</Badge>
      <Badge className="text-lg px-3 py-1">Large</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges in different sizes for various UI contexts.',
      },
    },
  },
};

export const Categories: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="secondary">Technology</Badge>
      <Badge variant="secondary">Design</Badge>
      <Badge variant="secondary">Marketing</Badge>
      <Badge variant="secondary">Sales</Badge>
      <Badge variant="secondary">Support</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Category badges for content organization.',
      },
    },
  },
};

export const Counts: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="secondary">5 Items</Badge>
      <Badge variant="secondary">12 Comments</Badge>
      <Badge variant="secondary">3 Likes</Badge>
      <Badge variant="secondary">99+ Notifications</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Count badges for displaying quantities.',
      },
    },
  },
};

export const Priority: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High Priority</Badge>
      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Medium Priority</Badge>
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Low Priority</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Priority badges with color coding.',
      },
    },
  },
};

export const InContext: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h3 className="font-medium">Project Alpha</h3>
          <p className="text-sm text-muted-foreground">Due in 3 days</p>
        </div>
        <Badge variant="destructive">Overdue</Badge>
      </div>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h3 className="font-medium">Project Beta</h3>
          <p className="text-sm text-muted-foreground">Due in 2 weeks</p>
        </div>
        <Badge className="bg-green-100 text-green-800">On Track</Badge>
      </div>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h3 className="font-medium">Project Gamma</h3>
          <p className="text-sm text-muted-foreground">Due in 1 month</p>
        </div>
        <Badge variant="secondary">Planning</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges used in context within card-like components.',
      },
    },
  },
};

export const ResponsiveExample: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge className="hidden sm:inline-flex">Desktop Only</Badge>
      <Badge>Mobile & Desktop</Badge>
      <Badge className="sm:hidden">Mobile Only</Badge>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Badges demonstrating responsive visibility.',
      },
    },
  },
};



