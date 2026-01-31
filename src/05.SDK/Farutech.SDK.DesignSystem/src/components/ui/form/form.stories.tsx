import type { Meta, StoryObj } from '@storybook/react';
import { Form } from './form';

const meta: Meta<typeof Form> = {
  title: 'UI/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Form /> };



