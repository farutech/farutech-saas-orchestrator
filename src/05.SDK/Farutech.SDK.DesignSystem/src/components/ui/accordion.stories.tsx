import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';
import { Badge } from './badge';

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Single: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
  render: (args) => (
    <Accordion {...args} className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that match the other components' aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
  },
  render: (args) => (
    <Accordion {...args} className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is React?</AccordionTrigger>
        <AccordionContent>
          React is a JavaScript library for building user interfaces.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>What is TypeScript?</AccordionTrigger>
        <AccordionContent>
          TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What is Tailwind CSS?</AccordionTrigger>
        <AccordionContent>
          Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithBadges: Story = {
  args: {},
  render: () => (
    <Accordion type="single" collapsible className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex items-center justify-between w-full mr-4">
            <span>Notifications</span>
            <Badge variant="secondary">3</Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          You have 3 unread notifications. Check them out in your dashboard.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          <div className="flex items-center justify-between w-full mr-4">
            <span>Messages</span>
            <Badge variant="destructive">12</Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          You have 12 unread messages from your team members.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          <div className="flex items-center justify-between w-full mr-4">
            <span>Tasks</span>
            <Badge variant="outline">5</Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          You have 5 pending tasks that need your attention.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const FAQ: Story = {
  args: {},
  render: () => (
    <Accordion type="single" collapsible className="w-[600px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>How do I get started?</AccordionTrigger>
        <AccordionContent>
          Getting started is easy! First, install the design system package, then import the components you need. Check out our documentation for detailed instructions.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Can I customize the components?</AccordionTrigger>
        <AccordionContent>
          Absolutely! All components support customization through props, CSS classes, and CSS variables. You can modify colors, spacing, typography, and more to match your brand.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes, accessibility is a core principle. All components follow WAI-ARIA guidelines and support keyboard navigation, screen readers, and other assistive technologies.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Do you support dark mode?</AccordionTrigger>
        <AccordionContent>
          Yes! The design system includes built-in dark mode support. Simply toggle the 'dark' class on your root element or use our theme provider for automatic switching.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Nested: Story = {
  args: {},
  render: () => (
    <Accordion type="single" collapsible className="w-[500px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Getting Started</AccordionTrigger>
        <AccordionContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="nested-1">
              <AccordionTrigger>Installation</AccordionTrigger>
              <AccordionContent>
                Run `npm install @farutech/design-system` to install the package.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="nested-2">
              <AccordionTrigger>Configuration</AccordionTrigger>
              <AccordionContent>
                Configure your project by setting up the theme provider and importing styles.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Components</AccordionTrigger>
        <AccordionContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="nested-3">
              <AccordionTrigger>Basic Components</AccordionTrigger>
              <AccordionContent>
                Learn about buttons, inputs, and other fundamental components.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="nested-4">
              <AccordionTrigger>Advanced Components</AccordionTrigger>
              <AccordionContent>
                Explore data tables, charts, and complex interactive components.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};