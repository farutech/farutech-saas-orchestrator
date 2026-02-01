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
import { Alert, AlertTitle, AlertDescription } from './alert';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';


const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A notification component for displaying important messages to users. Supports different variants for various types of notifications like errors, warnings, and success messages.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'alert'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive'],
      description: 'The visual style variant of the alert.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="w-96">
      <Info className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is a default alert with some information.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Basic informational alert with default styling.',
      },
    },
  },
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-96">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong. Please try again.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Error alert for displaying critical issues or failures.',
      },
    },
  },
};

export const Success: Story = {
  render: () => (
    <Alert className="w-96 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">Success</AlertTitle>
      <AlertDescription className="text-green-700">
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Success alert for positive feedback and confirmations.',
      },
    },
  },
};

export const Warning: Story = {
  render: () => (
    <Alert className="w-96 border-yellow-200 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Warning</AlertTitle>
      <AlertDescription className="text-yellow-700">
        Please review your input before proceeding.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Warning alert for cautionary messages and potential issues.',
      },
    },
  },
};

export const Simple: Story = {
  render: () => (
    <Alert className="w-96">
      <AlertDescription>
        Simple alert without title.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Minimal alert with only description text.',
      },
    },
  },
};

export const WithActions: Story = {
  render: () => (
    <Alert className="w-96">
      <Info className="h-4 w-4" />
      <AlertTitle>Update Available</AlertTitle>
      <AlertDescription>
        A new version is available. Would you like to update now?
        <div className="mt-3 flex space-x-2">
          <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
            Update Now
          </button>
          <button className="px-3 py-1 text-sm border rounded hover:bg-accent">
            Remind Later
          </button>
        </div>
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alert with action buttons for user interaction.',
      },
    },
  },
};

export const Dismissible: Story = {
  render: () => (
    <Alert className="w-96 relative">
      <Info className="h-4 w-4" />
      <AlertTitle>Notification</AlertTitle>
      <AlertDescription>
        This is a dismissible alert. You can close it using the X button.
      </AlertDescription>
      <button className="absolute top-2 right-2 h-6 w-6 rounded-full hover:bg-accent flex items-center justify-center">
        <span className="text-sm">×</span>
      </button>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alert with dismiss functionality for user control.',
      },
    },
  },
};

export const ResponsiveExample: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Mobile Alert</AlertTitle>
        <AlertDescription>
          This alert adapts to different screen sizes automatically.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Alert demonstrating responsive behavior on mobile devices.',
      },
    },
  },
};



