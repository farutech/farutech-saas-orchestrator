# Styling Guide

This document provides comprehensive documentation for the styling system in the Farutech Design System.

## CSS Variables (Design Tokens)

The design system uses CSS custom properties (variables) for consistent theming and easy customization.

### Color Variables

#### Primary Colors
```css
--primary: hsl(221.2 83.2% 53.3%);
--primary-foreground: hsl(210 40% 98%);
```

#### Background Colors
```css
--background: hsl(0 0% 100%);
--foreground: hsl(222.2 84% 4.9%);
--muted: hsl(210 40% 96%);
--muted-foreground: hsl(215.4 16.3% 46.9%);
```

#### Border Colors
```css
--border: hsl(214.3 31.8% 91.4%);
--input: hsl(214.3 31.8% 91.4%);
```

#### Destructive Colors
```css
--destructive: hsl(0 84.2% 60.2%);
--destructive-foreground: hsl(210 40% 98%);
```

#### Accent Colors
```css
--accent: hsl(210 40% 96%);
--accent-foreground: hsl(222.2 84% 4.9%);
```

#### Popover/Card Colors
```css
--popover: hsl(0 0% 100%);
--popover-foreground: hsl(222.2 84% 4.9%);
--card: hsl(0 0% 100%);
--card-foreground: hsl(222.2 84% 4.9%);
```

### Spacing Variables

```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
--spacing-20: 5rem;    /* 80px */
--spacing-24: 6rem;    /* 96px */
```

### Border Radius Variables

```css
--radius-sm: 0.125rem;  /* 2px */
--radius: 0.25rem;      /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;  /* Fully rounded */
```

### Font Size Variables

```css
--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-xl: 1.25rem;   /* 20px */
--font-size-2xl: 1.5rem;   /* 24px */
--font-size-3xl: 1.875rem; /* 30px */
--font-size-4xl: 2.25rem;  /* 36px */
--font-size-5xl: 3rem;     /* 48px */
```

## Component-Specific Styles

### DataTable Styles

```css
/* DataTable container */
.data-table {
  --table-border: var(--border);
  --table-header-bg: var(--muted);
  --table-row-hover: var(--muted);
  --table-selected: var(--accent);
}

/* DataTable pagination */
.data-table-pagination {
  --pagination-border: var(--border);
  --pagination-hover: var(--accent);
}

/* DataTable search input */
.data-table-search {
  --search-border: var(--input);
  --search-focus: var(--ring);
}
```

### Form Styles

```css
/* Form inputs */
.form-input {
  --input-border: var(--input);
  --input-focus: var(--ring);
  --input-error: var(--destructive);
}

/* Form labels */
.form-label {
  --label-color: var(--foreground);
  --label-required: var(--destructive);
}

/* Form validation */
.form-error {
  --error-color: var(--destructive);
  --error-size: var(--font-size-sm);
}
```

### Toast Styles

```css
/* Toast animations */
.toast-enter {
  animation: toast-slide-in 0.2s ease-out;
}

.toast-exit {
  animation: toast-slide-out 0.2s ease-in;
}

@keyframes toast-slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toast-slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
```

### Drawer Styles

```css
/* Drawer overlay */
.drawer-overlay {
  --overlay-bg: rgba(0, 0, 0, 0.8);
  --overlay-blur: blur(4px);
}

/* Drawer content */
.drawer-content {
  --drawer-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --drawer-border: var(--border);
}

/* Drawer animations */
.drawer-enter {
  animation: drawer-slide-up 0.3s ease-out;
}

.drawer-exit {
  animation: drawer-slide-down 0.3s ease-in;
}
```

## Responsive Design

### Breakpoints

```css
/* Mobile first approach */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;

/* Usage */
@media (min-width: var(--breakpoint-md)) {
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: var(--breakpoint-lg)) {
  .responsive-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Responsive Utilities

```css
/* Hide/show utilities */
.hidden-mobile {
  display: none;
}

@media (min-width: var(--breakpoint-md)) {
  .hidden-mobile {
    display: block;
  }

  .visible-mobile {
    display: none;
  }
}

/* Flex direction responsive */
.flex-col-mobile {
  flex-direction: column;
}

@media (min-width: var(--breakpoint-md)) {
  .flex-col-mobile {
    flex-direction: row;
  }
}
```

## Dark Mode Support

### Dark Mode Variables

```css
/* Dark mode overrides */
[data-theme="dark"] {
  --background: hsl(222.2 84% 4.9%);
  --foreground: hsl(210 40% 98%);
  --muted: hsl(217.2 32.6% 17.5%);
  --muted-foreground: hsl(215 20.2% 65.1%);
  --border: hsl(217.2 32.6% 17.5%);
  --input: hsl(217.2 32.6% 17.5%);
  --primary: hsl(210 40% 98%);
  --primary-foreground: hsl(222.2 84% 4.9%);
}
```

### Theme Switching

```tsx
// Using CSS custom properties for theme switching
function ThemeProvider({ children, theme }) {
  return (
    <div data-theme={theme}>
      {children}
    </div>
  );
}
```

## Customization Examples

### Custom Button Variant

```css
/* Custom button variant */
.btn-custom {
  --btn-bg: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  --btn-color: white;
  --btn-hover: brightness(1.1);
}

.btn-custom:hover {
  background: var(--btn-hover);
}
```

### Custom Card Style

```css
/* Custom card with glassmorphism effect */
.card-glass {
  --card-bg: rgba(255, 255, 255, 0.25);
  --card-border: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
```

### Custom Form Styling

```css
/* Custom form input focus */
.form-input-custom:focus {
  --input-focus-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  box-shadow: var(--input-focus-shadow);
}
```

## Best Practices

### 1. Use Design Tokens

Always use CSS custom properties instead of hardcoded values:

```css
/* ✅ Good */
.my-component {
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
}

/* ❌ Bad */
.my-component {
  color: #000;
  background: #fff;
  border: 1px solid #ccc;
}
```

### 2. Responsive First

Design mobile-first and enhance for larger screens:

```css
/* ✅ Good */
.component {
  padding: var(--spacing-2);
}

@media (min-width: var(--breakpoint-md)) {
  .component {
    padding: var(--spacing-4);
  }
}

/* ❌ Bad */
.component {
  padding: var(--spacing-4);
}

@media (max-width: var(--breakpoint-md)) {
  .component {
    padding: var(--spacing-2);
  }
}
```

### 3. Consistent Naming

Use consistent naming conventions for custom properties:

```css
/* Component-specific variables */
--component-name-property: value;

/* Example */
--button-primary-bg: var(--primary);
--button-primary-color: var(--primary-foreground);
```

### 4. Layered Architecture

Organize styles in layers:

```css
/* 1. Design tokens (variables) */
/* 2. Base styles (resets, typography) */
/* 3. Component styles */
/* 4. Utility classes */
/* 5. Theme overrides */
```

## Performance Considerations

### 1. Minimize Repaints

Use `transform` and `opacity` for animations instead of layout properties:

```css
/* ✅ Good */
.animate-slide {
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.animate-slide.active {
  transform: translateX(100px);
}

/* ❌ Bad */
.animate-slide {
  left: 0;
  transition: left 0.3s ease;
}

.animate-slide.active {
  left: 100px;
}
```

### 2. Optimize CSS Delivery

- Use CSS custom properties for dynamic theming
- Minimize CSS bundle size
- Consider critical CSS for above-the-fold content

### 3. Hardware Acceleration

Use GPU-accelerated properties for smooth animations:

```css
.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```