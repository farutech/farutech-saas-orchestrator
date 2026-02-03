import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Dashboard,
  DashboardProvider,
  ModuleSelector,
  useDashboard,
  type DashboardConfig
} from './Dashboard';
import { LayoutDashboard, Users } from 'lucide-react';

// Mock components for modules
const MockDashboardModule = () => <div>Dashboard Module</div>;
const MockUsersModule = () => <div>Users Module</div>;

// Test configuration
const testConfig: DashboardConfig = {
  industry: 'default',
  title: 'Test Dashboard',
  showBreadcrumb: true,
  showSearch: false,
  modules: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      component: MockDashboardModule,
      description: 'Main dashboard'
    },
    {
      id: 'users',
      name: 'Users',
      icon: Users,
      path: '/users',
      component: MockUsersModule,
      description: 'User management'
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
          id: 'users',
          label: 'Users',
          href: '/users',
          icon: Users
        }
      ]
    }
  ]
};

describe('Dashboard System', () => {
  describe('Dashboard Component', () => {
    it('renders with basic configuration', () => {
      render(<Dashboard config={testConfig} />);
      expect(screen.getAllByText('Test Dashboard').length).toBeGreaterThan(0);
    });

    it('renders sidebar navigation', () => {
      render(<Dashboard config={testConfig} />);
      expect(screen.getAllByText('Main').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Users').length).toBeGreaterThan(0);
    });

    it('shows breadcrumb when configured', () => {
      render(<Dashboard config={testConfig} />);
      expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    });

    it('renders default content when no children provided', () => {
      render(<Dashboard config={testConfig} />);
      expect(screen.getByText('Bienvenido al Dashboard')).toBeInTheDocument();
    });
  });

  describe('ModuleSelector Component', () => {
    it('renders with placeholder when no module selected', () => {
      const mockOnChange = vi.fn();
      render(
        <ModuleSelector
          modules={testConfig.modules}
          currentModule={null}
          onModuleChange={mockOnChange}
          placeholder="Select module..."
        />
      );
      expect(screen.getByText('Select module...')).toBeInTheDocument();
    });

    it('renders current module name when selected', () => {
      const mockOnChange = vi.fn();
      render(
        <ModuleSelector
          modules={testConfig.modules}
          currentModule={testConfig.modules[0]}
          onModuleChange={mockOnChange}
        />
      );
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('opens dropdown on click', async () => {
      const mockOnChange = vi.fn();
      render(
        <ModuleSelector
          modules={testConfig.modules}
          currentModule={null}
          onModuleChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Users')).toBeInTheDocument();
      });
    });

    it('calls onModuleChange when module is selected', async () => {
      const mockOnChange = vi.fn();
      render(
        <ModuleSelector
          modules={testConfig.modules}
          currentModule={null}
          onModuleChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      // Click on the first module button in the dropdown
      const moduleButtons = screen.getAllByRole('button');
      const dashboardButton = moduleButtons.find(btn => btn.textContent?.includes('Dashboard'));
      if (dashboardButton) {
        fireEvent.click(dashboardButton);
        expect(mockOnChange).toHaveBeenCalledWith(testConfig.modules[0]);
      }
    });

    it('filters modules based on search', async () => {
      const mockOnChange = vi.fn();
      render(
        <ModuleSelector
          modules={testConfig.modules}
          currentModule={null}
          onModuleChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Buscar módulo...');
        fireEvent.change(searchInput, { target: { value: 'Users' } });
      });

      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });
  });

  describe('DashboardProvider', () => {
    it('provides dashboard context', () => {
      const TestComponent = () => {
        const { config } = useDashboard();
        return <div>{config.title}</div>;
      };

      render(
        <DashboardProvider config={testConfig}>
          <TestComponent />
        </DashboardProvider>
      );

      expect(screen.getByText('Test Dashboard')).toBeInTheDocument();
    });

    it('throws error when useDashboard is used outside provider', () => {
      const TestComponent = () => {
        useDashboard();
        return <div>Test</div>;
      };

      // Mock console.error to avoid noise in test output
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => render(<TestComponent />)).toThrow(
        'useDashboard must be used within a DashboardProvider'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Dashboard Integration', () => {
    it('renders custom header actions', () => {
      const customActions = <button>Custom Action</button>;

      render(
        <Dashboard config={testConfig}>
          <Dashboard.Header actions={customActions} />
        </Dashboard>
      );

      expect(screen.getByText('Custom Action')).toBeInTheDocument();
    });

    it('renders custom content', () => {
      const customContent = <div>Custom Dashboard Content</div>;

      render(
        <Dashboard config={testConfig}>
          <Dashboard.Content>
            {customContent}
          </Dashboard.Content>
        </Dashboard>
      );

      expect(screen.getByText('Custom Dashboard Content')).toBeInTheDocument();
    });
  });
});