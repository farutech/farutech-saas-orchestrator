import type { Meta, StoryObj } from '@storybook/react';
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
import { ErrorBoundary } from './ErrorBoundary';

// Component that throws an error for testing
const ErrorComponent = () => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('Test error for ErrorBoundary');
  }

  return (
    <div className="p-4">
      <button
        onClick={() => setShouldError(true)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Trigger Error
      </button>
      <p className="mt-2 text-sm text-gray-600">Click to test ErrorBoundary</p>
    </div>
  );
};

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A robust error boundary component that catches JavaScript errors anywhere in the component tree, logs them, and displays a fallback UI. Prevents entire application crashes and provides user-friendly error handling with retry functionality.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'error-handling', 'boundary', 'resilience'],
  argTypes: {
    fallback: {
      control: { type: 'text' },
      description: 'Custom fallback component to render when an error occurs.',
    },
    onError: {
      action: 'error caught',
      description: 'Callback function called when an error is caught.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {
  args: {
    children: <ErrorComponent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default ErrorBoundary with standard error UI. Click the "Trigger Error" button to see the error boundary in action.',
      },
    },
  },
};

export const WithCustomFallback: Story = {
  args: {
    children: <ErrorComponent />,
    fallback: (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">🚨 Custom Error!</h2>
        <p className="text-gray-600">Something went wrong, but we have a custom fallback.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'ErrorBoundary with a custom fallback component that replaces the default error UI.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    children: <ErrorComponent />,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'ErrorBoundary displayed on mobile devices with responsive error UI.',
      },
    },
  },
};

export const TabletView: Story = {
  args: {
    children: <ErrorComponent />,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'ErrorBoundary on tablet-sized screens.',
      },
    },
  },
};

export const DesktopView: Story = {
  args: {
    children: <ErrorComponent />,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Full desktop view of the ErrorBoundary error state.',
      },
    },
  },
};