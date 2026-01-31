import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard } from './hover-card';

const meta: Meta<typeof HoverCard> = {
  title: 'UI/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <HoverCard /> };



