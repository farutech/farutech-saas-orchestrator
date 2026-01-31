import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Tooltip /> };



