import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu } from './dropdown-menu';

const meta: Meta<typeof DropdownMenu> = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DropdownMenu /> };



