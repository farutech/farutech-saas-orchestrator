import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';
import { useState } from 'react';

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

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable switch component for toggle controls. Supports controlled and uncontrolled states with proper accessibility features.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'switch', 'toggle', 'form', 'input'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled.',
    },
    checked: {
      control: 'boolean',
      description: 'The checked state of the switch.',
    },
    onCheckedChange: {
      action: 'onCheckedChange',
      description: 'Callback fired when the switch state changes.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex items-center space-x-2">
        <Switch
          id="default"
          checked={checked}
          onCheckedChange={(checked) => setChecked(checked === true)}
        />
        <label htmlFor="default" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Enable notifications
        </label>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic switch with label for enabling notifications.',
      },
    },
  },
};

export const Controlled: Story = {
  args: {
    checked: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch id="controlled" {...args} />
      <label htmlFor="controlled" className="text-sm font-medium leading-none">
        Controlled switch
      </label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Switch with controlled checked state.',
      },
    },
  },
};

export const Uncontrolled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="uncontrolled" defaultChecked />
      <label htmlFor="uncontrolled" className="text-sm font-medium leading-none">
        Uncontrolled switch
      </label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Switch with default checked state, uncontrolled by React state.',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="disabled-off" disabled />
        <label htmlFor="disabled-off" className="text-sm font-medium leading-none text-muted-foreground">
          Disabled (off)
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled-on" disabled checked />
        <label htmlFor="disabled-on" className="text-sm font-medium leading-none text-muted-foreground">
          Disabled (on)
        </label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled switch states showing both on and off disabled variants.',
      },
    },
  },
};

export const WithDescription: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex items-start space-x-3">
        <Switch
          id="description"
          checked={checked}
          onCheckedChange={(checked) => setChecked(checked === true)}
          className="mt-0.5"
        />
        <div className="grid gap-1.5 leading-none">
          <label htmlFor="description" className="text-sm font-medium leading-none">
            Dark mode
          </label>
          <p className="text-xs text-muted-foreground">
            Switch to dark theme for better visibility in low light conditions.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Switch with label and description text for better context.',
      },
    },
  },
};

export const SettingsPanel: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      notifications: true,
      sound: false,
      vibration: true,
      autoUpdate: false,
    });

    const handleChange = (key: string) => (checked: boolean) => {
      setSettings(prev => ({ ...prev, [key]: checked }));
    };

    return (
      <div className="space-y-6 max-w-sm">
        <div>
          <h3 className="text-lg font-medium mb-4">App Settings</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="notifications" className="text-sm font-medium">
                Push notifications
              </label>
              <p className="text-xs text-muted-foreground">
                Receive notifications about app updates
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={handleChange('notifications')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="sound" className="text-sm font-medium">
                Sound effects
              </label>
              <p className="text-xs text-muted-foreground">
                Play sounds for interactions
              </p>
            </div>
            <Switch
              id="sound"
              checked={settings.sound}
              onCheckedChange={handleChange('sound')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="vibration" className="text-sm font-medium">
                Vibration
              </label>
              <p className="text-xs text-muted-foreground">
                Haptic feedback for interactions
              </p>
            </div>
            <Switch
              id="vibration"
              checked={settings.vibration}
              onCheckedChange={handleChange('vibration')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="auto-update" className="text-sm font-medium">
                Auto-update
              </label>
              <p className="text-xs text-muted-foreground">
                Automatically download and install updates
              </p>
            </div>
            <Switch
              id="auto-update"
              checked={settings.autoUpdate}
              onCheckedChange={handleChange('auto-update')}
            />
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Settings: {Object.entries(settings).filter(([_, v]) => v).length} of {Object.keys(settings).length} enabled
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Settings panel with multiple switches for app preferences.',
      },
    },
  },
};

export const FeatureToggles: Story = {
  render: () => {
    const [features, setFeatures] = useState({
      betaFeatures: false,
      analytics: true,
      crashReporting: true,
      performanceMonitoring: false,
    });

    const handleChange = (key: string) => (checked: boolean) => {
      setFeatures(prev => ({ ...prev, [key]: checked }));
    };

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Feature Toggles</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enable or disable experimental features and data collection.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <label htmlFor="beta" className="text-sm font-medium">
                Beta Features
              </label>
              <p className="text-xs text-muted-foreground">Try new features before they're released</p>
            </div>
            <Switch
              id="beta"
              checked={features.betaFeatures}
              onCheckedChange={handleChange('betaFeatures')}
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <label htmlFor="analytics" className="text-sm font-medium">
                Analytics
              </label>
              <p className="text-xs text-muted-foreground">Help improve the app with usage data</p>
            </div>
            <Switch
              id="analytics"
              checked={features.analytics}
              onCheckedChange={handleChange('analytics')}
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <label htmlFor="crash" className="text-sm font-medium">
                Crash Reporting
              </label>
              <p className="text-xs text-muted-foreground">Send crash reports to help fix issues</p>
            </div>
            <Switch
              id="crash"
              checked={features.crashReporting}
              onCheckedChange={handleChange('crashReporting')}
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <label htmlFor="performance" className="text-sm font-medium">
                Performance Monitoring
              </label>
              <p className="text-xs text-muted-foreground">Monitor app performance and speed</p>
            </div>
            <Switch
              id="performance"
              checked={features.performanceMonitoring}
              onCheckedChange={handleChange('performanceMonitoring')}
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Feature toggles with card-like layout for better organization.',
      },
    },
  },
};

export const ResponsiveExample: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center space-x-2">
        <Switch id="mobile-1" />
        <label htmlFor="mobile-1" className="text-sm">Wi-Fi</label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="mobile-2" defaultChecked />
        <label htmlFor="mobile-2" className="text-sm">Bluetooth</label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="mobile-3" disabled />
        <label htmlFor="mobile-3" className="text-sm text-muted-foreground">Airplane Mode</label>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Switch examples optimized for mobile devices.',
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Enabled States</h4>
        <div className="flex items-center space-x-2">
          <Switch id="off" />
          <label htmlFor="off" className="text-sm">Off</label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="on" checked />
          <label htmlFor="on" className="text-sm">On</label>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Disabled States</h4>
        <div className="flex items-center space-x-2">
          <Switch id="disabled-off" disabled />
          <label htmlFor="disabled-off" className="text-sm text-muted-foreground">Disabled off</label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="disabled-on" disabled checked />
          <label htmlFor="disabled-on" className="text-sm text-muted-foreground">Disabled on</label>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All possible switch states displayed together for comparison.',
      },
    },
  },
};


