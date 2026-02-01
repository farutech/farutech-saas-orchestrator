import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './dialog';
import { Button } from '../button/button';

const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modal dialog component built on top of Radix UI Dialog primitives. Supports multiple sizes, custom content, and proper accessibility.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogDescription>
          This is a description of the dialog content.
        </DialogDescription>
        <p>This is the main content of the dialog.</p>
      </DialogContent>
    </Dialog>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Complete Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Dialog</DialogTitle>
          <DialogDescription>
            This dialog demonstrates all available slots and components.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>This is the main content area of the dialog.</p>
          <p>You can add any content here, including forms, images, or other components.</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Small: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Small Dialog</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogTitle>Small Dialog</DialogTitle>
        <DialogDescription>A compact dialog for simple confirmations.</DialogDescription>
        <p>This dialog uses the small size variant.</p>
      </DialogContent>
    </Dialog>
  ),
};

export const Large: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Large Dialog</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogTitle>Large Dialog</DialogTitle>
        <DialogDescription>A spacious dialog for complex content.</DialogDescription>
        <div className="space-y-4">
          <p>This dialog uses the large size variant, providing more space for content.</p>
          <p>You can include forms, tables, or any complex UI components here.</p>
          <div className="bg-muted p-4 rounded">
            <p>Example content block</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const ExtraLarge: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Extra Large Dialog</Button>
      </DialogTrigger>
      <DialogContent size="xl">
        <DialogTitle>Extra Large Dialog</DialogTitle>
        <DialogDescription>Maximum width dialog for extensive content.</DialogDescription>
        <div className="space-y-4">
          <p>This dialog uses the extra large size variant.</p>
          <p>Perfect for displaying wide tables, charts, or multi-column layouts.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded">
              <h4 className="font-medium">Column 1</h4>
              <p>Content for the first column.</p>
            </div>
            <div className="bg-muted p-4 rounded">
              <h4 className="font-medium">Column 2</h4>
              <p>Content for the second column.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Full Width Dialog</Button>
      </DialogTrigger>
      <DialogContent size="full">
        <DialogTitle>Full Width Dialog</DialogTitle>
        <DialogDescription>A dialog that spans almost the full viewport.</DialogDescription>
        <div className="space-y-4">
          <p>This dialog uses the full size variant, utilizing most of the screen space.</p>
          <p>Ideal for immersive experiences or when you need maximum space for content.</p>
          <div className="bg-muted p-8 rounded text-center">
            <p className="text-lg font-medium">Centered Content</p>
            <p>This content is centered in the full-width dialog.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog (No Close Button)</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogTitle>No Close Button</DialogTitle>
        <DialogDescription>This dialog doesn't have a close button in the corner.</DialogDescription>
        <p>The dialog can still be closed by clicking the overlay or using the footer buttons.</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Custom Dialog</Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-primary bg-primary/5">
        <DialogTitle className="text-primary">Custom Styled Dialog</DialogTitle>
        <DialogDescription>This dialog has custom styling applied.</DialogDescription>
        <p>The dialog content has a custom background and border color.</p>
      </DialogContent>
    </Dialog>
  ),
};

export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this item? This action cannot be undone.
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
};

export const FormDialog: Story = {
  render: () => {
    const [step, setStep] = useState(1);

    return (
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
              <label htmlFor="name" className="text-right text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                defaultValue="John Doe"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                defaultValue="john@example.com"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
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
    );
  },
};
