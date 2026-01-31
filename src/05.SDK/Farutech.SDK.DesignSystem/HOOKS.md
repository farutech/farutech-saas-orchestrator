# Hooks Documentation

This document provides comprehensive documentation for all custom hooks available in the Farutech Design System.

## useDataTable

Advanced hook for managing data table state, including sorting, filtering, pagination, and selection.

### Usage

```tsx
import { useDataTable } from '@farutech/design-system';

const {
  table,
  globalFilter,
  setGlobalFilter,
  selectedRows,
  toggleRowSelection,
  toggleAllRows,
  pagination,
  setPagination,
  sorting,
  setSorting,
} = useDataTable({
  data,
  columns,
  pageSize: 10,
  enableSorting: true,
  enableFiltering: true,
  enableSelection: true,
});
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | `TData[]` | - | Array of data to display |
| `columns` | `ColumnDef<TData>[]` | - | Column definitions |
| `pageSize` | `number` | `10` | Number of items per page |
| `enableSorting` | `boolean` | `true` | Enable column sorting |
| `enableFiltering` | `boolean` | `true` | Enable global filtering |
| `enableSelection` | `boolean` | `false` | Enable row selection |

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `table` | `Table<TData>` | TanStack table instance |
| `globalFilter` | `string` | Current global filter value |
| `setGlobalFilter` | `(value: string) => void` | Set global filter |
| `selectedRows` | `TData[]` | Array of selected rows |
| `toggleRowSelection` | `(row: TData) => void` | Toggle single row selection |
| `toggleAllRows` | `() => void` | Toggle all rows selection |
| `pagination` | `PaginationState` | Current pagination state |
| `setPagination` | `(state: PaginationState) => void` | Set pagination state |
| `sorting` | `SortingState` | Current sorting state |
| `setSorting` | `(state: SortingState) => void` | Set sorting state |

## useResponsive

Hook for responsive design utilities and breakpoint detection.

### Usage

```tsx
import { useResponsive } from '@farutech/design-system';

const { isMobile, isTablet, isDesktop, breakpoint } = useResponsive();
```

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `isMobile` | `boolean` | True if screen width < 768px |
| `isTablet` | `boolean` | True if screen width >= 768px and < 1024px |
| `isDesktop` | `boolean` | True if screen width >= 1024px |
| `breakpoint` | `'mobile' \| 'tablet' \| 'desktop'` | Current breakpoint |

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: >= 1024px

## useDebounce

Hook for debouncing values to limit the rate of function execution.

### Usage

```tsx
import { useDebounce } from '@farutech/design-system';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 300);

// Use debouncedSearchTerm for API calls
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `T` | - | Value to debounce |
| `delay` | `number` | `300` | Debounce delay in milliseconds |

### Return Value

Returns the debounced value of type `T`.

## useToast

Hook for managing toast notifications.

### Usage

```tsx
import { useToast } from '@farutech/design-system';

const { toast } = useToast();

// Show a toast
toast({
  title: 'Success!',
  description: 'Your changes have been saved.',
  variant: 'default', // or 'destructive'
  action: <ToastAction>Undo</ToastAction>,
});
```

### Toast Options

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Toast title |
| `description` | `string` | Toast description |
| `variant` | `'default' \| 'destructive'` | Toast variant |
| `action` | `ToastActionElement` | Action button element |

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `toast` | `(options: ToastOptions) => void` | Function to show toast |
| `toasts` | `ToasterToast[]` | Array of current toasts |
| `dismiss` | `(toastId?: string) => void` | Dismiss toast(s) |

## useLocalStorage

Hook for persisting state in localStorage.

### Usage

```tsx
import { useLocalStorage } from '@farutech/design-system';

const [value, setValue] = useLocalStorage('key', 'defaultValue');
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | `string` | localStorage key |
| `initialValue` | `T` | Initial value if key doesn't exist |

### Return Value

Returns a state tuple `[value, setValue]` where `value` is of type `T`.

## useAuth

Hook for authentication state management.

### Usage

```tsx
import { useAuth } from '@farutech/design-system';

const { user, login, logout, isAuthenticated, isLoading } = useAuth();
```

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current authenticated user |
| `login` | `(credentials: LoginCredentials) => Promise<void>` | Login function |
| `logout` | `() => Promise<void>` | Logout function |
| `isAuthenticated` | `boolean` | Authentication status |
| `isLoading` | `boolean` | Loading state |

## useMobile

Hook for detecting mobile devices.

### Usage

```tsx
import { useMobile } from '@farutech/design-system';

const isMobile = useMobile();
```

### Return Value

Returns `true` if the device is mobile (screen width < 768px).

## Examples

### Data Table with Search and Selection

```tsx
import { useDataTable, DataTable } from '@farutech/design-system';

function UsersTable({ users }) {
  const {
    table,
    globalFilter,
    setGlobalFilter,
    selectedRows,
  } = useDataTable({
    data: users,
    columns: userColumns,
    enableSelection: true,
  });

  return (
    <div>
      <input
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search users..."
      />
      <DataTable
        table={table}
        selectable
        bulkActions={[
          {
            label: 'Delete Selected',
            onClick: (rows) => handleBulkDelete(rows),
            variant: 'destructive',
          },
        ]}
      />
    </div>
  );
}
```

### Responsive Component

```tsx
import { useResponsive } from '@farutech/design-system';

function ResponsiveLayout() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <div className={cn(
      isMobile && 'mobile-layout',
      isTablet && 'tablet-layout',
      isDesktop && 'desktop-layout',
    )}>
      {/* Content */}
    </div>
  );
}
```

### Debounced Search

```tsx
import { useDebounce } from '@farutech/design-system';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```