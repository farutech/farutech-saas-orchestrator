export * from './components/ui';
export * from './styles';

// Farutech-specific Components
export { FarutechLogo } from './components/FarutechLogo';
export { ModuleCard } from './components/ModuleCard';
export { LoadingSpinner } from './components/LoadingSpinner';
export { ErrorBoundary } from './components/ErrorBoundary';

// Hooks
export { useIsMobile } from './hooks/use-mobile';
export { useToast } from './hooks/use-toast';
export { useLocalStorage } from './hooks/use-local-storage';
export { useDataTable, type UseDataTableOptions, type UseDataTableReturn } from './hooks/use-data-table';
export { useResponsive, type Breakpoint } from './hooks/use-responsive';
export { useDebounce } from './hooks/use-debounce';

// Utils
export { cn } from './utils/cn';

// Presets & Styles
export { farutechPreset } from './presets/tailwind-preset';

// Legacy exports (for backward compatibility)
export { SDKVersionDashboard } from './components/SDKVersionDashboard';
export { AnalyticsDashboard } from './components/AnalyticsDashboard';
export { useAuth } from './hooks/useAuth';
export { UrlBuilder, createUrl } from './utils/urlBuilder';