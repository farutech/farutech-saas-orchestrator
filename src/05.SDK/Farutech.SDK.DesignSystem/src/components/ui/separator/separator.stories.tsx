import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card/Card';
import { Badge } from '../badge/Badge';

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div>
        <h4 className="text-sm font-medium leading-none">Account</h4>
        <p className="text-sm text-muted-foreground">Manage your account settings.</p>
      </div>
      <Separator />
      <div>
        <h4 className="text-sm font-medium leading-none">Notifications</h4>
        <p className="text-sm text-muted-foreground">Configure notification preferences.</p>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center space-x-4 text-sm">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Team Members</h4>
        <p className="text-sm text-muted-foreground">
          Invite your team members to collaborate.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>John Doe</div>
        <Separator orientation="vertical" />
        <div>johndoe@example.com</div>
        <Separator orientation="vertical" />
        <Badge variant="secondary">Admin</Badge>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Jane Smith</div>
        <Separator orientation="vertical" />
        <div>janesmith@example.com</div>
        <Separator orientation="vertical" />
        <Badge variant="outline">Member</Badge>
      </div>
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Project Settings</CardTitle>
        <CardDescription>
          Manage your project configuration and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">General</h4>
          <p className="text-sm text-muted-foreground">
            Basic project information and settings.
          </p>
        </div>
        <Separator />
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Access Control</h4>
          <p className="text-sm text-muted-foreground">
            Manage who can access this project.
          </p>
        </div>
        <Separator />
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Integrations</h4>
          <p className="text-sm text-muted-foreground">
            Connect with external services and tools.
          </p>
        </div>
      </CardContent>
    </Card>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Recent Activity</h4>
        <p className="text-sm text-muted-foreground">Latest updates from your team.</p>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Today</span>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm">John updated the project documentation</p>
        <p className="text-sm">Sarah added a new feature request</p>
        <p className="text-sm">Mike completed the API integration</p>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Yesterday</span>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm">Alex reviewed the pull request</p>
        <p className="text-sm">Emma deployed to production</p>
      </div>
    </div>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div>
        <h4 className="text-sm font-medium">Section 1</h4>
        <p className="text-sm text-muted-foreground">Content for section 1.</p>
      </div>
      <Separator className="bg-primary" />
      <div>
        <h4 className="text-sm font-medium">Section 2</h4>
        <p className="text-sm text-muted-foreground">Content for section 2.</p>
      </div>
      <Separator className="bg-destructive" />
      <div>
        <h4 className="text-sm font-medium">Section 3</h4>
        <p className="text-sm text-muted-foreground">Content for section 3.</p>
      </div>
    </div>
  ),
};


