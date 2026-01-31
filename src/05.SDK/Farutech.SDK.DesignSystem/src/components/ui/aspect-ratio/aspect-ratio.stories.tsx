import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './aspect-ratio';

const meta: Meta<typeof AspectRatio> = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AspectRatio />,
};



