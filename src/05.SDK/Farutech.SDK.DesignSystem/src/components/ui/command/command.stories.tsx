import type { Meta, StoryObj } from '@storybook/react';
import { Command } from './command';

const meta: Meta<typeof Command> = {
  title: 'UI/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Command /> };



