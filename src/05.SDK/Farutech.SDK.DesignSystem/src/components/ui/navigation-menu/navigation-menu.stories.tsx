import type { Meta, StoryObj } from '@storybook/react';
import { NavigationMenu } from './navigation-menu';

const meta: Meta<typeof NavigationMenu> = {
  title: 'UI/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <NavigationMenu /> };



