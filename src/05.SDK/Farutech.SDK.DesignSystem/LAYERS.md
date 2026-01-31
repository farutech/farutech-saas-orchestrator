# Layer System Documentation

This document describes the layer system architecture used in the Farutech Design System for building complex, composable UI components.

## Overview

The layer system provides a structured approach to component composition, allowing developers to build complex interfaces by combining simpler components in predictable ways. This system is inspired by design systems like Material Design and Ant Design but adapted for React and modern web development.

## Core Concepts

### 1. Atomic Design Principles

The layer system follows atomic design principles:

- **Atoms**: Basic UI elements (Button, Input, Icon)
- **Molecules**: Combinations of atoms (SearchBar, CardHeader)
- **Organisms**: Complex UI sections (DataTable, Navigation)
- **Templates**: Page-level layouts
- **Pages**: Complete application pages

### 2. Composition over Inheritance

Components are composed rather than extended:

```tsx
// ✅ Composition approach
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <Button>Action</Button>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>

// ❌ Inheritance approach (not used)
class CustomCard extends Card {
  // ...
}
```

## Layer Architecture

### Layer 1: Foundation (Atoms)

Basic building blocks with minimal functionality:

#### UI Primitives
- **Button**: Interactive elements for actions
- **Input/Textarea**: Data input components
- **Select**: Option selection
- **Checkbox/Radio**: Boolean input
- **Icon**: Visual symbols

#### Layout Primitives
- **Box**: Basic container
- **Stack**: Vertical/horizontal layouts
- **Grid**: 2D layouts
- **Separator**: Visual dividers

#### Typography
- **Text**: Styled text elements
- **Heading**: Semantic headings
- **Code**: Code display

### Layer 2: Composition (Molecules)

Combinations of foundation components:

#### Form Controls
- **FormField**: Label + input + validation
- **FormGroup**: Related form fields
- **SearchBar**: Input + search icon + clear button

#### Data Display
- **Avatar**: User/profile image
- **Badge**: Status indicators
- **Tag**: Categorization labels

#### Navigation
- **Breadcrumb**: Navigation path
- **Tab**: Tabbed interface
- **MenuItem**: Individual menu items

### Layer 3: Complex Components (Organisms)

Full-featured UI components:

#### Data Tables
- **DataTable**: Sortable, filterable tables
- **DataGrid**: Advanced grid with editing
- **DataList**: Alternative list view

#### Forms
- **Form**: Complete form with validation
- **Wizard**: Multi-step forms
- **FilterPanel**: Advanced filtering

#### Layout Components
- **Sidebar**: Navigation sidebar
- **Header**: Application header
- **Footer**: Application footer

### Layer 4: Templates

Page-level layouts and structures:

#### Dashboard Templates
- **DashboardLayout**: Main dashboard structure
- **DetailLayout**: Detail view layout
- **ListLayout**: List view layout

#### Form Templates
- **CreateForm**: Creation form layout
- **EditForm**: Edit form layout
- **SettingsForm**: Settings form layout

### Layer 5: Pages

Complete application pages (implementation-specific).

## Composition Patterns

### 1. Slot-Based Composition

Components expose slots for customization:

```tsx
<Modal>
  <ModalHeader slot="header">
    <ModalTitle>Confirm Action</ModalTitle>
  </ModalHeader>
  <ModalBody slot="body">
    <p>Are you sure you want to proceed?</p>
  </ModalBody>
  <ModalFooter slot="footer">
    <Button variant="outline">Cancel</Button>
    <Button>Confirm</Button>
  </ModalFooter>
</Modal>
```

### 2. Render Props Pattern

For advanced customization:

```tsx
<DataTable
  data={items}
  columns={columns}
  renderRow={(item, index) => (
    <CustomRow key={item.id} item={item} index={index} />
  )}
/>
```

### 3. Compound Components

Related components grouped together:

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <Tab1Content />
  </TabsContent>
  <TabsContent value="tab2">
    <Tab2Content />
  </TabsContent>
</Tabs>
```

## Data Flow Patterns

### 1. Unidirectional Data Flow

Data flows down, events flow up:

```tsx
function App() {
  const [data, setData] = useState(initialData);

  return (
    <DataTable
      data={data}                    // Data flows down
      onDataChange={setData}         // Events flow up
    />
  );
}
```

### 2. Context for Shared State

Use React Context for shared state:

```tsx
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 3. Custom Hooks for Logic

Extract complex logic into custom hooks:

```tsx
function useDataTable(data, columns) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');

  // Complex table logic here

  return {
    tableState,
    tableActions,
  };
}
```

## Styling Patterns

### 1. CSS-in-JS with Theme Variables

