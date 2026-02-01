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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './carousel';
import { Card, CardContent } from '../card/card';


const meta: Meta<typeof Carousel> = {
  title: 'UI/Carousel',
  component: Carousel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible carousel component for displaying content in a horizontally scrollable container with navigation controls.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'carousel', 'slider'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Basic carousel with numbered cards and navigation controls.',
      },
    },
  },
};

export const ProductShowcase: Story = {
  render: () => (
    <Carousel className="w-full max-w-4xl">
      <CarouselContent>
        {[
          { name: 'Wireless Headphones', price: '$299', color: 'from-blue-500 to-purple-600' },
          { name: 'Smart Watch', price: '$399', color: 'from-green-500 to-teal-600' },
          { name: 'Laptop', price: '$1299', color: 'from-red-500 to-pink-600' },
          { name: 'Tablet', price: '$599', color: 'from-yellow-500 to-orange-600' },
          { name: 'Phone', price: '$899', color: 'from-indigo-500 to-blue-600' },
        ].map((product, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <div className={`aspect-square bg-gradient-to-br ${product.color} rounded-t-lg`}></div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-2xl font-bold text-green-600 mt-2">{product.price}</p>
                  <button className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors">
                    Add to Cart
                  </button>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  parameters: {
    docs: {
      description: {
        story: 'E-commerce product showcase carousel with images and pricing.',
      },
    },
  },
};

export const ImageGallery: Story = {
  render: () => (
    <Carousel className="w-full max-w-2xl">
      <CarouselContent>
        {[
          { alt: 'Mountain landscape', color: 'from-blue-400 to-blue-600' },
          { alt: 'Forest path', color: 'from-green-400 to-green-600' },
          { alt: 'Ocean sunset', color: 'from-orange-400 to-red-600' },
          { alt: 'City skyline', color: 'from-purple-400 to-purple-600' },
          { alt: 'Desert dunes', color: 'from-yellow-400 to-yellow-600' },
        ].map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <div className={`aspect-video bg-gradient-to-br ${image.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white text-xl font-semibold">{image.alt}</span>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Image gallery carousel for showcasing photos or artwork.',
      },
    },
  },
};

export const TestimonialCarousel: Story = {
  render: () => (
    <Carousel className="w-full max-w-4xl">
      <CarouselContent>
        {[
          {
            name: 'Sarah Johnson',
            role: 'Product Manager',
            company: 'TechCorp',
            quote: 'This platform has revolutionized how we manage our projects. The intuitive interface and powerful features make our team more productive than ever.',
            avatar: 'SJ'
          },
          {
            name: 'Michael Chen',
            role: 'Developer',
            company: 'StartupXYZ',
            quote: 'The development experience is outstanding. Clean APIs, excellent documentation, and great performance. Highly recommended for any development team.',
            avatar: 'MC'
          },
          {
            name: 'Emily Rodriguez',
            role: 'Designer',
            company: 'DesignStudio',
            quote: 'Beautiful design system that\'s both flexible and consistent. Our users love the polished interface and our designers appreciate the comprehensive component library.',
            avatar: 'ER'
          },
        ].map((testimonial, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                  <blockquote className="text-muted-foreground italic flex-grow">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex text-yellow-400 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Customer testimonial carousel with avatars and ratings.',
      },
    },
  },
};

export const Vertical: Story = {
  render: () => (
    <Carousel
      orientation="vertical"
      className="w-full max-w-xs"
      opts={{
        align: 'start',
      }}
    >
      <CarouselContent className="-mt-1 h-[300px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="pt-1 basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <span className="text-2xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Vertical carousel for displaying content in a column layout.',
      },
    },
  },
};

export const WithContent: Story = {
  render: () => (
    <Carousel className="w-full max-w-4xl">
      <CarouselContent>
        {[
          {
            title: 'Welcome to Our Platform',
            description: 'Discover amazing features designed to boost your productivity and streamline your workflow.',
            icon: '🚀'
          },
          {
            title: 'Powerful Analytics',
            description: 'Get deep insights into your data with our comprehensive analytics dashboard and reporting tools.',
            icon: '📊'
          },
          {
            title: 'Team Collaboration',
            description: 'Work seamlessly with your team using real-time collaboration tools and shared workspaces.',
            icon: '👥'
          },
          {
            title: 'Security First',
            description: 'Your data is protected with enterprise-grade security measures and compliance standards.',
            icon: '🔒'
          },
        ].map((slide, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <div className="text-6xl">{slide.icon}</div>
                  <h3 className="text-2xl font-bold">{slide.title}</h3>
                  <p className="text-muted-foreground max-w-md">{slide.description}</p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Content carousel for onboarding flows or feature showcases.',
      },
    },
  },
};

export const MultipleItems: Story = {
  render: () => (
    <Carousel
      className="w-full max-w-5xl"
      opts={{
        align: 'start',
      }}
    >
      <CarouselContent>
        {Array.from({ length: 12 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Carousel showing multiple items per view with responsive breakpoints.',
      },
    },
  },
};

export const NewsCarousel: Story = {
  render: () => (
    <Carousel className="w-full max-w-6xl">
      <CarouselContent>
        {[
          {
            title: 'Breaking: Major Tech Announcement',
            excerpt: 'Industry leaders unveil groundbreaking new technology that promises to revolutionize the sector...',
            category: 'Technology',
            time: '2 hours ago'
          },
          {
            title: 'Market Analysis: Q4 Trends',
            excerpt: 'Economic indicators show strong growth in emerging markets with significant opportunities...',
            category: 'Business',
            time: '4 hours ago'
          },
          {
            title: 'Climate Summit Reaches Agreement',
            excerpt: 'World leaders commit to ambitious new targets for reducing carbon emissions globally...',
            category: 'Environment',
            time: '6 hours ago'
          },
          {
            title: 'Sports Championship Finals',
            excerpt: 'Intense competition leads to dramatic finish in the most anticipated sporting event of the year...',
            category: 'Sports',
            time: '8 hours ago'
          },
        ].map((news, index) => (
          <CarouselItem key={index} className="md:basis-1/2">
            <div className="p-1">
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      {news.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{news.time}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{news.title}</h3>
                  <p className="text-muted-foreground line-clamp-3">{news.excerpt}</p>
                  <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Read More →
                  </button>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  parameters: {
    docs: {
      description: {
        story: 'News article carousel with categories and excerpts.',
      },
    },
  },
};

export const ResponsiveExample: Story = {
  render: () => (
    <div className="w-full">
      <Carousel className="w-full">
        <CarouselContent>
          {Array.from({ length: 8 }).map((_, index) => (
            <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-lg font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Responsive carousel that adapts the number of visible items based on screen size.',
      },
    },
  },
};

export const HeroCarousel: Story = {
  render: () => (
    <Carousel className="w-full max-w-7xl">
      <CarouselContent>
        {[
          {
            title: 'Welcome to Innovation',
            subtitle: 'Discover the future of technology',
            cta: 'Get Started',
            gradient: 'from-blue-600 to-purple-700'
          },
          {
            title: 'Power Your Business',
            subtitle: 'Scalable solutions for growing companies',
            cta: 'Learn More',
            gradient: 'from-green-600 to-teal-700'
          },
          {
            title: 'Join the Community',
            subtitle: 'Connect with like-minded professionals',
            cta: 'Join Now',
            gradient: 'from-orange-600 to-red-700'
          },
        ].map((slide, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="border-0 shadow-none">
                <div className={`aspect-[16/9] bg-gradient-to-r ${slide.gradient} rounded-lg flex items-center justify-center text-white`}>
                  <div className="text-center space-y-6 max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold">{slide.title}</h1>
                    <p className="text-xl md:text-2xl opacity-90">{slide.subtitle}</p>
                    <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Hero section carousel for landing pages with call-to-action buttons.',
      },
    },
  },
};



