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
import { Button } from './Button';


const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component built with class-variance-authority for consistent styling and accessibility. Supports multiple variants and sizes for different use cases.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'button'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual style variant of the button.',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled.',
    },
    children: {
      control: { type: 'text' },
      description: 'The content inside the button.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Click me',
  },
  parameters: {
    docs: {
      description: {
        story: 'The default button variant with primary styling.',
      },
    },
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
  parameters: {
    docs: {
      description: {
        story: 'Used for destructive actions like deleting or removing items.',
      },
    },
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
  parameters: {
    docs: {
      description: {
        story: 'A subtle button with border styling, ideal for secondary actions.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
  parameters: {
    docs: {
      description: {
        story: 'A secondary button for less prominent actions.',
      },
    },
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
  parameters: {
    docs: {
      description: {
        story: 'A minimal button with no background, used for subtle interactions.',
      },
    },
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link',
  },
  parameters: {
    docs: {
      description: {
        story: 'A button styled as a link, for navigation or external links.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
  parameters: {
    docs: {
      description: {
        story: 'A smaller button size for compact layouts.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
  parameters: {
    docs: {
      description: {
        story: 'A larger button size for prominent actions.',
      },
    },
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: '🚀',
  },
  parameters: {
    docs: {
      description: {
        story: 'An icon-only button, perfect for toolbars or minimal interfaces.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
  parameters: {
    docs: {
      description: {
        story: 'A disabled button state, preventing user interaction.',
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span className="mr-2">📧</span>
        Send Email
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with an icon for enhanced visual communication.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Button showing loading state with spinner and disabled interaction.',
      },
    },
  },
};

export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="outline">Cancel</Button>
      <Button variant="secondary">Save Draft</Button>
      <Button>Publish</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button group showing different variants used together.',
      },
    },
  },
};

export const ActionButtons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button size="sm">Edit</Button>
        <Button size="sm" variant="outline">Duplicate</Button>
        <Button size="sm" variant="destructive">Delete</Button>
      </div>
      <div className="flex gap-2">
        <Button>Primary Action</Button>
        <Button variant="secondary">Secondary Action</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common action button patterns for CRUD operations.',
      },
    },
  },
};

export const IconButtons: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button size="icon" variant="outline">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Button>
      <Button size="icon" variant="outline">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </Button>
      <Button size="icon" variant="outline">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icon-only buttons for toolbar and compact interfaces.',
      },
    },
  },
};

export const FormButtons: Story = {
  render: () => (
    <div className="flex justify-end gap-2">
      <Button variant="outline" type="button">Cancel</Button>
      <Button type="submit">Save Changes</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Typical form action buttons with cancel and submit.',
      },
    },
  },
};

export const CallToAction: Story = {
  render: () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome to our platform</h2>
      <p className="text-muted-foreground mb-6">Get started with your free trial today.</p>
      <div className="flex gap-4 justify-center">
        <Button size="lg">Start Free Trial</Button>
        <Button size="lg" variant="outline">Learn More</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Call-to-action buttons in a landing page context.',
      },
    },
  },
};

export const ResponsiveExample: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <Button className="w-full">Full Width Button</Button>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Responsive button behavior on mobile devices.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants displayed together for comparison.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🚀</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button sizes displayed together for comparison.',
      },
    },
  },
};




