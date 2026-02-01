import type { Meta, StoryObj } from '@storybook/react';
import { Database, Users, Settings, BarChart3 } from 'lucide-react';

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
import { ModuleCard } from './ModuleCard';

const meta: Meta<typeof ModuleCard> = {
  title: 'Components/ModuleCard',
  component: ModuleCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive module card component for displaying SDK modules with status indicators, version information, and interactive states. Features hover animations, loading states, and multiple status variants for effective module management.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'module', 'card', 'dashboard', 'status'],
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'The title of the module card.',
    },
    description: {
      control: { type: 'text' },
      description: 'The description text for the module.',
    },
    status: {
      control: { type: 'select' },
      options: ['active', 'inactive', 'maintenance', 'beta'],
      description: 'The current status of the module.',
    },
    version: {
      control: { type: 'text' },
      description: 'The version number of the module.',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Whether the module card is in a loading state.',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Whether to apply animation effects to the card.',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback function called when the card is clicked.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ModuleCard>;

export const Default: Story = {
  args: {
    title: 'User Management',
    description: 'Manage users, roles, and permissions across the platform.',
    icon: Users,
    status: 'active',
    version: '1.2.3',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default module card with active status and version information.',
      },
    },
  },
};

export const ActiveStatus: Story = {
  args: {
    title: 'Analytics Dashboard',
    description: 'Real-time analytics and reporting for business intelligence.',
    icon: BarChart3,
    status: 'active',
    version: '2.1.0',
  },
  parameters: {
    docs: {
      description: {
        story: 'Module card with active status indicating the module is fully operational.',
      },
    },
  },
};

export const BetaStatus: Story = {
  args: {
    title: 'AI Assistant',
    description: 'Experimental AI-powered assistant for enhanced productivity.',
    icon: Settings,
    status: 'beta',
    version: '0.8.1-beta',
  },
  parameters: {
    docs: {
      description: {
        story: 'Module card in beta status, indicating it\'s in testing phase.',
      },
    },
  },
};

export const MaintenanceStatus: Story = {
  args: {
    title: 'Legacy System',
    description: 'Deprecated system undergoing maintenance.',
    icon: Database,
    status: 'maintenance',
    version: '1.0.0',
  },
  parameters: {
    docs: {
      description: {
        story: 'Module card in maintenance status, showing it\'s temporarily unavailable.',
      },
    },
  },
};

export const InactiveStatus: Story = {
  args: {
    title: 'Archived Module',
    description: 'This module has been archived and is no longer available.',
    icon: Settings,
    status: 'inactive',
    version: '0.9.0',
  },
  parameters: {
    docs: {
      description: {
        story: 'Module card with inactive status for archived or disabled modules.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    title: 'Data Processing',
    description: 'Heavy data processing module currently initializing.',
    icon: Database,
    status: 'active',
    isLoading: true,
    version: '1.3.0',
  },
  parameters: {
    docs: {
      description: {
        story: 'Module card in loading state with reduced opacity and disabled interactions.',
      },
    },
  },
};

export const Animated: Story = {
  args: {
    title: 'Interactive Module',
    description: 'Module with enhanced animations for better user experience.',
    icon: BarChart3,
    status: 'active',
    animated: true,
    version: '1.4.0',
  },
  parameters: {
    docs: {
      description: {
        story: 'Module card with animation effects enabled.',
      },
    },
  },
};

export const Clickable: Story = {
  args: {
    title: 'Configurable Module',
    description: 'Click to configure this module\'s settings.',
    icon: Settings,
    status: 'active',
    version: '1.1.0',
    onClick: () => alert('Module clicked!'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive module card that responds to click events.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    title: 'Mobile Analytics',
    description: 'Analytics optimized for mobile devices.',
    icon: BarChart3,
    status: 'active',
    version: '1.2.0',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Module card optimized for mobile device layouts.',
      },
    },
  },
};

export const TabletView: Story = {
  args: {
    title: 'Tablet Dashboard',
    description: 'Dashboard designed for tablet interfaces.',
    icon: Users,
    status: 'active',
    version: '1.2.0',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Module card displayed on tablet-sized screens.',
      },
    },
  },
};

export const DesktopView: Story = {
  args: {
    title: 'Enterprise Module',
    description: 'Full-featured enterprise module for large-scale deployments.',
    icon: Database,
    status: 'active',
    version: '2.0.0',
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Full desktop view of the module card with optimal spacing.',
      },
    },
  },
};