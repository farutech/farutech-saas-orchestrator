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
import { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';
import { Button } from '../button/Button';
import { Input } from '../input/Input';
import { Label } from '../label/Label';
import { Textarea } from '../textarea/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select/Select';
import { Checkbox } from '../checkbox/Checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar/Avatar';
import { Badge } from '../badge/Badge';


const meta: Meta<typeof Drawer> = {
  title: 'UI/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A slide-out drawer component that appears from the side of the screen. Perfect for mobile navigation, detailed forms, and secondary content.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'drawer', 'slide-out', 'mobile', 'navigation'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Basic drawer with confirmation dialog content.',
      },
    },
  },
};

export const ControlledDrawer: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">Open Controlled Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Controlled Drawer</DrawerTitle>
            <DrawerDescription>
              This drawer is controlled by external state. Current state: {open ? 'open' : 'closed'}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-2">
            <p>You can control this drawer programmatically.</p>
          </div>
          <DrawerFooter>
            <Button onClick={() => setOpen(false)}>Close Drawer</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Drawer controlled by external state management.',
      },
    },
  },
};

export const FormDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Add New Item</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Item</DrawerTitle>
          <DrawerDescription>
            Add a new item to your collection. Fill in the details below.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter description" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" placeholder="Enter category" />
          </div>
        </div>
        <DrawerFooter>
          <Button>Save Item</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Drawer containing a form for creating new items.',
      },
    },
  },
};

export const NavigationDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">☰ Menu</Button>
      </DrawerTrigger>
      <DrawerContent className="left-0 right-auto w-80">
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerDescription>
            Navigate through different sections of the application.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-2">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <span className="mr-2">📊</span>
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <span className="mr-2">📁</span>
              Projects
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <span className="mr-2">👥</span>
              Team
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <span className="mr-2">⚙️</span>
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <span className="mr-2">❓</span>
              Help
            </Button>
          </nav>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close Menu
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side navigation drawer for mobile applications.',
      },
    },
  },
};

export const UserProfileDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          John Doe
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <DrawerTitle>John Doe</DrawerTitle>
              <DrawerDescription>john.doe@example.com</DrawerDescription>
              <Badge variant="secondary" className="mt-1">Premium User</Badge>
            </div>
          </div>
        </DrawerHeader>
        <div className="px-4 py-2 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Account Settings</h4>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                Profile Information
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Security Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Notification Preferences
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Support</h4>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                Help Center
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button variant="destructive" className="w-full">
            Sign Out
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'User profile drawer with account information and settings.',
      },
    },
  },
};

export const ShoppingCartDrawer: Story = {
  render: () => {
    const cartItems = [
      { id: 1, name: 'Wireless Headphones', price: 99.99, quantity: 1 },
      { id: 2, name: 'Bluetooth Speaker', price: 49.99, quantity: 2 },
      { id: 3, name: 'USB Cable', price: 9.99, quantity: 1 },
    ];

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">
            🛒 Cart ({cartItems.length})
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Shopping Cart</DrawerTitle>
            <DrawerDescription>
              Review your items before checkout.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button className="w-full">Checkout</Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Shopping cart drawer with item list and checkout functionality.',
      },
    },
  },
};

export const SettingsDrawer: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [theme, setTheme] = useState('system');

    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">⚙️ Settings</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerDescription>
              Manage your account settings and preferences.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-2 space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Notifications</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-sm">
                  Enable email notifications
                </Label>
                <Checkbox
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme" className="text-sm font-medium">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DrawerFooter>
            <Button className="w-full">Save Settings</Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Settings drawer with various configuration options.',
      },
    },
  },
};

export const ScrollableContentDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Terms & Conditions</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Terms and Conditions</DrawerTitle>
          <DrawerDescription>
            Please read and accept the terms and conditions.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-2 max-h-[400px] overflow-y-auto">
          <div className="space-y-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <h4 className="text-sm font-medium">Section {i + 1}</h4>
                <p className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
            ))}
          </div>
        </div>
        <DrawerFooter>
          <div className="flex items-center space-x-2 w-full">
            <Checkbox id="accept" />
            <Label htmlFor="accept" className="text-sm">
              I accept the terms and conditions
            </Label>
          </div>
          <div className="flex gap-2 w-full">
            <Button className="flex-1">Accept</Button>
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1">
                Decline
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Drawer with scrollable long content and acceptance checkbox.',
      },
    },
  },
};

export const MobileResponsiveDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          ☰
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full sm:w-80">
        <DrawerHeader>
          <DrawerTitle>Mobile Menu</DrawerTitle>
          <DrawerDescription>
            Navigation optimized for mobile devices.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-2">
          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-left">
              <span className="mr-3">🏠</span>
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              <span className="mr-3">🔍</span>
              Search
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              <span className="mr-3">❤️</span>
              Favorites
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              <span className="mr-3">👤</span>
              Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              <span className="mr-3">⚙️</span>
              Settings
            </Button>
          </nav>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized drawer with responsive design.',
      },
    },
  },
};



