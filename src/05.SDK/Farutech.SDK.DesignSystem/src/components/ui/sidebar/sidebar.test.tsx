import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from './sidebar';

describe('Sidebar', () => {
  test('renders sidebar with basic structure', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <h2>Header</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Group</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Menu Item</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <p>Footer</p>
          </SidebarFooter>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Group')).toBeInTheDocument();
    expect(screen.getByText('Menu Item')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  test('renders sidebar trigger', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <p>Content</p>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('renders sidebar menu with sub items', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Parent</SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>Child 1</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>Child 2</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Parent')).toBeInTheDocument();
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  test('renders sidebar group with action', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupAction>
                <button>+</button>
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Option 1</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  test('renders sidebar menu item with action', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Item</SidebarMenuButton>
                <SidebarMenuAction>
                  <button>Edit</button>
                </SidebarMenuAction>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  test('sidebar has proper structure', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>Header Content</SidebarHeader>
          <SidebarContent>Main Content</SidebarContent>
          <SidebarFooter>Footer Content</SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Header Content')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  test('renders complex sidebar navigation', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <h1>App Name</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Dashboard</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Projects</SidebarMenuButton>
                    <SidebarMenuAction>
                      <span>+</span>
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Settings</SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Profile</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Preferences</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <p>© 2024 Company</p>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('App Name')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('© 2024 Company')).toBeInTheDocument();
  });

  test('sidebar provider wraps content properly', () => {
    render(
      <SidebarProvider>
        <div>Main content</div>
        <Sidebar>
          <SidebarContent>Sidebar content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByText('Sidebar content')).toBeInTheDocument();
  });
});