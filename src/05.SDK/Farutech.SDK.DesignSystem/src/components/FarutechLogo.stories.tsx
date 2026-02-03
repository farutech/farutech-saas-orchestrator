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
import { FarutechLogo } from './FarutechLogo';

const meta: Meta<typeof FarutechLogo> = {
  title: 'Components/FarutechLogo',
  component: FarutechLogo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The official Farutech logo component with multiple size variants, animation options, and fallback support. Displays the Farutech brand identity with consistent styling across the application.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'logo', 'brand', 'identity'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'The size variant of the logo.',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Whether to apply animation effects to the logo.',
    },
    showText: {
      control: { type: 'boolean' },
      description: 'Whether to display the "Farutech" text alongside the logo.',
    },
    usePng: {
      control: { type: 'boolean' },
      description: 'Whether to use PNG image or fallback to icon component.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply to the logo container.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FarutechLogo>;

export const Default: Story = {
  args: {
    size: 'md',
    animated: false,
    showText: true,
    usePng: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default logo configuration with medium size, text visible, and PNG image enabled.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    showText: true,
    usePng: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Small logo variant suitable for compact spaces like navigation bars.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    showText: true,
    usePng: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large logo variant for hero sections or prominent branding areas.',
      },
    },
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    showText: true,
    usePng: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Extra large logo for maximum visual impact in marketing materials.',
      },
    },
  },
};

export const IconOnly: Story = {
  args: {
    size: 'md',
    showText: false,
    usePng: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Logo icon only, without the text. Useful for favicons or minimal branding.',
      },
    },
  },
};

export const Animated: Story = {
  args: {
    size: 'lg',
    animated: true,
    showText: true,
    usePng: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated logo with motion effects for enhanced visual appeal.',
      },
    },
  },
};

export const BrandOnlyWithSpinner: Story = {
  args: {
    size: 'lg',
    animated: true,
    showText: false,
    usePng: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Logo displayed alongside a professional vortex spinner in integration scenarios.',
      },
    },
  },
};

export const FallbackIcon: Story = {
  args: {
    size: 'md',
    showText: true,
    usePng: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Logo using the fallback icon component instead of PNG image.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    size: 'sm',
    showText: true,
    usePng: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Logo optimized for mobile devices with appropriate sizing.',
      },
    },
  },
};

export const TabletView: Story = {
  args: {
    size: 'md',
    showText: true,
    usePng: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Logo displayed on tablet-sized screens.',
      },
    },
  },
};

export const DesktopView: Story = {
  args: {
    size: 'lg',
    showText: true,
    usePng: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Full desktop view of the logo with optimal sizing.',
      },
    },
  },
};