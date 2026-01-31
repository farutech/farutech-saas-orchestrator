import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { useState } from 'react';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id="default"
          checked={checked}
          onCheckedChange={(checked) => setChecked(checked === true)}
        />
        <label htmlFor="default" className="text-sm">
          Accept terms and conditions
        </label>
      </div>
    );
  },
};

export const Controlled: Story = {
  args: {
    checked: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="controlled" {...args} />
      <label htmlFor="controlled" className="text-sm">
        Controlled checkbox
      </label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-unchecked" disabled />
        <label htmlFor="disabled-unchecked" className="text-sm text-muted-foreground">
          Disabled unchecked
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" disabled checked />
        <label htmlFor="disabled-checked" className="text-sm text-muted-foreground">
          Disabled checked
        </label>
      </div>
    </div>
  ),
};

export const Group: Story = {
  render: () => {
    const [items, setItems] = useState({
      newsletter: false,
      marketing: false,
      updates: true,
    });

    const handleChange = (key: string) => (checked: boolean) => {
      setItems(prev => ({ ...prev, [key]: checked }));
    };

    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Email Preferences</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="newsletter"
              checked={items.newsletter}
              onCheckedChange={handleChange('newsletter')}
            />
            <label htmlFor="newsletter" className="text-sm">
              Newsletter
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="marketing"
              checked={items.marketing}
              onCheckedChange={handleChange('marketing')}
            />
            <label htmlFor="marketing" className="text-sm">
              Marketing emails
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="updates"
              checked={items.updates}
              onCheckedChange={handleChange('updates')}
            />
            <label htmlFor="updates" className="text-sm">
              Product updates
            </label>
          </div>
        </div>
      </div>
    );
  },
};


