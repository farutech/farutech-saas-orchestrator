/**
 * Exports de componentes UI
 */

// Base components
export { Button } from './Button'
export { ButtonGroup } from './ButtonGroup'
export { Card, CardHeader } from './Card'
export { Input } from './Input'
export { MaskedInput } from './MaskedInput'
export type { MaskedInputProps, PredefinedMask } from './MaskedInput'
export { Textarea } from './Textarea'
export { Select } from './Select'
export { Modal } from './Modal'
export { ToastContainer } from './Toast'
export { Badge } from './Badge'
export { Loading, Skeleton as LoadingSkeleton, TableSkeleton, CardSkeleton } from './Loading'
export { Divider, SectionHeader } from './Divider'

// Advanced components
export { Alert } from './Alert'
export { Avatar, AvatarGroup } from './Avatar'
export { Breadcrumb } from './Breadcrumb'
export { Carousel } from './Carousel'
export { Checkbox, CheckboxGroup } from './Checkbox'
export { Dropdown } from './Dropdown'
export { Form, FormRow, FormGroup, FormSection, FormActions } from './Form'
export { ListBox } from './ListBox'
export { ListGroup } from './ListGroup'
export { LogoSpinner, LogoSpinnerOverlay } from './LogoSpinner'
export { GlobalLoading, useGlobalLoading } from './GlobalLoading'
export { PhoneInput } from './PhoneInput'
export { ProgressBar, MultiProgressBar } from './ProgressBar'
export { RadioGroup } from './RadioGroup'
export { DataTable } from './DataTable'
export type { 
  DataTableProps, 
  DataTablePagination, 
  DataTableActions, 
  DataTableGlobalAction,
  DataTableFilter,
  FilterState,
  FilterType
} from './DataTable'
export { Spinner, ProgressSpinner } from './Spinner'
export { Switch } from './Switch'
export { Tabs } from './Tabs'
export { Tooltip } from './Tooltip'

// New components
export { StatsCard, StatsCardGroup } from './StatsCard'
export type { StatsCardProps } from './StatsCard'
export { EmptyState, NoDataState, NoResultsState, NoPermissionState, ErrorState } from './EmptyState'
export type { EmptyStateProps } from './EmptyState'
export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonList, 
  SkeletonTable, 
  SkeletonForm, 
  SkeletonText,
  SkeletonAvatar,
  SkeletonGrid 
} from './Skeleton'
export { Drawer, DrawerFooter } from './Drawer'
export type { DrawerProps } from './Drawer'
export { Stepper, useStepper } from './Stepper'
export type { Step, StepperProps } from './Stepper'
export { DatePicker, DateTimePicker, DateRangePicker } from './DatePicker'
export type { DatePickerProps, DateTimePickerProps, DateRangePickerProps } from './DatePicker'

// Advanced Date Controls
export { 
  DatePicker as DatePickerV2, 
  DateRangePicker as DateRangePickerV2, 
  TimeRangePicker,
  CalendarNavigation,
  CalendarGrid,
  TimePicker
} from './DateControls'
export type { 
  SingleDatePickerProps, 
  DateRangePickerProps as DateRangePickerV2Props, 
  TimeRangePickerProps, 
  BaseDatePickerProps 
} from './DateControls'

// Scheduler
export { Scheduler } from './Scheduler'
export type { 
  SchedulerProps, 
  SchedulerConfig, 
  Appointment, 
  AppointmentStatus, 
  ViewMode 
} from './Scheduler'
export { ModuleSwitcher, useModuleSwitcher } from './ModuleSwitcher'
export type { Module, ModuleSwitcherProps } from './ModuleSwitcher'
export { CommandPalette, useCommandPalette } from './CommandPalette'
export type { Command, CommandPaletteProps } from './CommandPalette'
export { NotificationPanel } from './NotificationPanel'
export type { Notification, NotificationPanelProps } from './NotificationPanel'
export { CodePreview, CodePreviewGroup } from './CodePreview'
export type { CodePreviewProps, CodePreviewGroupProps } from './CodePreview'

// Charts
export { ChartLine, ChartBar, ChartPie, ChartArea, ChartRadar, ChartGauge, CHART_COLORS, DEFAULT_COLORS } from './Charts'
export type { ChartLineProps, ChartBarProps, ChartPieProps, ChartAreaProps, ChartRadarProps, ChartGaugeProps } from './Charts'

// TagInput
export { default as TagInput } from './TagInput'
export type { Tag, TagInputProps } from './TagInput'

// FloatingActionButton
export { FloatingActionButton } from './FloatingActionButton'
export type { FloatingActionButtonProps, FABAction } from './FloatingActionButton'

// Export types
export type { BreadcrumbItem } from './Breadcrumb'
export type { DropdownItem } from './Dropdown'
export type { ListBoxOption } from './ListBox'
export type { ListGroupItem } from './ListGroup'
export type { RadioOption } from './RadioGroup'
export type { TabItem } from './Tabs'
