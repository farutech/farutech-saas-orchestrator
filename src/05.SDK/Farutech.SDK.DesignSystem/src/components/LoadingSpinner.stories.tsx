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
import { LoadingSpinner } from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A smooth, animated loading spinner component with multiple size variants and optional text. Supports fullscreen overlay mode for loading states that require user attention. Built with Framer Motion for smooth animations.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'loading', 'spinner', 'animation', 'feedback'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'The size variant of the loading spinner.',
    },
    text: {
      control: { type: 'text' },
      description: 'Optional text to display alongside the spinner.',
    },
    fullScreen: {
      control: { type: 'boolean' },
      description: 'Whether to display the spinner as a fullscreen overlay.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply to the spinner container.',
    },
    orientation: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
      description: "Spin orientation: 'vertical' rotates around Y, 'horizontal' around X.",
    },
    showText: {
      control: { type: 'boolean' },
      description: 'Whether to show the text when provided.',
    },
    textPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
      description: 'Position of the optional text relative to the spinner.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {
  args: {
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default loading spinner with medium size and smooth rotation animation.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small loading spinner suitable for inline loading states.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large loading spinner for prominent loading states.',
      },
    },
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
  parameters: {
    docs: {
      description: {
        story: 'Extra large loading spinner for maximum visibility.',
      },
    },
  },
};

export const WithText: Story = {
  args: {
    size: 'md',
    text: 'Loading...',
    showText: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading spinner with accompanying text for better user feedback.',
      },
    },
  },
};

export const FullScreen: Story = {
  args: {
    size: 'lg',
    text: 'Please wait...',
    showText: true,
    fullScreen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Fullscreen loading overlay that covers the entire viewport with backdrop blur.',
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    size: 'md',
    className: 'text-blue-500',
    text: 'Custom styled',
    showText: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading spinner with custom CSS classes applied.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    size: 'sm',
    text: 'Loading...',
    showText: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Loading spinner optimized for mobile devices.',
      },
    },
  },
};

export const TabletView: Story = {
  args: {
    size: 'md',
    text: 'Loading...',
    showText: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Loading spinner on tablet-sized screens.',
      },
    },
  },
};

export const DesktopView: Story = {
  args: {
    size: 'lg',
    text: 'Loading...',
    showText: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Full desktop view of the loading spinner.',
      },
    },
  },
};

export const VortexLogoSlow: Story = {
  args: {
    size: 'lg',
    text: 'Cargando...',
    vortex: true,
    logoSrc: '/logo.png',
    speed: 0.6,
  },
  parameters: {
    docs: {
      description: {
        story: 'Vortex spinner usando el logo principal con velocidad lenta para efecto profesional.',
      },
    },
  },
};

export const VortexLogoFast: Story = {
  args: {
    size: 'lg',
    text: 'Cargando rápido...',
    vortex: true,
    logoSrc: '/logo.png',
    speed: 1.8,
  },
  parameters: {
    docs: {
      description: {
        story: 'Vortex spinner usando el logo principal con velocidad rápida para micro-interacciones.',
      },
    },
  },
};