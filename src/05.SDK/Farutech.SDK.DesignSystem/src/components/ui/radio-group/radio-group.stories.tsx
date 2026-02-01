import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { useState } from 'react';

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

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable radio group component for single selection from multiple options. Supports controlled and uncontrolled states with proper accessibility features.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'radio', 'form', 'input', 'selection'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the radio group is disabled.',
    },
    value: {
      control: 'text',
      description: 'The selected value of the radio group.',
    },
    onValueChange: {
      action: 'onValueChange',
      description: 'Callback fired when the radio group value changes.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <RadioGroup value={value} onValueChange={setValue}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="r1" />
          <label htmlFor="r1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Option 1
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option2" id="r2" />
          <label htmlFor="r2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Option 2
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option3" id="r3" />
          <label htmlFor="r3" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Option 3
          </label>
        </div>
      </RadioGroup>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic radio group with three options and labels.',
      },
    },
  },
};

export const Controlled: Story = {
  args: {
    value: 'option2',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="controlled-r1" />
        <label htmlFor="controlled-r1" className="text-sm font-medium leading-none">
          Option 1
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="controlled-r2" />
        <label htmlFor="controlled-r2" className="text-sm font-medium leading-none">
          Option 2
        </label>
      </div>
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Radio group with controlled selected value.',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-3">Disabled Group</h4>
        <RadioGroup disabled>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="disabled1" id="disabled-r1" />
            <label htmlFor="disabled-r1" className="text-sm font-medium leading-none text-muted-foreground">
              Disabled Option 1
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="disabled2" id="disabled-r2" />
            <label htmlFor="disabled-r2" className="text-sm font-medium leading-none text-muted-foreground">
              Disabled Option 2
            </label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-3">Individual Disabled Items</h4>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="enabled" id="enabled-r" />
            <label htmlFor="enabled-r" className="text-sm font-medium leading-none">
              Enabled Option
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="disabled" id="individual-disabled-r" disabled />
            <label htmlFor="individual-disabled-r" className="text-sm font-medium leading-none text-muted-foreground">
              Disabled Option
            </label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled radio group and individual disabled radio items.',
      },
    },
  },
};

export const WithDescription: Story = {
  render: () => {
    const [value, setValue] = useState('comfortable');
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Comfort Level</h3>
          <p className="text-sm text-muted-foreground mb-4">
            How comfortable are you with new technologies?
          </p>
        </div>
        <RadioGroup value={value} onValueChange={setValue}>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="very-comfortable" id="comfortable-r1" className="mt-0.5" />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="comfortable-r1" className="text-sm font-medium leading-none">
                Very Comfortable
              </label>
              <p className="text-xs text-muted-foreground">
                I use new technologies regularly and enjoy exploring them.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="somewhat-comfortable" id="comfortable-r2" className="mt-0.5" />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="comfortable-r2" className="text-sm font-medium leading-none">
                Somewhat Comfortable
              </label>
              <p className="text-xs text-muted-foreground">
                I use technology when needed but prefer familiar tools.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="not-comfortable" id="comfortable-r3" className="mt-0.5" />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="comfortable-r3" className="text-sm font-medium leading-none">
                Not Comfortable
              </label>
              <p className="text-xs text-muted-foreground">
                I prefer to stick with what I know and avoid new technologies.
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Radio group with descriptions for each option.',
      },
    },
  },
};

export const HorizontalLayout: Story = {
  render: () => {
    const [value, setValue] = useState('small');
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Size Preference</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose your preferred size
          </p>
        </div>
        <RadioGroup value={value} onValueChange={setValue} className="flex flex-row space-x-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small" id="size-r1" />
            <label htmlFor="size-r1" className="text-sm font-medium leading-none">
              Small
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="size-r2" />
            <label htmlFor="size-r2" className="text-sm font-medium leading-none">
              Medium
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large" id="size-r3" />
            <label htmlFor="size-r3" className="text-sm font-medium leading-none">
              Large
            </label>
          </div>
        </RadioGroup>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Radio group with horizontal layout using flexbox.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      experience: '',
      role: '',
      department: '',
    });

    const handleChange = (field: string) => (value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <div className="space-y-6 max-w-md">
        <div>
          <h3 className="text-lg font-medium mb-4">Developer Survey</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-3 block">Years of Experience</label>
            <RadioGroup value={formData.experience} onValueChange={handleChange('experience')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0-2" id="exp-r1" />
                <label htmlFor="exp-r1" className="text-sm">0-2 years</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3-5" id="exp-r2" />
                <label htmlFor="exp-r2" className="text-sm">3-5 years</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6-10" id="exp-r3" />
                <label htmlFor="exp-r3" className="text-sm">6-10 years</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10+" id="exp-r4" />
                <label htmlFor="exp-r4" className="text-sm">10+ years</label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Primary Role</label>
            <RadioGroup value={formData.role} onValueChange={handleChange('role')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="frontend" id="role-r1" />
                <label htmlFor="role-r1" className="text-sm">Frontend Developer</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="backend" id="role-r2" />
                <label htmlFor="role-r2" className="text-sm">Backend Developer</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fullstack" id="role-r3" />
                <label htmlFor="role-r3" className="text-sm">Full Stack Developer</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="role-r4" />
                <label htmlFor="role-r4" className="text-sm">Other</label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Experience: {formData.experience || 'Not selected'} | Role: {formData.role || 'Not selected'}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete form example with multiple radio groups.',
      },
    },
  },
};

export const ResponsiveExample: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="mobile-1" id="mobile-r1" />
        <label htmlFor="mobile-r1" className="text-sm">Option 1</label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="mobile-2" id="mobile-r2" defaultChecked />
        <label htmlFor="mobile-r2" className="text-sm">Option 2</label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="mobile-3" id="mobile-r3" disabled />
        <label htmlFor="mobile-r3" className="text-sm text-muted-foreground">Disabled option</label>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Radio group examples optimized for mobile devices.',
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Enabled States</h4>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unchecked" id="state-r1" />
            <label htmlFor="state-r1" className="text-sm">Unchecked</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="checked" id="state-r2" defaultChecked />
            <label htmlFor="state-r2" className="text-sm">Checked</label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Disabled States</h4>
        <RadioGroup disabled>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="disabled-unchecked" id="disabled-state-r1" />
            <label htmlFor="disabled-state-r1" className="text-sm text-muted-foreground">Disabled unchecked</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="disabled-checked" id="disabled-state-r2" defaultChecked />
            <label htmlFor="disabled-state-r2" className="text-sm text-muted-foreground">Disabled checked</label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All possible radio states displayed together for comparison.',
      },
    },
  },
};


