import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card/Card';
import { Separator } from '../separator/Separator';

const meta: Meta<typeof ScrollArea> = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      <div className="space-y-4">
        <h4 className="text-sm font-medium leading-none">Tags</h4>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="text-sm">
            v1.2.0-beta.{i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const WithCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          You have 2,350 unread messages.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          <div className="space-y-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  <p className="text-sm font-medium">User {i + 1}</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  This is a sample message from user {i + 1}. It contains some
                  information about their recent activity.
                </p>
                {i < 19 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-[300px] whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-medium">
            Item {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const BothDirections: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-[400px] rounded-md border">
      <div className="p-4">
        <div className="grid grid-cols-10 gap-4">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  ),
};

export const LongContent: Story = {
  render: () => (
    <ScrollArea className="h-[300px] w-[500px] rounded-md border p-4">
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Terms of Service</h4>
        <p className="text-sm text-muted-foreground">
          These terms and conditions outline the rules and regulations for the use of our service.
        </p>
        {Array.from({ length: 10 }).map((_, section) => (
          <div key={section} className="space-y-2">
            <h5 className="text-md font-medium">Section {section + 1}</h5>
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="text-sm">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
            <p className="text-sm">
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const CustomScrollbar: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      <style>{`
        .scroll-area-scrollbar {
          background: hsl(var(--muted));
        }
        .scroll-area-thumb {
          background: hsl(var(--muted-foreground));
        }
        .scroll-area-thumb:hover {
          background: hsl(var(--foreground));
        }
      `}</style>
      <div className="space-y-4">
        <h4 className="text-sm font-medium leading-none">Custom Scrollbar</h4>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="text-sm">
            Custom styled scrollbar - Item {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};


