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
import { Calendar } from './calendar';


const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible calendar component for date selection and display. Supports single date selection, date range selection, and various display modes.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'calendar', 'date-picker'],
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['single', 'multiple', 'range'],
      description: 'The selection mode for the calendar.',
    },
    selected: {
      control: { type: 'date' },
      description: 'The currently selected date(s).',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the calendar is disabled.',
    },
    showOutsideDays: {
      control: { type: 'boolean' },
      description: 'Whether to show days from the previous/next month.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Calendar />,
  parameters: {
    docs: {
      description: {
        story: 'Basic calendar component with default settings.',
      },
    },
  },
};

export const SingleSelection: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with single date selection mode.',
      },
    },
  },
};

export const RangeSelection: Story = {
  render: () => {
    const [date, setDate] = useState<{ from: Date; to: Date } | undefined>({
      from: new Date(2024, 0, 20),
      to: new Date(2024, 0, 27),
    });

    return (
      <Calendar
        mode="range"
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        className="rounded-md border"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with date range selection mode showing two months.',
      },
    },
  },
};

export const MultipleSelection: Story = {
  render: () => {
    const [dates, setDates] = useState<Date[] | undefined>([
      new Date(2024, 0, 15),
      new Date(2024, 0, 20),
      new Date(2024, 0, 25),
    ]);

    return (
      <Calendar
        mode="multiple"
        selected={dates}
        onSelect={setDates}
        className="rounded-md border"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with multiple date selection mode.',
      },
    },
  },
};

export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    const disabledDates = [
      new Date(2024, 0, 15),
      new Date(2024, 0, 16),
      new Date(2024, 0, 17),
    ];

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={disabledDates}
        className="rounded-md border"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with specific dates disabled for selection.',
      },
    },
  },
};

export const WithMinMaxDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 7);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={(date) => date < minDate || date > maxDate}
        className="rounded-md border"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with minimum and maximum date restrictions.',
      },
    },
  },
};

export const TwoMonthsView: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        className="rounded-md border"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar displaying two months side by side.',
      },
    },
  },
};

export const WithoutOutsideDays: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        showOutsideDays={false}
        className="rounded-md border"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar without showing days from adjacent months.',
      },
    },
  },
};

export const CustomStyling: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border-2 border-blue-200 bg-white shadow-lg"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with custom styling and background.',
      },
    },
  },
};

export const InCard: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <div className="w-[400px] rounded-lg border bg-card p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Select Date</h3>
          <p className="text-sm text-muted-foreground">
            Choose a date for your appointment
          </p>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar integrated within a card component.',
      },
    },
  },
};

export const BookingCalendar: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    // Simulate booked dates
    const bookedDates = [
      new Date(2024, 0, 15),
      new Date(2024, 0, 16),
      new Date(2024, 0, 22),
      new Date(2024, 0, 23),
    ];

    return (
      <div className="w-[400px] rounded-lg border bg-card p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Book Appointment</h3>
          <p className="text-sm text-muted-foreground">
            Select an available date
          </p>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={bookedDates}
          className="rounded-md border"
        />
        <div className="mt-4 flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-red-200 rounded"></div>
          <span>Booked</span>
          <div className="w-3 h-3 bg-green-200 rounded ml-4"></div>
          <span>Available</span>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar for booking system with visual indicators.',
      },
    },
  },
};

export const ResponsiveCalendar: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <div className="w-full max-w-sm">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          numberOfMonths={1}
          className="rounded-md border"
        />
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Responsive calendar optimized for mobile devices.',
      },
    },
  },
};

export const DateRangePicker: Story = {
  render: () => {
    const [date, setDate] = useState<{ from: Date; to: Date } | undefined>();

    return (
      <div className="w-[600px] rounded-lg border bg-card p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Select Date Range</h3>
          <p className="text-sm text-muted-foreground">
            Choose start and end dates
          </p>
        </div>
        <Calendar
          mode="range"
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          className="rounded-md border"
        />
        {date && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm">
              Selected: {date.from.toLocaleDateString()} - {date.to.toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete date range picker with feedback display.',
      },
    },
  },
};




