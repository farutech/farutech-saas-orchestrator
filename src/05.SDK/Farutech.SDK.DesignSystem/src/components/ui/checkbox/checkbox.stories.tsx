import type { Meta, StoryObj } from '@storybook/react';

const VIEWPORTS = {
  mobile: {
    name: 'Mobile',
    styles: {
      width: '375px',
      height: '667px',
    },
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1440px',
      height: '900px',
    },
  },
};
import { Checkbox } from './checkbox';
import { useState } from 'react';


const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable checkbox component for form inputs and selection controls. Supports controlled and uncontrolled states with proper accessibility features.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'checkbox', 'form', 'input'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled.',
    },
    checked: {
      control: 'boolean',
      description: 'The checked state of the checkbox.',
    },
    onCheckedChange: {
      action: 'onCheckedChange',
      description: 'Callback fired when the checkbox state changes.',
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
        <label htmlFor="default" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Accept terms and conditions
        </label>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic checkbox with label for accepting terms and conditions.',
      },
    },
  },
};

export const Controlled: Story = {
  args: {
    checked: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="controlled" {...args} />
      <label htmlFor="controlled" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Controlled checkbox
      </label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Checkbox with controlled checked state.',
      },
    },
  },
};

export const Uncontrolled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="uncontrolled" defaultChecked />
      <label htmlFor="uncontrolled" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Uncontrolled checkbox
      </label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Checkbox with default checked state, uncontrolled by React state.',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-unchecked" disabled />
        <label htmlFor="disabled-unchecked" className="text-sm font-medium leading-none text-muted-foreground">
          Disabled unchecked
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" disabled checked />
        <label htmlFor="disabled-checked" className="text-sm font-medium leading-none text-muted-foreground">
          Disabled checked
        </label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled checkbox states showing both checked and unchecked disabled variants.',
      },
    },
  },
};

export const WithDescription: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex items-start space-x-2">
        <Checkbox
          id="description"
          checked={checked}
          onCheckedChange={(checked) => setChecked(checked === true)}
          className="mt-0.5"
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="description"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable notifications
          </label>
          <p className="text-xs text-muted-foreground">
            Receive notifications about your account activity.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox with label and description text for better context.',
      },
    },
  },
};

export const CheckboxGroup: Story = {
  render: () => {
    const [items, setItems] = useState({
      newsletter: false,
      marketing: false,
      updates: true,
      security: true,
    });

    const handleChange = (key: string) => (checked: boolean) => {
      setItems(prev => ({ ...prev, [key]: checked }));
    };

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-3">Email Preferences</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose what emails you'd like to receive from us.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="newsletter"
              checked={items.newsletter}
              onCheckedChange={handleChange('newsletter')}
              className="mt-0.5"
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="newsletter" className="text-sm font-medium leading-none">
                Newsletter
              </label>
              <p className="text-xs text-muted-foreground">
                Weekly digest of our latest articles and updates.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="marketing"
              checked={items.marketing}
              onCheckedChange={handleChange('marketing')}
              className="mt-0.5"
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="marketing" className="text-sm font-medium leading-none">
                Marketing emails
              </label>
              <p className="text-xs text-muted-foreground">
                Promotional offers and product announcements.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="updates"
              checked={items.updates}
              onCheckedChange={handleChange('updates')}
              className="mt-0.5"
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="updates" className="text-sm font-medium leading-none">
                Product updates
              </label>
              <p className="text-xs text-muted-foreground">
                Important updates about our products and features.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="security"
              checked={items.security}
              onCheckedChange={handleChange('security')}
              className="mt-0.5"
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="security" className="text-sm font-medium leading-none">
                Security alerts
              </label>
              <p className="text-xs text-muted-foreground">
                Critical security notifications (cannot be disabled).
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Group of checkboxes for email preferences with descriptions.',
      },
    },
  },
};

export const SelectAll: Story = {
  render: () => {
    const [items, setItems] = useState({
      item1: false,
      item2: false,
      item3: false,
      item4: false,
    });

    const allChecked = Object.values(items).every(Boolean);
    const someChecked = Object.values(items).some(Boolean) && !allChecked;

    const handleSelectAll = (checked: boolean) => {
      setItems({
        item1: checked,
        item2: checked,
        item3: checked,
        item4: checked,
      });
    };

    const handleItemChange = (key: string) => (checked: boolean) => {
      setItems(prev => ({ ...prev, [key]: checked }));
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={allChecked}
            onCheckedChange={handleSelectAll}
            ref={(el) => {
              if (el) el.indeterminate = someChecked;
            }}
          />
          <label htmlFor="select-all" className="text-sm font-medium leading-none">
            Select all items
          </label>
        </div>
        <div className="ml-6 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="item1"
              checked={items.item1}
              onCheckedChange={handleItemChange('item1')}
            />
            <label htmlFor="item1" className="text-sm">Item 1</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="item2"
              checked={items.item2}
              onCheckedChange={handleItemChange('item2')}
            />
            <label htmlFor="item2" className="text-sm">Item 2</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="item3"
              checked={items.item3}
              onCheckedChange={handleItemChange('item3')}
            />
            <label htmlFor="item3" className="text-sm">Item 3</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="item4"
              checked={items.item4}
              onCheckedChange={handleItemChange('item4')}
            />
            <label htmlFor="item4" className="text-sm">Item 4</label>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Select all functionality with indeterminate state for partial selections.',
      },
    },
  },
};

