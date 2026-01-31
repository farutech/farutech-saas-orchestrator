import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <input className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <input className="w-full px-3 py-2 border rounded-md" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Current password</label>
              <input type="password" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">New password</label>
              <input type="password" className="w-full px-3 py-2 border rounded-md" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const ThreeTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">+180.1% from last month</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="analytics" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>View your analytics data</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Analytics content would go here.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reports" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>Generate and view reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Reports content would go here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <Tabs defaultValue="inbox" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="inbox" className="flex items-center gap-2">
          Inbox
          <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
            3
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="sent">Sent</TabsTrigger>
        <TabsTrigger value="drafts">Drafts</TabsTrigger>
      </TabsList>
      <TabsContent value="inbox">
        <Card>
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You have 3 unread messages.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="sent">
        <Card>
          <CardHeader>
            <CardTitle>Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your sent messages.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="drafts">
        <Card>
          <CardHeader>
            <CardTitle>Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your draft messages.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex space-x-4">
      <Tabs defaultValue="tab1" orientation="vertical" className="w-[400px]">
        <TabsList className="flex flex-col h-auto w-full">
          <TabsTrigger value="tab1" className="w-full justify-start">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" className="w-full justify-start">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3" className="w-full justify-start">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Tab 1 Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Content for the first tab.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tab2" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Tab 2 Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Content for the second tab.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tab3" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Tab 3 Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Content for the third tab.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  ),
};