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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './dialog';
import { Button } from '../button/Button';
import { Input } from '../input/Input';
import { Label } from '../label/Label';
import { Textarea } from '../textarea/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select/Select';
import { Checkbox } from '../checkbox/Checkbox';


const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modal dialog component for displaying content in an overlay. Perfect for forms, confirmations, and detailed information displays.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'dialog', 'modal', 'overlay'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description of the dialog content.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Dialog content goes here.</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Basic dialog with header, content, and footer.',
      },
    },
  },
};

export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="John Doe" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" type="email" defaultValue="john@example.com" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Textarea id="bio" placeholder="Tell us about yourself..." className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dialog containing a form with various input types.',
      },
    },
  },
};

export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the item and remove it from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Confirmation dialog for destructive actions.',
      },
    },
  },
};

export const LargeContentDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Large Dialog</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            Complete information about this product including specifications and features.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Wireless Headphones</h3>
                <p className="text-sm text-muted-foreground">Premium audio experience</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Key Features</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Active noise cancellation</li>
                  <li>• 30-hour battery life</li>
                  <li>• Premium sound quality</li>
                  <li>• Comfortable fit</li>
                  <li>• Touch controls</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Specifications</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Driver Size:</span>
                    <span>40mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frequency Response:</span>
                    <span>20Hz - 20kHz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impedance:</span>
                    <span>32Ω</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight:</span>
                    <span>250g</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">What's in the box</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Wireless Headphones</li>
                  <li>• USB-C Charging Cable</li>
                  <li>• Carrying Case</li>
                  <li>• User Manual</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button>Add to Cart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Large dialog with scrollable content and detailed information.',
      },
    },
  },
};

export const SettingsDialog: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [theme, setTheme] = useState('system');

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Settings</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Notifications</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
                <Label htmlFor="notifications" className="text-sm">
                  Enable email notifications
                </Label>
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Settings dialog with form controls and state management.',
      },
    },
  },
};

export const NewsletterDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Subscribe to Newsletter</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Stay Updated</DialogTitle>
          <DialogDescription>
            Subscribe to our newsletter to receive the latest updates and news.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="text-sm">
              I agree to receive marketing communications
            </Label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Subscribe</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Newsletter subscription dialog with form validation.',
      },
    },
  },
};

export const ResponsiveDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-full mx-4">
        <DialogHeader>
          <DialogTitle>Responsive Dialog</DialogTitle>
          <DialogDescription>
            This dialog adapts to different screen sizes automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">
            The dialog content adjusts based on the viewport size. On mobile devices,
            it takes up more screen space, while on desktop it maintains a comfortable reading width.
          </p>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
          </DialogClose>
          <Button className="w-full sm:w-auto">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Responsive dialog that adapts to mobile and desktop viewports.',
      },
    },
  },
};

export const NestedDialog: Story = {
  render: () => {
    const [step, setStep] = useState(1);

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Start Process</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Multi-Step Process</DialogTitle>
            <DialogDescription>
              Complete this process in multiple steps.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-medium">Step 1: Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-medium">Step 2: Preferences</h3>
                <div className="space-y-2">
                  <Label htmlFor="preference">Preference</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-medium">Step 3: Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  Please review your information before submitting.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <DialogClose asChild>
                <Button>Complete</Button>
              </DialogClose>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-step dialog with navigation between different content sections.',
      },
    },
  },
};



