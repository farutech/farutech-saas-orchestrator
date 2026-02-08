import { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const tabsVariants = cva('', {
  variants: {
    variant: {
      line: 'border-b border-border',
      contained: 'inline-flex rounded-lg bg-muted p-1',
      pills: 'flex flex-wrap gap-2',
    },
  },
  defaultVariants: {
    variant: 'line',
  },
});

const tabVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        line: 'border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground hover:text-foreground',
        contained:
          'rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        pills:
          'rounded-full border border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary',
      },
    },
    defaultVariants: {
      variant: 'line',
    },
  }
);

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  content?: React.ReactNode;
}

export interface TabsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsVariants> {
  tabs: Tab[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

export function Tabs({
  tabs,
  defaultValue,
  value: controlledValue,
  onValueChange,
  variant,
  orientation = 'horizontal',
  className,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(
    defaultValue || tabs[0]?.id || ''
  );

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (disabled) return;
    if (controlledValue === undefined) {
      setInternalValue(tabId);
    }
    onValueChange?.(tabId);
  };

  const activeTab = tabs.find((tab) => tab.id === value);

  return (
    <div className={cn('space-y-4', className)} {...props}>
      <div
        className={cn(
          tabsVariants({ variant }),
          orientation === 'vertical' && 'flex flex-col'
        )}
        role="tablist"
        aria-orientation={orientation}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={value === tab.id}
            aria-controls={`panel-${tab.id}`}
            data-state={value === tab.id ? 'active' : 'inactive'}
            disabled={tab.disabled}
            onClick={() => handleTabClick(tab.id, tab.disabled)}
            className={cn(tabVariants({ variant }))}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab?.content && (
        <div
          role="tabpanel"
          id={`panel-${activeTab.id}`}
          aria-labelledby={activeTab.id}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
