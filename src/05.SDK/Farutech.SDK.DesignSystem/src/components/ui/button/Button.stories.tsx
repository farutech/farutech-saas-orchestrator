import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Button } from './Button';

export default {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs', 'ui', 'button'],
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => <Button {...args}>Click</Button>;

export const Default = Template.bind({});
Default.args = {};
