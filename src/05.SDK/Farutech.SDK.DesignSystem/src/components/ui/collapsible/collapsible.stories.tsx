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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';


const meta: Meta<typeof Collapsible> = {
  title: 'UI/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A collapsible component that allows content to be hidden or revealed with smooth animations. Perfect for accordions, expandable sections, and progressive disclosure.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'collapsible', 'accordion', 'expandable'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-80">
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border px-4 py-2 text-left font-medium hover:bg-muted">
          Can I use this in my project?
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 py-2 text-sm text-muted-foreground">
          Yes! You can use this component in your project. It's open source and free to use.
        </CollapsibleContent>
      </Collapsible>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic collapsible component with trigger and content.',
      },
    },
  },
};

export const FAQSection: Story = {
  render: () => {
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (id: string) => {
      setOpenItems(prev =>
        prev.includes(id)
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    };

    const faqs = [
      {
        id: 'getting-started',
        question: 'How do I get started?',
        answer: 'Getting started is easy! First, install the package using npm or yarn, then import the components you need and start building your UI.'
      },
      {
        id: 'customization',
        question: 'Can I customize the appearance?',
        answer: 'Absolutely! All components use Tailwind CSS classes, so you can customize colors, spacing, and other visual aspects by overriding the default classes.'
      },
      {
        id: 'accessibility',
        question: 'Is this accessible?',
        answer: 'Yes, all components are built with accessibility in mind, following WCAG guidelines and using proper ARIA attributes.'
      },
      {
        id: 'support',
        question: 'What kind of support do you provide?',
        answer: 'We provide comprehensive documentation, community support through GitHub issues, and regular updates with new features and bug fixes.'
      },
    ];

    return (
      <div className="w-full max-w-2xl space-y-2">
        {faqs.map((faq) => (
          <Collapsible
            key={faq.id}
            open={openItems.includes(faq.id)}
            onOpenChange={() => toggleItem(faq.id)}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border px-4 py-3 text-left font-medium hover:bg-muted transition-colors">
              {faq.question}
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${
                  openItems.includes(faq.id) ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-3 text-sm text-muted-foreground border-l-2 border-muted ml-4">
              {faq.answer}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'FAQ section using multiple collapsible components.',
      },
    },
  },
};

export const NestedCollapsible: Story = {
  render: () => {
    const [openSections, setOpenSections] = useState({
      gettingStarted: false,
      components: false,
      theming: false,
    });

    const [openSubSections, setOpenSubSections] = useState({
      installation: false,
      setup: false,
      buttons: false,
      forms: false,
      colors: false,
      typography: false,
    });

    const toggleSection = (section: string) => {
      setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const toggleSubSection = (subSection: string) => {
      setOpenSubSections(prev => ({ ...prev, [subSection]: !prev[subSection] }));
    };

    return (
      <div className="w-full max-w-md space-y-1">
        {/* Getting Started Section */}
        <Collapsible
          open={openSections.gettingStarted}
          onOpenChange={() => toggleSection('gettingStarted')}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border px-4 py-2 text-left font-medium hover:bg-muted">
            Getting Started
            <svg
              className={`h-4 w-4 transition-transform ${
                openSections.gettingStarted ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 pl-4">
            <Collapsible
              open={openSubSections.installation}
              onOpenChange={() => toggleSubSection('installation')}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded px-3 py-1.5 text-left text-sm hover:bg-muted">
                Installation
                <svg
                  className={`h-3 w-3 transition-transform ${
                    openSubSections.installation ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 py-1 text-xs text-muted-foreground">
                Install via npm: <code className="bg-muted px-1 rounded">npm install @your-design-system</code>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={openSubSections.setup}
              onOpenChange={() => toggleSubSection('setup')}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded px-3 py-1.5 text-left text-sm hover:bg-muted">
                Setup
                <svg
                  className={`h-3 w-3 transition-transform ${
                    openSubSections.setup ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 py-1 text-xs text-muted-foreground">
                Configure your Tailwind CSS and import the components.
              </CollapsibleContent>
            </Collapsible>
          </CollapsibleContent>
        </Collapsible>

        {/* Components Section */}
        <Collapsible
          open={openSections.components}
          onOpenChange={() => toggleSection('components')}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border px-4 py-2 text-left font-medium hover:bg-muted">
            Components
            <svg
              className={`h-4 w-4 transition-transform ${
                openSections.components ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 pl-4">
            <Collapsible
              open={openSubSections.buttons}
              onOpenChange={() => toggleSubSection('buttons')}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded px-3 py-1.5 text-left text-sm hover:bg-muted">
                Buttons
                <svg
                  className={`h-3 w-3 transition-transform ${
                    openSubSections.buttons ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 py-1 text-xs text-muted-foreground">
                Various button styles and variants for different use cases.
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={openSubSections.forms}
              onOpenChange={() => toggleSubSection('forms')}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded px-3 py-1.5 text-left text-sm hover:bg-muted">
                Forms
                <svg
                  className={`h-3 w-3 transition-transform ${
                    openSubSections.forms ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 py-1 text-xs text-muted-foreground">
                Input fields, checkboxes, radio buttons, and form validation.
              </CollapsibleContent>
            </Collapsible>
          </CollapsibleContent>
        </Collapsible>

        {/* Theming Section */}
        <Collapsible
          open={openSections.theming}
          onOpenChange={() => toggleSection('theming')}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border px-4 py-2 text-left font-medium hover:bg-muted">
            Theming
            <svg
              className={`h-4 w-4 transition-transform ${
                openSections.theming ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 pl-4">
            <Collapsible
              open={openSubSections.colors}
              onOpenChange={() => toggleSubSection('colors')}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded px-3 py-1.5 text-left text-sm hover:bg-muted">
                Colors
                <svg
                  className={`h-3 w-3 transition-transform ${
                    openSubSections.colors ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 py-1 text-xs text-muted-foreground">
                Customize color palette and semantic color tokens.
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={openSubSections.typography}
              onOpenChange={() => toggleSubSection('typography')}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded px-3 py-1.5 text-left text-sm hover:bg-muted">
                Typography
                <svg
                  className={`h-3 w-3 transition-transform ${
                    openSubSections.typography ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 py-1 text-xs text-muted-foreground">
                Font families, sizes, weights, and line heights.
              </CollapsibleContent>
            </Collapsible>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Nested collapsible components for hierarchical content organization.',
      },
    },
  },
};

export const ProductDetails: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="w-full max-w-md">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Wireless Headphones</h3>
              <p className="text-sm text-muted-foreground">$299.99</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">In Stock</span>
            </div>
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between text-left hover:bg-muted px-2 py-1 rounded">
              <span className="text-sm font-medium">Product Details</span>
              <svg
                className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 py-2 space-y-2">
              <div className="text-sm">
                <strong>Battery Life:</strong> 30 hours
              </div>
              <div className="text-sm">
                <strong>Connectivity:</strong> Bluetooth 5.0
              </div>
              <div className="text-sm">
                <strong>Features:</strong> Active noise cancellation, quick charge
              </div>
              <div className="text-sm">
                <strong>Weight:</strong> 250g
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Product details section that can be expanded to show more information.',
      },
    },
  },
};

export const CodeExample: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="w-full max-w-2xl">
        <div className="border rounded-lg">
          <div className="p-4">
            <h3 className="font-semibold mb-2">Using the Button Component</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Here's how to use the Button component in your React application.
            </p>

            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between text-left hover:bg-muted px-3 py-2 rounded border">
                <span className="text-sm font-medium">View Code Example</span>
                <svg
                  className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 py-3">
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  <code>{`import { Button } from './components/ui/button';

export function MyComponent() {
  return (
    <div>
      <Button variant="default">Click me</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  );
}`}</code>
                </pre>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Code example section that can be expanded to show implementation details.',
      },
    },
  },
};

export const MobileNavigation: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="w-full max-w-sm border rounded-lg">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
              <div>
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-muted-foreground">john@example.com</div>
              </div>
            </div>
            <svg
              className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t">
            <div className="p-2 space-y-1">
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded">
                Profile Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded">
                Billing
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded">
                Support
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                Sign Out
              </button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-friendly collapsible navigation menu.',
      },
    },
  },
};

export const AnimatedCollapsible: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-80">
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border px-4 py-3 text-left font-medium hover:bg-muted transition-all duration-200 hover:shadow-md">
          <span>Advanced Settings</span>
          <svg
            className={`h-4 w-4 transition-all duration-300 ${
              isOpen ? 'rotate-180 text-blue-600' : 'text-muted-foreground'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 py-3 space-y-3 border-l-2 border-blue-200 ml-4 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-2">
            <label className="text-sm font-medium">Theme</label>
            <select className="w-full px-3 py-2 border rounded-md text-sm">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <select className="w-full px-3 py-2 border rounded-md text-sm">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Notifications</label>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Collapsible with enhanced animations and styling for advanced settings.',
      },
    },
  },
};




