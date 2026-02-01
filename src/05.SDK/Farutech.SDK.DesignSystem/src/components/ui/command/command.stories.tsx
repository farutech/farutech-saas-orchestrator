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
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';
import { Button } from '../button/Button';


const meta: Meta<typeof Command> = {
  title: 'UI/Command',
  component: Command,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A command palette component for search and command execution. Perfect for keyboard-driven interfaces, search functionality, and quick actions.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'command', 'search', 'palette'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md w-80">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Basic command component with input and list.',
      },
    },
  },
};

export const CommandDialogExample: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-64 justify-start text-sm text-muted-foreground"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search commands...
          <CommandShortcut>⌘K</CommandShortcut>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Quick Actions">
              <CommandItem>
                <span>New File</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>Open File</span>
                <CommandShortcut>⌘O</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>Save</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Navigation">
              <CommandItem>
                <span>Dashboard</span>
              </CommandItem>
              <CommandItem>
                <span>Settings</span>
              </CommandItem>
              <CommandItem>
                <span>Profile</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Command dialog triggered by a search button, common in modern applications.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md w-80">
      <CommandInput placeholder="Search for tools..." />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>
        <CommandGroup heading="Development">
          <CommandItem>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>Code Editor</span>
          </CommandItem>
          <CommandItem>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Documentation</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Design">
          <CommandItem>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
            </svg>
            <span>Figma</span>
          </CommandItem>
          <CommandItem>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Photoshop</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Command component with icons for better visual identification.',
      },
    },
  },
};

export const ApplicationSwitcher: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    const apps = [
      { name: 'Dashboard', icon: '📊', description: 'View analytics and metrics' },
      { name: 'Projects', icon: '📁', description: 'Manage your projects' },
      { name: 'Team', icon: '👥', description: 'Collaborate with team members' },
      { name: 'Settings', icon: '⚙️', description: 'Configure your preferences' },
      { name: 'Help', icon: '❓', description: 'Get help and support' },
    ];

    return (
      <>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-64 justify-start text-sm text-muted-foreground"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Switch application...
          <CommandShortcut>⌘J</CommandShortcut>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search applications..." />
          <CommandList>
            <CommandEmpty>No applications found.</CommandEmpty>
            <CommandGroup heading="Applications">
              {apps.map((app) => (
                <CommandItem key={app.name}>
                  <span className="mr-2">{app.icon}</span>
                  <div className="flex flex-col">
                    <span>{app.name}</span>
                    <span className="text-xs text-muted-foreground">{app.description}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Application switcher using command dialog for navigation between different sections.',
      },
    },
  },
};

export const FileSearch: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    const files = [
      { name: 'package.json', type: 'JSON', path: '/root' },
      { name: 'README.md', type: 'Markdown', path: '/root' },
      { name: 'index.tsx', type: 'TypeScript', path: '/src' },
      { name: 'App.tsx', type: 'TypeScript', path: '/src' },
      { name: 'styles.css', type: 'CSS', path: '/src' },
      { name: 'components.ts', type: 'TypeScript', path: '/src/components' },
      { name: 'utils.ts', type: 'TypeScript', path: '/src/utils' },
    ];

    return (
      <>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-64 justify-start text-sm text-muted-foreground"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search files...
          <CommandShortcut>⌘P</CommandShortcut>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search files..." />
          <CommandList>
            <CommandEmpty>No files found.</CommandEmpty>
            <CommandGroup heading="Recent Files">
              {files.slice(0, 3).map((file) => (
                <CommandItem key={file.name}>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{file.path}</span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="All Files">
              {files.slice(3).map((file) => (
                <CommandItem key={file.name}>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{file.path}</span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'File search functionality similar to VS Code command palette.',
      },
    },
  },
};

export const ContactSearch: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    const contacts = [
      { name: 'Alice Johnson', email: 'alice@example.com', role: 'Designer' },
      { name: 'Bob Smith', email: 'bob@example.com', role: 'Developer' },
      { name: 'Carol Williams', email: 'carol@example.com', role: 'Manager' },
      { name: 'David Brown', email: 'david@example.com', role: 'Designer' },
      { name: 'Eva Davis', email: 'eva@example.com', role: 'Developer' },
    ];

    return (
      <>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-64 justify-start text-sm text-muted-foreground"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Search contacts...
          <CommandShortcut>⌘K</CommandShortcut>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search contacts..." />
          <CommandList>
            <CommandEmpty>No contacts found.</CommandEmpty>
            <CommandGroup heading="Team Members">
              {contacts.map((contact) => (
                <CommandItem key={contact.email}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{contact.name}</span>
                      <span className="text-xs text-muted-foreground">{contact.email} • {contact.role}</span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Contact search with avatars and detailed information.',
      },
    },
  },
};

export const ActionMenu: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md w-80">
      <CommandInput placeholder="Search actions..." />
      <CommandList>
        <CommandEmpty>No actions found.</CommandEmpty>
        <CommandGroup heading="File Operations">
          <CommandItem>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New File</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Upload File</span>
            <CommandShortcut>⌘U</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>Download</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Edit">
          <CommandItem>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copy</span>
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Paste</span>
            <CommandShortcut>⌘V</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Action menu with keyboard shortcuts for common operations.',
      },
    },
  },
};

export const ResponsiveCommand: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem>
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem>
              <span>Settings</span>
            </CommandItem>
            <CommandItem>
              <span>Profile</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Responsive command component optimized for mobile devices.',
      },
    },
  },
};

export const MultiSelectCommand: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const items = [
      { id: 'item1', name: 'Project Alpha', type: 'Project' },
      { id: 'item2', name: 'Task Beta', type: 'Task' },
      { id: 'item3', name: 'Meeting Gamma', type: 'Meeting' },
      { id: 'item4', name: 'Document Delta', type: 'Document' },
    ];

    const toggleItem = (id: string) => {
      setSelectedItems(prev =>
        prev.includes(id)
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    };

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Selected: {selectedItems.length} items
        </div>
        <Command className="rounded-lg border shadow-md w-80">
          <CommandInput placeholder="Search items..." />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup heading="Items">
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => toggleItem(item.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      readOnly
                      className="rounded"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.type}</span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Command component with multi-select functionality.',
      },
    },
  },
};