```tsx
const StyledButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primaryForeground};
  border-radius: ${props => props.theme.radii.md};
`;
```

### 2. Utility-First CSS

```tsx
function Button({ variant, size, children }) {
  return (
    <button
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`
      )}
    >
      {children}
    </button>
  );
}
```

### 3. CSS Custom Properties

```css
:root {
  --color-primary: #007acc;
  --spacing-sm: 0.5rem;
  --radius-md: 0.375rem;
}

.btn-primary {
  background: var(--color-primary);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
}
```

## Accessibility Patterns

### 1. Semantic HTML

Use appropriate HTML elements:

```tsx
// ✅ Good
<button onClick={handleClick}>
  Save Changes
</button>

// ❌ Bad
<div onClick={handleClick} role="button" tabIndex={0}>
  Save Changes
</div>
```

### 2. ARIA Attributes

Add ARIA attributes when needed:

```tsx
<Dialog
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-description">
    This action cannot be undone.
  </p>
</Dialog>
```

### 3. Keyboard Navigation

Ensure keyboard accessibility:

```tsx
function Menu({ items, onSelect }) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        setFocusedIndex(Math.min(focusedIndex + 1, items.length - 1));
        break;
      case 'ArrowUp':
        setFocusedIndex(Math.max(focusedIndex - 1, 0));
        break;
      case 'Enter':
        onSelect(items[focusedIndex]);
        break;
    }
  };

  return (
    <ul role="menu" onKeyDown={handleKeyDown}>
      {items.map((item, index) => (
        <li
          key={item.id}
          role="menuitem"
          tabIndex={index === focusedIndex ? 0 : -1}
          aria-selected={index === focusedIndex}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}
```

## Performance Patterns

### 1. Component Memoization

```tsx
const MemoizedComponent = React.memo(function Component({ data, onChange }) {
  return (
    <div>
      {data.map(item => (
        <Item key={item.id} item={item} onChange={onChange} />
      ))}
    </div>
  );
});
```

### 2. Lazy Loading

```tsx
const LazyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 3. Virtualization

```tsx
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }) {
  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].name}
        </div>
      )}
    </List>
  );
}
```

## Testing Patterns

### 1. Component Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';

test('Button renders and handles click', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  const button = screen.getByRole('button', { name: /click me/i });
  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 2. Integration Testing

```tsx
test('Form submission works', async () => {
  render(
    <Form onSubmit={handleSubmit}>
      <Input name="email" />
      <Button type="submit">Submit</Button>
    </Form>
  );

  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole('button', { name: /submit/i });

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com'
    });
  });
});
```

## Migration Guide

### From Class Components to Functional Components

```tsx
// Before (Class Component)
class Button extends React.Component {
  render() {
    return <button className={this.props.className}>{this.props.children}</button>;
  }
}

// After (Functional Component)
function Button({ className, children }) {
  return <button className={className}>{children}</button>;
}
```

### From Prop Drilling to Context

```tsx
// Before (Prop Drilling)
function App() {
  const [theme, setTheme] = useState('light');
  return <Layout theme={theme} setTheme={setTheme} />;
}

function Layout({ theme, setTheme }) {
  return <Header theme={theme} setTheme={setTheme} />;
}

function Header({ theme, setTheme }) {
  return <ThemeToggle theme={theme} setTheme={setTheme} />;
}

// After (Context)
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} />;
}
```

## Best Practices

### 1. Single Responsibility

Each component should have one clear purpose:

```tsx
// ✅ Good
function UserCard({ user }) {
  return (
    <Card>
      <Avatar src={user.avatar} />
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    </Card>
  );
}

// ❌ Bad (multiple responsibilities)
function UserCard({ user, onEdit, onDelete, showActions }) {
  return (
    <Card>
      {/* User display */}
      <Avatar src={user.avatar} />
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
      {/* Actions */}
      {showActions && (
        <div>
          <Button onClick={() => onEdit(user)}>Edit</Button>
          <Button onClick={() => onDelete(user)}>Delete</Button>
        </div>
      )}
    </Card>
  );
}
```

### 2. Prop Validation

Use TypeScript for prop validation:

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children
}: ButtonProps) {
  // Component implementation
}
```

### 3. Error Boundaries

Wrap components that might throw errors:

```tsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### 4. Documentation

Document component APIs:

```tsx
/**
 * Button component for user interactions
 *
 * @param variant - Visual style variant
 * @param size - Size of the button
 * @param disabled - Whether the button is disabled
 * @param onClick - Click handler function
 * @param children - Button content
 */
function Button({ variant, size, disabled, onClick, children }: ButtonProps) {
  // Implementation
}
```