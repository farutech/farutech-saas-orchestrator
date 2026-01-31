import type { Meta, StoryObj } from '@storybook/react';
import { ResizablePanelGroup as Resizable } from './resizable';

const meta: Meta<typeof Resizable> = {
  title: 'UI/Resizable',
  component: Resizable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Resizable /> };
