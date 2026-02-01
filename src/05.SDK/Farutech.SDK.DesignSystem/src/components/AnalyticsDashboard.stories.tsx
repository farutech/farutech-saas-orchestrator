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
import { AnalyticsDashboard } from './AnalyticsDashboard';

const meta: Meta<typeof AnalyticsDashboard> = {
  title: 'Components/AnalyticsDashboard',
  component: AnalyticsDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive analytics dashboard component that displays SDK usage statistics, installation metrics, and version information. Provides visual insights into the adoption and performance of the Farutech SDK across different projects.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'analytics', 'dashboard', 'sdk'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof AnalyticsDashboard>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'The default AnalyticsDashboard displays key SDK metrics including total installs, active projects, and the latest version number.',
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
        story: 'AnalyticsDashboard optimized for mobile devices, showing condensed metrics in a responsive layout.',
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
        story: 'AnalyticsDashboard displayed on tablet-sized screens with appropriate spacing and layout adjustments.',
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
        story: 'Full desktop view of the AnalyticsDashboard with maximum information density and visual impact.',
      },
    },
  },
};