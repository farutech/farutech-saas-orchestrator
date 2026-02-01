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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar/Avatar';
import { Button } from '../button/Button';
import { Badge } from '../badge/Badge';
import { Separator } from '../separator/Separator';
import { CalendarDays, MapPin, Users, Star } from 'lucide-react';


const meta: Meta<typeof HoverCard> = {
  title: 'UI/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A hover card component that displays additional information when hovering over a trigger element. Perfect for showing user profiles, tooltips with rich content, or contextual information.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'hover-card', 'tooltip', 'popover', 'interactive'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const UserProfile: Story = {
  render: () => (
    <div className="flex justify-center p-8">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" className="text-blue-600 hover:text-blue-800">
            @johndoe
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">John Doe</h4>
              <p className="text-sm text-muted-foreground">
                Senior Software Engineer at TechCorp
              </p>
              <div className="flex items-center pt-2">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground">
                  Joined December 2020
                </span>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-sm">San Francisco, CA</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-sm">Following 1,234 • 567 followers</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              View Profile
            </Button>
            <Button size="sm">Follow</Button>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'User profile hover card showing avatar, bio, location, and social stats.',
      },
    },
  },
};

export const ProductInfo: Story = {
  render: () => (
    <div className="flex justify-center p-8">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="ghost" className="text-left">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded"></div>
              <div>
                <div className="font-medium">Premium Plan</div>
                <div className="text-sm text-muted-foreground">$29/month</div>
              </div>
            </div>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold">Premium Plan</h4>
              <p className="text-sm text-muted-foreground">
                Unlock advanced features and unlimited usage
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                Unlimited API calls
              </div>
              <div className="flex items-center text-sm">
                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                Priority support
              </div>
              <div className="flex items-center text-sm">
                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                Advanced analytics
              </div>
              <div className="flex items-center text-sm">
                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                Custom integrations
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">$29</span>
              <Badge variant="secondary">Most Popular</Badge>
            </div>
            <Button className="w-full">Upgrade Now</Button>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Product information hover card with features and pricing.',
      },
    },
  },
};

export const StatusIndicator: Story = {
  render: () => (
    <div className="flex justify-center p-8">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Online</span>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">System Status</h4>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">All systems operational</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated: 2 minutes ago
            </p>
            <Separator />
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>API</span>
                <span className="text-green-600">99.9% uptime</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Database</span>
                <span className="text-green-600">100% uptime</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>CDN</span>
                <span className="text-green-600">99.8% uptime</span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Status indicator hover card showing system health and uptime.',
      },
    },
  },
};

export const FileInfo: Story = {
  render: () => (
    <div className="flex justify-center p-8">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="ghost" className="justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded text-xs text-white flex items-center justify-center">📄</div>
              <span className="text-sm">document.pdf</span>
            </div>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-72">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold">document.pdf</h4>
              <p className="text-xs text-muted-foreground">PDF Document</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Size:</span>
                <span>2.4 MB</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Modified:</span>
                <span>Dec 15, 2023</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Pages:</span>
                <span>12</span>
              </div>
            </div>
            <Separator />
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                Preview
              </Button>
              <Button size="sm" variant="outline">
                Download
              </Button>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'File information hover card showing metadata and actions.',
      },
    },
  },
};

export const NotificationPreview: Story = {
  render: () => (
    <div className="flex justify-center p-8">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="ghost" className="relative">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">3</span>
            </div>
            <span className="ml-2">Notifications</span>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Recent Notifications</h4>
            <div className="space-y-3">
              <div className="flex space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">John Doe</span> liked your post
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Sarah Miller</span> commented on your photo
                  </p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>TC</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">TechCorp</span> sent you a connection request
                  </p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
            <Separator />
            <Button variant="outline" className="w-full">
              View All Notifications
            </Button>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Notification preview hover card showing recent activity.',
      },
    },
  },
};

export const CodeSnippet: Story = {
  render: () => (
    <div className="flex justify-center p-8">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="outline" size="sm">
            <code className="text-xs">useHoverCard()</code>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-96">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">useHoverCard Hook</h4>
            <p className="text-sm text-muted-foreground">
              A custom hook for managing hover card state and interactions.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
              <pre className="text-xs overflow-x-auto">
                <code>{`const { isOpen, open, close } = useHoverCard({
  openDelay: 300,
  closeDelay: 100
});`}</code>
              </pre>
            </div>
            <div className="space-y-2">
              <div className="text-xs">
                <strong>Parameters:</strong>
              </div>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• <code>openDelay</code>: Delay before opening (ms)</li>
                <li>• <code>closeDelay</code>: Delay before closing (ms)</li>
              </ul>
            </div>
            <Button size="sm" variant="outline" className="w-full">
              View Documentation
            </Button>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Code snippet hover card with syntax highlighting and documentation.',
      },
    },
  },
};

export const ResponsiveHoverCard: Story = {
  render: () => (
    <div className="flex justify-center p-4">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            Hover me (Responsive)
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 sm:w-96">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Responsive Design</h4>
            <p className="text-sm text-muted-foreground">
              This hover card adapts to different screen sizes and provides optimal viewing experience across devices.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="text-xs font-medium">Mobile</h5>
                <p className="text-xs text-muted-foreground">
                  Touch-friendly interactions with appropriate sizing.
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="text-xs font-medium">Desktop</h5>
                <p className="text-xs text-muted-foreground">
                  Hover interactions with rich content display.
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <Badge variant="secondary">Responsive</Badge>
              <Badge variant="outline">Accessible</Badge>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Responsive hover card that adapts to different screen sizes.',
      },
    },
  },
};



