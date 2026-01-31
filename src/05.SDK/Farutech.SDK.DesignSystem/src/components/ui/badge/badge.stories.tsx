import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const Status: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge className="bg-green-100 text-green-800">Active</Badge>
      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      <Badge className="bg-blue-100 text-blue-800">Draft</Badge>
    </div>
  ),
};

export const WithDot: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="outline" className="gap-1">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        Online
      </Badge>
      <Badge variant="outline" className="gap-1">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        Offline
      </Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge className="text-xs px-2 py-1">Small</Badge>
      <Badge>Default</Badge>
      <Badge className="text-lg px-3 py-1">Large</Badge>
    </div>
  ),
};


