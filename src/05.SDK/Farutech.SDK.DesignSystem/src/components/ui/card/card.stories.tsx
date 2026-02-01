import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from '../button/button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component with multiple variants and elevation levels.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'filled'],
      description: 'The visual style variant of the card',
    },
    elevation: {
      control: { type: 'select' },
      options: [0, 1, 2, 3],
      description: 'The shadow elevation level of the card',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    variant: 'default',
    elevation: 1,
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>
            This is a description of the card content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the main content area of the card. You can put any content here.</p>
        </CardContent>
        <CardFooter>
          <Button>Action</Button>
        </CardFooter>
      </>
    ),
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    elevation: 0,
    children: (
      <>
        <CardHeader>
          <CardTitle>Outline Card</CardTitle>
          <CardDescription>
            An outline variant with no elevation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card uses the outline variant for a more subtle appearance.</p>
        </CardContent>
      </>
    ),
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    elevation: 2,
    children: (
      <>
        <CardHeader>
          <CardTitle>Filled Card</CardTitle>
          <CardDescription>
            A filled variant with medium elevation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card uses the filled variant for a more prominent appearance.</p>
        </CardContent>
      </>
    ),
  },
};

export const ElevationLevels: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      <Card elevation={0}>
        <CardHeader>
          <CardTitle>Elevation 0</CardTitle>
        </CardHeader>
        <CardContent>No shadow</CardContent>
      </Card>
      <Card elevation={1}>
        <CardHeader>
          <CardTitle>Elevation 1</CardTitle>
        </CardHeader>
        <CardContent>Small shadow</CardContent>
      </Card>
      <Card elevation={2}>
        <CardHeader>
          <CardTitle>Elevation 2</CardTitle>
        </CardHeader>
        <CardContent>Medium shadow</CardContent>
      </Card>
      <Card elevation={3}>
        <CardHeader>
          <CardTitle>Elevation 3</CardTitle>
        </CardHeader>
        <CardContent>Large shadow</CardContent>
      </Card>
    </div>
  ),
};

export const SimpleCard: Story = {
  args: {
    children: (
      <CardContent>
        <p>A simple card with just content.</p>
      </CardContent>
    ),
  },
};

export const CardWithActions: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Project Status</CardTitle>
          <CardDescription>Current progress and next steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>✅ Phase 1: Core business logic completed</p>
            <p>🔄 Phase 2: UI components in progress</p>
            <p>⏳ Phase 3: Integration testing pending</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">View Details</Button>
          <Button>Continue</Button>
        </CardFooter>
      </>
    ),
  },
};

export const UserProfile: Story = {
  args: {
    variant: 'default',
    elevation: 2,
    children: (
      <>
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>
          <CardTitle>John Doe</CardTitle>
          <CardDescription>Software Developer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm">john.doe@example.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm">San Francisco, CA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Joined</span>
              <span className="text-sm">January 2023</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" size="sm">Edit Profile</Button>
          <Button size="sm">View Details</Button>
        </CardFooter>
      </>
    ),
  },
};

export const ProductCard: Story = {
  args: {
    variant: 'filled',
    elevation: 1,
    children: (
      <>
        <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center">
          <svg className="w-16 h-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <CardHeader>
          <CardTitle>Wireless Headphones</CardTitle>
          <CardDescription>Premium noise-cancelling wireless headphones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
            <span className="text-sm text-muted-foreground ml-1">(4.8)</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Experience crystal-clear sound with active noise cancellation and 30-hour battery life.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <span className="text-2xl font-bold">$299.99</span>
          <Button>Add to Cart</Button>
        </CardFooter>
      </>
    ),
  },
};

export const DashboardCard: Story = {
  args: {
    variant: 'outline',
    elevation: 0,
    children: (
      <>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </>
    ),
};



