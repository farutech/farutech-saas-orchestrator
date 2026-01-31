import type { Meta, StoryObj } from '@storybook/react';
import { InputOTP } from './input-otp';

const meta: Meta<typeof InputOtp> = {
  title: 'UI/InputOtp',
  component: InputOtp,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <InputOTP /> };
