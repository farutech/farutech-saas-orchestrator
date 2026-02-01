import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './tabs';

describe('Tabs', () => {
  test('renders tabs with default value', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  test('renders tabs with controlled value', () => {
    render(
      <Tabs value="tab2">
        <TabsList>
          <TabsTrigger value="tab1">First</TabsTrigger>
          <TabsTrigger value="tab2">Second</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">First content</TabsContent>
        <TabsContent value="tab2">Second content</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Second content')).toBeInTheDocument();
  });

  test('renders tabs with orientation', () => {
    render(
      <Tabs orientation="vertical">
        <TabsList>
          <TabsTrigger value="vertical1">Vertical Tab 1</TabsTrigger>
          <TabsTrigger value="vertical2">Vertical Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="vertical1">Vertical content 1</TabsContent>
        <TabsContent value="vertical2">Vertical content 2</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Vertical Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Vertical Tab 2')).toBeInTheDocument();
  });

  test('renders tabs trigger with custom className', () => {
    const { container } = render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab" className="custom-trigger">Custom Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="tab">Content</TabsContent>
      </Tabs>
    );

    const trigger = container.querySelector('.custom-trigger');
    expect(trigger).toBeInTheDocument();
    expect(screen.getByText('Custom Tab')).toBeInTheDocument();
  });

  test('renders tabs content with custom className', () => {
    const { container } = render(
      <Tabs value="tab">
        <TabsList>
          <TabsTrigger value="tab">Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="tab" className="custom-content">Custom Content</TabsContent>
      </Tabs>
    );

    const content = container.querySelector('.custom-content');
    expect(content).toBeInTheDocument();
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  test('tabs have proper accessibility structure', () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="accessible">Accessible Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="accessible">Accessible content</TabsContent>
      </Tabs>
    );

    const tablist = document.querySelector('[role="tablist"]');
    expect(tablist).toBeInTheDocument();

    const tab = screen.getByRole('tab');
    expect(tab).toBeInTheDocument();
  });

  test('renders tabs with disabled trigger', () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="enabled">Enabled</TabsTrigger>
          <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
        </TabsList>
        <TabsContent value="enabled">Enabled content</TabsContent>
        <TabsContent value="disabled">Disabled content</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  test('renders tabs with multiple content areas', () => {
    render(
      <Tabs value="second">
        <TabsList>
          <TabsTrigger value="first">First Tab</TabsTrigger>
          <TabsTrigger value="second">Second Tab</TabsTrigger>
          <TabsTrigger value="third">Third Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="first">
          <p>First tab content</p>
          <button>Action 1</button>
        </TabsContent>
        <TabsContent value="second">
          <p>Second tab content</p>
          <input placeholder="Input field" />
        </TabsContent>
        <TabsContent value="third">
          <p>Third tab content</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </TabsContent>
      </Tabs>
    );

    expect(screen.getByText('First Tab')).toBeInTheDocument();
    expect(screen.getByText('Second Tab')).toBeInTheDocument();
    expect(screen.getByText('Third Tab')).toBeInTheDocument();
    expect(screen.getByText('Second tab content')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Input field')).toBeInTheDocument();
  });

  test('renders tabs with complex layout', () => {
    render(
      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-4">
          <div>
            <h3>Dashboard Overview</h3>
            <p>Welcome to your dashboard</p>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div>
            <h3>Analytics</h3>
            <p>View your analytics data</p>
          </div>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <div>
            <h3>Settings</h3>
            <p>Configure your preferences</p>
          </div>
        </TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    expect(screen.getByText('Welcome to your dashboard')).toBeInTheDocument();
  });
});