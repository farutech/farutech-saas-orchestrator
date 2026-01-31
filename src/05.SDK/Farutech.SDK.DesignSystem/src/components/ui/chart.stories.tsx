import type { Meta, StoryObj } from '@storybook/react';
import { ChartContainer as Chart } from './chart';

const meta: Meta<typeof Chart> = {
  title: 'UI/Chart',
  component: Chart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Chart /> };
