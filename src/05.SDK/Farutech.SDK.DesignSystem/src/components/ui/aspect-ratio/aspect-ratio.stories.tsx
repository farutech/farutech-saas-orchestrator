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
import { AspectRatio } from './aspect-ratio';


const meta: Meta<typeof AspectRatio> = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component that maintains a consistent aspect ratio for its content, useful for images, videos, and other media elements.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'aspect-ratio'],
  argTypes: {
    ratio: {
      control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
      description: 'The aspect ratio (width/height) to maintain.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <AspectRatio {...args} className="w-80 bg-muted rounded-lg overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
        alt="Mountain landscape"
        className="object-cover w-full h-full"
      />
    </AspectRatio>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Basic aspect ratio container with 16:9 ratio for images.',
      },
    },
  },
};

export const Square: Story = {
  args: {
    ratio: 1,
  },
  render: (args) => (
    <AspectRatio {...args} className="w-64 bg-muted rounded-lg overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop"
        alt="Square image"
        className="object-cover w-full h-full"
      />
    </AspectRatio>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Square aspect ratio (1:1) for profile pictures or thumbnails.',
      },
    },
  },
};

export const Portrait: Story = {
  args: {
    ratio: 3 / 4,
  },
  render: (args) => (
    <AspectRatio {...args} className="w-48 bg-muted rounded-lg overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=360&h=480&fit=crop"
        alt="Portrait image"
        className="object-cover w-full h-full"
      />
    </AspectRatio>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Portrait aspect ratio (3:4) commonly used for profile photos.',
      },
    },
  },
};

export const VideoContainer: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <AspectRatio {...args} className="w-full max-w-2xl bg-muted rounded-lg overflow-hidden">
      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <p className="text-lg font-semibold">Video Player</p>
          <p className="text-sm opacity-90">16:9 Aspect Ratio</p>
        </div>
      </div>
    </AspectRatio>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Aspect ratio container for video content with play button overlay.',
      },
    },
  },
};

export const CardWithImage: Story = {
  render: () => (
    <div className="w-80 bg-card rounded-lg shadow-sm border overflow-hidden">
      <AspectRatio ratio={16 / 9}>
        <img
          src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=640&h=360&fit=crop"
          alt="Card image"
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <div className="p-4">
        <h3 className="font-semibold text-lg">Card Title</h3>
        <p className="text-muted-foreground text-sm mt-1">
          This card maintains a consistent aspect ratio for its image content.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card component with aspect ratio controlled image header.',
      },
    },
  },
};

export const ResponsiveGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AspectRatio ratio={4 / 3} className="bg-muted rounded-lg overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
          alt="Grid image 1"
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <AspectRatio ratio={4 / 3} className="bg-muted rounded-lg overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
          alt="Grid image 2"
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <AspectRatio ratio={4 / 3} className="bg-muted rounded-lg overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
          alt="Grid image 3"
          className="object-cover w-full h-full"
        />
      </AspectRatio>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Grid layout with consistent aspect ratios across all images.',
      },
    },
  },
};

export const ResponsiveExample: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <div className="w-full max-w-sm">
      <AspectRatio {...args} className="bg-muted rounded-lg overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop"
          alt="Responsive image"
          className="object-cover w-full h-full"
        />
      </AspectRatio>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Aspect ratio container demonstrating responsive behavior.',
      },
    },
  },
};




