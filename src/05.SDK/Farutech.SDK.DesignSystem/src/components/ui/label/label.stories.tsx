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
import { Label } from './label';
import { Input } from '../input/Input';
import { Textarea } from '../textarea/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select/Select';
import { Checkbox } from '../checkbox/Checkbox';
import { RadioGroup, RadioGroupItem } from '../radio-group/radio-group';
import { Switch } from '../switch/Switch';
import { Button } from '../button/Button';


const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A label component that provides accessible labeling for form controls and other interactive elements. Extends native HTML label functionality with consistent styling and proper accessibility attributes.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'label', 'form', 'accessibility'],
  argTypes: {
    htmlFor: {
      control: 'text',
      description: 'The id of the form control that this label is associated with.',
    },
    children: {
      control: 'text',
      description: 'The label text content.',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default Label',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic label with default styling.',
      },
    },
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="Enter your username" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter your password" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels associated with input fields for proper form accessibility.',
      },
    },
  },
};

export const WithTextarea: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <Label htmlFor="message">Message</Label>
      <Textarea
        id="message"
        placeholder="Enter your message here..."
        className="min-h-[100px]"
      />
      <p className="text-sm text-muted-foreground">
        This label is properly associated with the textarea below.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Label associated with a textarea element.',
      },
    },
  },
};

export const WithSelect: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <Label htmlFor="country">Country</Label>
      <Select>
        <SelectTrigger id="country">
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Label associated with a select dropdown.',
      },
    },
  },
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms" className="text-sm font-normal">
          I agree to the Terms of Service and Privacy Policy
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter" />
        <Label htmlFor="newsletter" className="text-sm font-normal">
          Subscribe to our newsletter
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="marketing" />
        <Label htmlFor="marketing" className="text-sm font-normal">
          Receive marketing communications
        </Label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels associated with checkbox inputs.',
      },
    },
  },
};

export const WithRadioGroup: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Label className="text-base font-medium">Choose your plan</Label>
      <RadioGroup defaultValue="free">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="free" id="free" />
          <Label htmlFor="free" className="text-sm font-normal">
            Free Plan - $0/month
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pro" id="pro" />
          <Label htmlFor="pro" className="text-sm font-normal">
            Pro Plan - $29/month
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="enterprise" id="enterprise" />
          <Label htmlFor="enterprise" className="text-sm font-normal">
            Enterprise Plan - $99/month
          </Label>
        </div>
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels associated with radio button inputs in a group.',
      },
    },
  },
};

export const WithSwitch: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="notifications" className="text-base">
            Email Notifications
          </Label>
          <p className="text-sm text-muted-foreground">
            Receive notifications about your account activity.
          </p>
        </div>
        <Switch id="notifications" />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="dark-mode" className="text-base">
            Dark Mode
          </Label>
          <p className="text-sm text-muted-foreground">
            Toggle between light and dark themes.
          </p>
        </div>
        <Switch id="dark-mode" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels associated with switch/toggle controls.',
      },
    },
  },
};

export const RequiredLabels: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="space-y-2">
        <Label htmlFor="required-field">
          Required Field <span className="text-red-500">*</span>
        </Label>
        <Input id="required-field" placeholder="This field is required" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="optional-field">
          Optional Field <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input id="optional-field" placeholder="This field is optional" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels indicating required and optional fields.',
      },
    },
  },
};

export const LabelSizes: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div className="space-y-2">
        <Label className="text-xs">Extra Small Label</Label>
        <Input className="h-7 text-xs" placeholder="Extra small input" />
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Small Label</Label>
        <Input className="h-8 text-sm" placeholder="Small input" />
      </div>

      <div className="space-y-2">
        <Label className="text-base">Default Label</Label>
        <Input placeholder="Default input" />
      </div>

      <div className="space-y-2">
        <Label className="text-lg">Large Label</Label>
        <Input className="h-12 text-lg" placeholder="Large input" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels in different sizes to match input field sizes.',
      },
    },
  },
};

export const FormSection: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <div>
        <h3 className="text-lg font-medium mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Doe" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-address">Email Address</Label>
            <Input id="email-address" type="email" placeholder="john@example.com" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails" className="text-base">
                Marketing Emails
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about new features and promotions.
              </p>
            </div>
            <Switch id="marketing-emails" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>

      <Button className="w-full">Save Changes</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete form with organized sections and proper label associations.',
      },
    },
  },
};

export const ResponsiveLabels: Story = {
  render: () => (
    <div className="w-full max-w-md px-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="responsive-input" className="block sm:inline">
            Responsive Label
          </Label>
          <Input
            id="responsive-input"
            className="w-full"
            placeholder="This adapts to screen size"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="col1" className="text-sm">
              Column 1
            </Label>
            <Input id="col1" placeholder="Responsive column" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="col2" className="text-sm">
              Column 2
            </Label>
            <Input id="col2" placeholder="Responsive column" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Labels that adapt to different screen sizes and layouts.',
      },
    },
  },
};



