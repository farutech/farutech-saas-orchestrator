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
import { useState } from 'react';
import { Input } from './input';
import { Button } from '../button/Button';
import { Label } from '../label/Label';
import { Search, Mail, Lock, User, Phone, Globe } from 'lucide-react';


const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible input component that extends native HTML input functionality with consistent styling and accessibility features. Supports all standard input types and provides consistent theming across the design system.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'input', 'form', 'accessibility'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'datetime-local', 'time'],
      description: 'The input type attribute.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when the input is empty.',
    },
    value: {
      control: 'text',
      description: 'The current value of the input.',
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
    placeholder: 'Enter text...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic text input with default styling and placeholder text.',
      },
    },
  },
};

export const InputTypes: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div className="space-y-2">
        <Label htmlFor="text">Text Input</Label>
        <Input id="text" type="text" placeholder="Enter your name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Input</Label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password Input</Label>
        <Input id="password" type="password" placeholder="Enter your password" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="number">Number Input</Label>
        <Input id="number" type="number" placeholder="Enter a number" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="search">Search Input</Label>
        <Input id="search" type="search" placeholder="Search..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tel">Phone Input</Label>
        <Input id="tel" type="tel" placeholder="Enter phone number" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL Input</Label>
        <Input id="url" type="url" placeholder="https://example.com" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different input types for various data formats with proper labels.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input className="pl-10" placeholder="Search for anything..." />
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input className="pl-10" type="email" placeholder="Enter your email" />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input className="pl-10" type="password" placeholder="Enter your password" />
      </div>

      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input className="pl-10" placeholder="Enter your username" />
      </div>

      <div className="relative">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input className="pl-10" type="tel" placeholder="Enter phone number" />
      </div>

      <div className="relative">
        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input className="pl-10" type="url" placeholder="https://example.com" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Input fields with icons for better visual context and user experience.',
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div className="space-y-2">
        <Label htmlFor="default">Default State</Label>
        <Input id="default" placeholder="Default input" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="disabled">Disabled State</Label>
        <Input id="disabled" disabled placeholder="Disabled input" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="readonly">Read-only State</Label>
        <Input id="readonly" readOnly value="Read-only content" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="success">Success State</Label>
        <Input id="success" className="border-green-500 focus:border-green-500" placeholder="Valid input" />
        <p className="text-sm text-green-600">✓ Input is valid</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="error">Error State</Label>
        <Input id="error" className="border-red-500 focus:border-red-500" placeholder="Invalid input" />
        <p className="text-sm text-red-600">✗ This field is required</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different input states including default, disabled, read-only, success, and error states.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Form submitted:', formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6 w-96">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={handleChange('firstName')}
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={handleChange('lastName')}
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <Button type="submit" className="w-full">
          Submit Form
        </Button>
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete form example showing how inputs work together in a real form.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="space-y-2">
        <Label>Small Size</Label>
        <Input className="h-8 text-sm" placeholder="Small input" />
      </div>

      <div className="space-y-2">
        <Label>Default Size</Label>
        <Input placeholder="Default input" />
      </div>

      <div className="space-y-2">
        <Label>Large Size</Label>
        <Input className="h-12 text-lg" placeholder="Large input" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Input components in different sizes for various design needs.',
      },
    },
  },
};

export const Responsive: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md px-4">
      <div className="space-y-2">
        <Label htmlFor="responsive">Responsive Input</Label>
        <Input
          id="responsive"
          className="w-full"
          placeholder="This input adapts to screen size"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="col1">Column 1</Label>
          <Input id="col1" placeholder="Responsive column" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="col2">Column 2</Label>
          <Input id="col2" placeholder="Responsive column" />
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
        story: 'Responsive input layout that adapts to different screen sizes.',
      },
    },
  },
};

export const SearchInput: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
      <div className="w-96">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10 pr-4"
            placeholder="Search products, users, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setSearchTerm('')}
            >
              ×
            </Button>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-muted-foreground mt-2">
            Searching for: "{searchTerm}"
          </p>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive search input with clear functionality and search icon.',
      },
    },
  },
};



