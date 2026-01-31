import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent>
        <p>Simple card with just content.</p>
      </CardContent>
    </Card>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Card className="w-80">
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>
      <CardHeader>
        <CardTitle>Product Title</CardTitle>
        <CardDescription>Product description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Product details and features.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-2xl font-bold">$99.99</span>
        <Button>Add to Cart</Button>
      </CardFooter>
    </Card>
  ),
};

export const Compact: Story = {
  render: () => (
    <Card className="w-64">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
          <div>
            <h3 className="font-medium">User Name</h3>
            <p className="text-sm text-muted-foreground">user@example.com</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};


