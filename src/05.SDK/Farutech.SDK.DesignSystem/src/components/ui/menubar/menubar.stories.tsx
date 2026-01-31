import type { Meta, StoryObj } from '@storybook/react';
import { Menubar } from './menubar';

const meta: Meta<typeof Menubar> = {
  title: 'UI/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Menubar /> };



