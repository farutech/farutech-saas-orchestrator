import type { Meta, StoryObj } from '@storybook/react';
import {
  Dashboard,
  DashboardProvider,
  DashboardHeader,
  DashboardSidebar,
  DashboardContent,
  ModuleSelector,
  type DashboardConfig
} from './Dashboard';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Package,
  Calendar,
  FileText,
  TrendingUp
} from 'lucide-react';

// Mock components for modules
const DashboardModule = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold">Total Users</h3>
        <p className="text-2xl font-bold text-blue-600">1,234</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold">Revenue</h3>
        <p className="text-2xl font-bold text-green-600">$45,678</p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="font-semibold">Orders</h3>
        <p className="text-2xl font-bold text-purple-600">89</p>
      </div>
    </div>
  </div>
);

const UsersModule = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">User Management</h2>
    <div className="bg-white border rounded-lg p-4">
      <p>User management interface would go here.</p>
    </div>
  </div>
);

const ReportsModule = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Reports & Analytics</h2>
    <div className="bg-white border rounded-lg p-4">
      <p>Reports and analytics interface would go here.</p>
    </div>
  </div>
);

// Sample configuration
const sampleConfig: DashboardConfig = {
  industry: 'erp',
  title: 'Farutech ERP Dashboard',
  showBreadcrumb: true,
  showSearch: true,
  modules: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      component: DashboardModule,
      description: 'Main dashboard overview'
    },
    {
      id: 'users',
      name: 'Users',
      icon: Users,
      path: '/users',
      component: UsersModule,
      description: 'User management',
      badge: 'New'
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: BarChart3,
      path: '/reports',
      component: ReportsModule,
      description: 'Reports and analytics',
      badge: 'Pro'
    }
  ],
  navigation: [
    {
      id: 'main',
      label: 'Main',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard
        },
        {
          id: 'analytics',
          label: 'Analytics',
          href: '/analytics',
          icon: TrendingUp,
          badge: 'Beta'
        }
      ]
    },
    {
      id: 'business',
      label: 'Business',
      items: [
        {
          id: 'users',
          label: 'Users',
          href: '/users',
          icon: Users
        },
        {
          id: 'inventory',
          label: 'Inventory',
          href: '/inventory',
          icon: Package
        },
        {
          id: 'orders',
          label: 'Orders',
          href: '/orders',
          icon: FileText
        }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      items: [
        {
          id: 'reports',
          label: 'Reports',
          href: '/reports',
          icon: BarChart3
        },
        {
          id: 'calendar',
          label: 'Calendar',
          href: '/calendar',
          icon: Calendar
        }
      ]
    },
    {
      id: 'system',
      label: 'System',
      items: [
        {
          id: 'settings',
          label: 'Settings',
          href: '/settings',
          icon: Settings
        }
      ]
    }
  ]
};

const meta: Meta<typeof Dashboard> = {
  title: 'Components/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A complete dashboard system with navigation, modules, and responsive layout.'
      }
    }
  },
  argTypes: {
    config: {
      control: { type: 'object' },
      description: 'Dashboard configuration object'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Dashboard>;

export const Default: Story = {
  args: {
    config: sampleConfig
  }
};

export const WithCustomHeader: Story = {
  args: {
    config: sampleConfig
  },
  render: (args) => (
    <Dashboard {...args}>
      <Dashboard.Header
        title="Custom ERP Dashboard"
        actions={
          <div className="flex gap-2">
            <ModuleSelector
              modules={sampleConfig.modules}
              currentModule={sampleConfig.modules[0]}
              onModuleChange={() => {}}
              className="w-48"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              New Item
            </button>
          </div>
        }
      />
    </Dashboard>
  )
};

export const MinimalLayout: Story = {
  args: {
    config: {
      ...sampleConfig,
      layout: 'minimal',
      showBreadcrumb: false,
      showSearch: false
    }
  }
};

export const HealthIndustry: Story = {
  args: {
    config: {
      ...sampleConfig,
      industry: 'health',
      title: 'Farutech Health Dashboard',
      modules: [
        {
          id: 'patients',
          name: 'Patients',
          icon: Users,
          path: '/patients',
          component: () => <div>Patient management interface</div>,
          description: 'Patient records and management'
        },
        {
          id: 'appointments',
          name: 'Appointments',
          icon: Calendar,
          path: '/appointments',
          component: () => <div>Appointment scheduling interface</div>,
          description: 'Schedule and manage appointments'
        }
      ]
    }
  }
};

export const VeterinaryIndustry: Story = {
  args: {
    config: {
      ...sampleConfig,
      industry: 'vet',
      title: 'Farutech Veterinary Dashboard',
      modules: [
        {
          id: 'pets',
          name: 'Pets',
          icon: Package,
          path: '/pets',
          component: () => <div>Pet management interface</div>,
          description: 'Pet records and care management'
        },
        {
          id: 'owners',
          name: 'Owners',
          icon: Users,
          path: '/owners',
          component: () => <div>Pet owner management interface</div>,
          description: 'Pet owner information and billing'
        }
      ]
    }
  }
};

export const SidebarCollapsed: Story = {
  args: {
    config: sampleConfig
  },
  render: (args) => {
    const [collapsed, setCollapsed] = React.useState(true);
    return (
      <Dashboard {...args}>
        <Dashboard.Sidebar
          sections={sampleConfig.navigation}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </Dashboard>
    );
  }
};

// Individual component stories
export const ModuleSelectorStory: Story = {
  render: () => {
    const [selectedModule, setSelectedModule] = React.useState(sampleConfig.modules[0]);

    return (
      <div className="p-8 max-w-md">
        <ModuleSelector
          modules={sampleConfig.modules}
          currentModule={selectedModule}
          onModuleChange={setSelectedModule}
          placeholder="Select a module..."
        />
        {selectedModule && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold">Selected Module:</h3>
            <p>{selectedModule.name}</p>
            <p className="text-sm text-gray-600">{selectedModule.description}</p>
          </div>
        )}
      </div>
    );
  }
};

export const DashboardHeaderStory: Story = {
  render: () => (
    <DashboardProvider config={sampleConfig}>
      <DashboardHeader
        title="Sample Dashboard"
        showSearch={true}
        actions={
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
              Action 1
            </button>
            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">
              Action 2
            </button>
          </div>
        }
      />
    </DashboardProvider>
  )
};

export const DashboardContentStory: Story = {
  render: () => (
    <DashboardProvider config={sampleConfig}>
      <DashboardContent
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Users' }
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Content Area</h2>
          <p>This is the main content area of the dashboard.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p>Sample content block</p>
          </div>
        </div>
      </DashboardContent>
    </DashboardProvider>
  )
};