import type { Meta, StoryObj } from '@storybook/react';
import { Sheet } from './sheet';

const meta: Meta<typeof Sheet> = {
  title: 'UI/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Sheet /> };



