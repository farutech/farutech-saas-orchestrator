import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'UI/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Sidebar /> };



