import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Switch /> };



