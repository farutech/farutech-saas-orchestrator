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
import { SDKVersionDashboard } from './SDKVersionDashboard';

// Mock data for Storybook
const mockVersions = [
  {
    version: '2026.01.31.0',
    tag: 'v2026.01.31.0',
    published: '2026-01-31',
    commit: 'abc1234',
    environment: 'prod' as const,
  },
  {
    version: '2026.01.30.1',
    tag: 'v2026.01.30.1',
    published: '2026-01-30',
    commit: 'def5678',
    environment: 'staging' as const,
  },
  {
    version: '2026.01.29.0-beta',
    tag: 'v2026.01.29.0-beta',
    published: '2026-01-29',
    commit: 'ghi9012',
    environment: 'qa' as const,
  },
];

const meta: Meta<typeof SDKVersionDashboard> = {
  title: 'Components/SDKVersionDashboard',
  component: SDKVersionDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive dashboard for tracking SDK versions, releases, and deployment environments. Displays current version information, version history, and environment status for effective SDK version management and deployment tracking.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'dashboard', 'versioning', 'sdk', 'releases'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof SDKVersionDashboard>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default SDK version dashboard showing current version and available releases.',
      },
    },
  },
};

export const WithMockData: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'SDK version dashboard with mock data for demonstration purposes.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'SDK version dashboard optimized for mobile devices with responsive layout.',
      },
    },
  },
};

export const TabletView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'SDK version dashboard displayed on tablet-sized screens.',
      },
    },
  },
};

export const DesktopView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Full desktop view of the SDK version dashboard with complete information display.',
      },
    },
  },
};