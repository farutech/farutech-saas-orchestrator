import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button/Button';
import { ToastAction } from './toast';
import { useToast } from '../../../hooks/use-toast';
import { Toaster } from '../toaster/Toaster';

const meta: Meta<typeof Toaster> = {
  title: 'UI/Toast',
  component: Toaster,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Toast notifications for displaying messages to users.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ToastDemo = ({ variant = 'default' }: { variant?: 'default' | 'destructive' }) => {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: variant === 'destructive' ? 'Error' : 'Success',
      description: variant === 'destructive'
        ? 'There was a problem with your request.'
        : 'Your action was completed successfully.',
      variant,
    });
  };

  return (
    <Button onClick={showToast}>
      Show {variant === 'destructive' ? 'Error' : 'Success'} Toast
    </Button>
  );
};

export const Default: Story = {
  render: () => <ToastDemo />,
};

export const Destructive: Story = {
  render: () => <ToastDemo variant="destructive" />,
};

export const WithAction: Story = {
  render: () => {
    const { toast } = useToast();

    const showToastWithAction = () => {
      toast({
        title: 'Scheduled: Catch up',
        description: 'Friday, February 10, 2023 at 5:57 PM',
        action: (
          <ToastAction altText="Undo" onClick={() => console.log('Undo clicked')}>
            Undo
          </ToastAction>
        ),
      });
    };

    return (
      <Button onClick={showToastWithAction}>
        Show Toast with Action
      </Button>
    );
  },
};

export const MultipleToasts: Story = {
  render: () => {
    const { toast } = useToast();

    const showMultipleToasts = () => {
      toast({
        title: 'First Toast',
        description: 'This is the first notification.',
      });

      setTimeout(() => {
        toast({
          title: 'Second Toast',
          description: 'This is the second notification.',
          variant: 'destructive',
        });
      }, 1000);

      setTimeout(() => {
        toast({
          title: 'Third Toast',
          description: 'This is the third notification with an action.',
          action: (
            <ToastAction altText="View" onClick={() => console.log('View clicked')}>
              View
            </ToastAction>
          ),
        });
      }, 2000);
    };

    return (
      <Button onClick={showMultipleToasts}>
        Show Multiple Toasts
      </Button>
    );
  },
};

export const LongContent: Story = {
  render: () => {
    const { toast } = useToast();

    const showLongToast = () => {
      toast({
        title: 'Important Update Available',
        description: 'A new version of the application is available for download. This update includes several bug fixes and performance improvements. Please update your application to continue receiving the latest features and security patches.',
      });
    };

    return (
      <Button onClick={showLongToast}>
        Show Long Toast
      </Button>
    );
  },
};

export const AutoClose: Story = {
  render: () => {
    const { toast } = useToast();

    const showAutoCloseToast = () => {
      toast({
        title: 'Auto-closing Toast',
        description: 'This toast will automatically close after 3 seconds.',
      });
    };

    return (
      <Button onClick={showAutoCloseToast}>
        Show Auto-closing Toast
      </Button>
    );
  },
};

export const ToastVariants: Story = {
  render: () => {
    const { toast } = useToast();

    const showSuccessToast = () => {
      toast({
        title: 'Success!',
        description: 'Your changes have been saved successfully.',
      });
    };

    const showErrorToast = () => {
      toast({
        title: 'Error',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive',
      });
    };

    const showInfoToast = () => {
      toast({
        title: 'Information',
        description: 'New features are available in the latest update.',
      });
    };

    return (
      <div className="flex gap-2">
        <Button onClick={showSuccessToast} variant="default">
          Success
        </Button>
        <Button onClick={showErrorToast} variant="destructive">
          Error
        </Button>
        <Button onClick={showInfoToast} variant="outline">
          Info
        </Button>
      </div>
    );
  },
};