export const TermsAndConditions: Story = {
  render: () => {
    const [agreements, setAgreements] = useState({
      terms: false,
      privacy: false,
      marketing: false,
    });

    const handleChange = (key: string) => (checked: boolean) => {
      setAgreements(prev => ({ ...prev, [key]: checked }));
    };

    const allRequiredAgreed = agreements.terms && agreements.privacy;

    return (
      <div className="space-y-4 max-w-md">
        <h3 className="text-lg font-medium">Account Setup</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreements.terms}
              onCheckedChange={handleChange('terms')}
              className="mt-0.5"
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="terms" className="text-sm font-medium leading-none">
                I agree to the Terms of Service
              </label>
              <p className="text-xs text-muted-foreground">
                Required to create an account.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="privacy"
              checked={agreements.privacy}
              onCheckedChange={handleChange('privacy')}
              className="mt-0.5"
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="privacy" className="text-sm font-medium leading-none">
                I agree to the Privacy Policy
              </label>
              <p className="text-xs text-muted-foreground">
                Required to create an account.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="marketing"
              checked={agreements.marketing}
              onCheckedChange={handleChange('marketing')}
              className="mt-0.5"
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="marketing" className="text-sm font-medium leading-none">
                Subscribe to marketing emails
              </label>
              <p className="text-xs text-muted-foreground">
                Optional. You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
        <button
          className={`w-full py-2 px-4 rounded-md text-sm font-medium ${
            allRequiredAgreed
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!allRequiredAgreed}
        >
          Create Account
        </button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Terms and conditions checkboxes with validation for account creation.',
      },
    },
  },
};

export const FilterOptions: Story = {
  render: () => {
    const [filters, setFilters] = useState({
      active: true,
      completed: false,
      pending: true,
      cancelled: false,
    });

    const handleChange = (key: string) => (checked: boolean) => {
      setFilters(prev => ({ ...prev, [key]: checked }));
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Filter Tasks</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={filters.active}
              onCheckedChange={handleChange('active')}
            />
            <label htmlFor="active" className="text-sm font-medium">
              Active
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="completed"
              checked={filters.completed}
              onCheckedChange={handleChange('completed')}
            />
            <label htmlFor="completed" className="text-sm font-medium">
              Completed
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pending"
              checked={filters.pending}
              onCheckedChange={handleChange('pending')}
            />
            <label htmlFor="pending" className="text-sm font-medium">
              Pending
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cancelled"
              checked={filters.cancelled}
              onCheckedChange={handleChange('cancelled')}
            />
            <label htmlFor="cancelled" className="text-sm font-medium">
              Cancelled
            </label>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {Object.values(filters).filter(Boolean).length} of 4 filter types
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox filters for task management with grid layout.',
      },
    },
  },
};

export const ResponsiveExample: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox id="mobile-1" />
        <label htmlFor="mobile-1" className="text-sm">Option 1</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="mobile-2" defaultChecked />
        <label htmlFor="mobile-2" className="text-sm">Option 2</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="mobile-3" disabled />
        <label htmlFor="mobile-3" className="text-sm text-muted-foreground">Disabled option</label>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Checkbox examples optimized for mobile devices.',
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Enabled States</h4>
        <div className="flex items-center space-x-2">
          <Checkbox id="unchecked" />
          <label htmlFor="unchecked" className="text-sm">Unchecked</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="checked" checked />
          <label htmlFor="checked" className="text-sm">Checked</label>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Disabled States</h4>
        <div className="flex items-center space-x-2">
          <Checkbox id="disabled-unchecked" disabled />
          <label htmlFor="disabled-unchecked" className="text-sm text-muted-foreground">Disabled unchecked</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="disabled-checked" disabled checked />
          <label htmlFor="disabled-checked" className="text-sm text-muted-foreground">Disabled checked</label>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All possible checkbox states displayed together for comparison.',
      },
    },
  },
};



