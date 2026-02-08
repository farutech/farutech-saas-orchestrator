/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                        DASHBOARD LIBRARY EXPORTS                           ║
 * ║                                                                            ║
 * ║  Punto de entrada para uso como librería npm                              ║
 * ║  Exporta todos los componentes, hooks y utilidades                        ║
 * ║                                                                            ║
 * ║  @author    Farid Maloof Suarez                                           ║
 * ║  @company   FaruTech                                                      ║
 * ║  @version   1.0.0                                                         ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

export {
  type ApplicationConfig,
  type ApplicationBranding,
  type ApplicationTheme,
  type ApplicationModule,
  type ApplicationRoute,
  type DataSourceConfig,
  type ApplicationActions,
  type ActionConfig,
  getApplicationConfig,
  DEFAULT_APPLICATION_ID,
  APPLICATIONS_REGISTRY,
  FARUTECH_APP_CONFIG,
  CLIENT_DEMO_APP_CONFIG
} from './config/applications.config'

// ============================================================================
// STORES
// ============================================================================

export {
  useApplicationStore,
  useAppConfig,
  useAppBranding,
  useAppTheme,
  useAppModules,
  useAppFeature
} from './store/applicationStore'

export { useThemeStore } from './store/themeStore'
export { useAuthStore } from './store/authStore'
export { useModuleStore } from './store/moduleStore'
export { useSidebarStore } from './store/sidebarStore'

// ============================================================================
// HOOKS
// ============================================================================

export {
  useDataSource,
  useDataSourceMutation,
  useLocalDataSource,
  filterDataLocally,
  sortDataLocally,
  paginateDataLocally,
  type DataSourceState,
  type PaginationParams
} from './hooks/useDataSource'

export {
  useActionExecutor,
  convertActionConfigToTableAction,
  type ActionContext,
  type ActionExecutionResult
} from './hooks/useActionExecutor'

export { useCrud } from './hooks/useCrud'
export { useAuth } from './hooks/useAuth'
export { useApi } from './hooks/useApi'

// ============================================================================
// UTILITIES
// ============================================================================

export {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  lightenColor,
  darkenColor,
  adjustSaturation,
  getComplementaryColor,
  getAnalogousColor,
  generateColorScale,
  generateGradients,
  applyCSSVariables,
  getCSSVariable,
  setCSSVariable,
  isColorDark,
  getContrastTextColor,
  generateCompleteTheme
} from './utils/theme-generator'

// ============================================================================
// COMPONENTS - UI
// ============================================================================

// Basic Components
export { Button } from './components/ui/Button'
export { Input } from './components/ui/Input'
export { Textarea } from './components/ui/Textarea'
export { Card } from './components/ui/Card'
export { Badge } from './components/ui/Badge'
export { Alert } from './components/ui/Alert'
export { Avatar } from './components/ui/Avatar'

// Advanced Selects
export {
  AdvancedSelect,
  MultiSelect,
  CountrySelect,
  COUNTRIES,
  type SelectOption,
  type AdvancedSelectProps,
  type MultiSelectProps,
  type Country,
  type CountrySelectProps
} from './components/ui/AdvancedSelect'

// Image Upload
export {
  ImageUploadAdvanced,
  type ImageFile,
  type ImageUploadProps
} from './components/ui/ImageUploadAdvanced'

// Date Controls
export {
  DatePicker,
  TimePicker,
  DateTimePicker,
  DateRangePicker,
  TimeRangePicker,
  DateTimeRangePicker
} from './components/ui/DateControls'

// Data Display
export {
  DataTable,
  type DataTablePagination,
  type DataTableFilter,
  type FilterState,
  type DataTableGlobalAction
} from './components/ui/DataTable'

export { Charts } from './components/ui/Charts'
export { StatsCard } from './components/ui/StatsCard'

// Navigation
export { Tabs } from './components/ui/Tabs'
export { Breadcrumb } from './components/ui/Breadcrumb'
export { Dropdown } from './components/ui/Dropdown'

// Feedback
export { Modal } from './components/ui/Modal'
export { Drawer } from './components/ui/Drawer'
export { Loading } from './components/ui/Loading'
export { EmptyState } from './components/ui/EmptyState'
export { Skeleton } from './components/ui/Skeleton'

// Forms
export { Form } from './components/ui/Form'
export { Select } from './components/ui/Select'
export { Checkbox } from './components/ui/Checkbox'
export { Radio } from './components/ui/Radio'
export { Switch } from './components/ui/Switch'
export { PhoneInput } from './components/ui/PhoneInput'
export { MaskedInput } from './components/ui/MaskedInput'
export { TagInput } from './components/ui/TagInput'

// Utility Components
export { IconRenderer } from './components/ui/IconRenderer'
export { Divider } from './components/ui/Divider'
export { Tooltip } from './components/ui/Tooltip'
export { CommandPalette } from './components/ui/CommandPalette'

// ============================================================================
// COMPONENTS - LAYOUT
// ============================================================================

export { MainLayout } from './components/layout/MainLayout'
export { Sidebar } from './components/layout/Sidebar'
export { Navbar } from './components/layout/Navbar'
export { RequireAuth } from './components/layout/RequireAuth'

// ============================================================================
// COMPONENTS - CRUD
// ============================================================================

export { CrudTable } from './components/crud/CrudTable'
export { CrudActions } from './components/crud/CrudActions'
export { CrudPagination } from './components/crud/CrudPagination'
export { CrudFilters } from './components/crud/CrudFilters'

// ============================================================================
// TYPES
// ============================================================================

export type {
  Theme,
  User,
  MenuItem
} from './types'

// ============================================================================
// VERSION
// ============================================================================

export const VERSION = '1.0.0'
export const LIBRARY_NAME = 'FaruTech Dashboard Multi-Tenant'
export const AUTHOR = 'Farid Maloof Suarez - FaruTech'

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  VERSION,
  LIBRARY_NAME,
  AUTHOR,
  // Re-export principales
  useApplicationStore,
  useAppConfig,
  useAppTheme,
  useDataSource,
  useActionExecutor,
  // Componentes más usados
  Button,
  Input,
  Card,
  DataTable,
  AdvancedSelect,
  MultiSelect,
  ImageUploadAdvanced,
  DatePicker,
  Modal
}
