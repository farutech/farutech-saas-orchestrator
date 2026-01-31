import type { Meta, StoryObj } from '@storybook/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './carousel';
import { Card, CardContent } from './card';

const meta: Meta<typeof Carousel> = {
  title: 'UI/Carousel',
  component: Carousel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Small Carousel</h3>
        <Carousel className="w-full max-w-sm">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
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
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Medium Carousel</h3>
        <Carousel className="w-full max-w-md">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-3xl font-semibold">{index + 1}</span>
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

      <div>
        <h3 className="text-lg font-semibold mb-4">Large Carousel</h3>
        <Carousel className="w-full max-w-lg">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
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
      </div>
    </div>
  ),
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
      <CarouselContent className="-mt-1 h-[200px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="pt-1 md:basis-1/2">
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
};

export const WithContent: Story = {
  render: () => (
    <Carousel className="w-full max-w-2xl">
      <CarouselContent>
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex flex-col aspect-[4/3] items-center justify-center p-6 space-y-4">
                <h3 className="text-xl font-semibold">Welcome</h3>
                <p className="text-center text-muted-foreground">
                  Discover our amazing features and capabilities.
                </p>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex flex-col aspect-[4/3] items-center justify-center p-6 space-y-4">
                <h3 className="text-xl font-semibold">Powerful</h3>
                <p className="text-center text-muted-foreground">
                  Built with modern technologies for optimal performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex flex-col aspect-[4/3] items-center justify-center p-6 space-y-4">
                <h3 className="text-xl font-semibold">Accessible</h3>
                <p className="text-center text-muted-foreground">
                  Designed with accessibility in mind for all users.
                </p>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex flex-col aspect-[4/3] items-center justify-center p-6 space-y-4">
                <h3 className="text-xl font-semibold">Customizable</h3>
                <p className="text-center text-muted-foreground">
                  Easily customize to match your brand and needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const Autoplay: Story = {
  render: () => (
    <Carousel
      className="w-full max-w-xs"
      opts={{
        loop: true,
      }}
      plugins={[
        // Note: Autoplay plugin would need to be installed and imported
        // Autoplay({ delay: 2000 })
      ]}
    >
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
};

export const MultipleItems: Story = {
  render: () => (
    <Carousel
      className="w-full max-w-4xl"
      opts={{
        align: 'start',
      }}
    >
      <CarouselContent>
        {Array.from({ length: 10 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
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
};


