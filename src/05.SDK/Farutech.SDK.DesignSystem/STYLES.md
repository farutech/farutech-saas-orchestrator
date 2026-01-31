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
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
.drawer-overlay {
  --overlay-bg: rgba(0, 0, 0, 0.8);
  --overlay-blur: blur(4px);
}

### Breakpoints

```css
  }

  .visible-mobile {
    display: none;
  --foreground: hsl(210 40% 98%);

### Custom Button Variant

.form-input-custom:focus {
  --input-focus-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  box-shadow: var(--input-focus-shadow);
}
```

## Best Practices

### 1. Use Design Tokens

Always use CSS custom properties instead of hardcoded values:
# Farutech Design System - Styles Guide

## Overview

The Farutech Design System provides a comprehensive styling foundation built on CSS custom properties (CSS variables), Tailwind CSS utilities, and component-specific styles. This system ensures consistent design across all Farutech applications while maintaining flexibility and performance.

## CSS Architecture

### Layer System
```css
@layer base     /* Base styles, resets, typography */
@layer components /* Component-specific styles */
@layer utilities /* Utility classes */
```

### File Structure
```
src/styles/
├── globals.css      # Main stylesheet with CSS variables and base styles
├── components.css   # Component-specific styles
└── index.css        # Entry point that imports all styles
```

## CSS Custom Properties (Variables)

### Color System
```css
/* Base Colors */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;

/* Semantic Colors */
--primary: 199 89% 48%;
--secondary: 210 40% 96%;
--muted: 210 40% 96%;
--accent: 210 40% 96%;
--destructive: 0 84.2% 60.2%;
--success: 142 76% 36%;
--warning: 38 92% 50%;
--info: 199 89% 48%;

/* UI Elements */
--border: 214.3 31.8% 91.4%;
--input: 214.3 31.8% 91.4%;
--ring: 199 89% 48%;
```

### Spacing System
```css
--spacing-1: 0.25rem;    /* 4px */
--spacing-2: 0.5rem;     /* 8px */
--spacing-3: 0.75rem;    /* 12px */
--spacing-4: 1rem;       /* 16px */
--spacing-5: 1.25rem;    /* 20px */
--spacing-6: 1.5rem;     /* 24px */
--spacing-8: 2rem;       /* 32px */
--spacing-10: 2.5rem;    /* 40px */
--spacing-12: 3rem;      /* 48px */
--spacing-16: 4rem;      /* 64px */
--spacing-20: 5rem;      /* 80px */
--spacing-24: 6rem;      /* 96px */
```

### Typography System
```css
--font-size-xs: 0.75rem;      /* 12px */
--font-size-sm: 0.875rem;     /* 14px */
--font-size-base: 1rem;       /* 16px */
--font-size-lg: 1.125rem;     /* 18px */
--font-size-xl: 1.25rem;      /* 20px */
--font-size-2xl: 1.5rem;      /* 24px */
--font-size-3xl: 1.875rem;    /* 30px */
--font-size-4xl: 2.25rem;     /* 36px */
--font-size-5xl: 3rem;        /* 48px */

--font-weight-thin: 100;
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
--font-weight-black: 900;
```

### Border Radius System
```css
--radius: 0.5rem;        /* 8px - default */
--radius-sm: 0.25rem;    /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
```

### Shadow System
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

### Transition System
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
```

## Dark Mode Support

The system automatically supports dark mode through CSS custom properties:

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  /* ... other dark mode overrides */
}
```

## Animation System

### Built-in Animations
```css
.animate-fade-in      /* Smooth fade in */
.animate-fade-out     /* Smooth fade out */
.animate-slide-in     /* Slide in from bottom */
.animate-slide-out    /* Slide out to top */
.animate-scale-in     /* Scale in effect */
.animate-scale-out    /* Scale out effect */
.animate-bounce-in    /* Bounce entrance */
.animate-pulse-soft   /* Soft pulsing */
.animate-shimmer      /* Loading shimmer */
.animate-gradient     /* Animated gradient */
```

### Hover Effects
```css
.hover-lift     /* Lift on hover */
.hover-glow     /* Glow effect on hover */
```

### Glass Effects
```css
.glass         /* Glass morphism effect */
.glass-dark    /* Dark glass effect */
```

## Component-Specific Styles

### DataTable Styles
```css
.data-table {
  /* Base table styles */
}

.data-table-pagination {
  /* Pagination controls */
}

.data-table-search {
  /* Search functionality */
}

.data-table-filters {
  /* Filter controls */
}

.data-table-bulk-actions {
  /* Bulk action toolbar */
}
```

### Form Styles
```css
.form-group {
  /* Form field grouping */
}

.form-label {
  /* Form labels */
}

.form-field {
  /* Input fields */
}

.form-field.error {
  /* Error state */
}

.form-field.success {
  /* Success state */
}

.input-group {
  /* Input with prefix/suffix */
}
```

### Toast Styles
```css
.toast-root {
  /* Toast container */
}

.toast-viewport {
  /* Toast viewport */
}

.toast-close {
  /* Close button */
}

.toast-action {
  /* Action button */
}
```

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
@media (max-width: 640px)  /* sm: 640px */
@media (max-width: 768px)  /* md: 768px */
@media (min-width: 1024px) /* lg: 1024px */
@media (min-width: 1280px) /* xl: 1280px */
@media (min-width: 1536px) /* 2xl: 1536px */
```

### Responsive Utilities
```css
/* Mobile-specific adjustments */
@media (max-width: 640px) {
  .data-table-pagination .pagination-controls {
    @apply flex-col space-x-0 space-y-2;
  }
}

/* Tablet adjustments */
@media (max-width: 768px) {
  .data-table-search {
    @apply max-w-full;
  }
}

/* Desktop enhancements */
@media (min-width: 1024px) {
  .data-table {
    @apply text-base;
  }
}
```

## Accessibility Features

### High Contrast Support
```css
@media (prefers-contrast: high) {
  .data-table tbody tr:hover {
    @apply bg-current opacity-10;
  }

  .badge-root {
    @apply border-2;
  }
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-fade-out,
  .animate-slide-in,
  .animate-slide-out {
    @apply animate-none;
  }

  .hover-lift,
  .hover-glow {
    @apply transition-none;
  }
}
```

## Print Styles

```css
@media print {
  .data-table-pagination,
  .data-table-search,
  .data-table-filters,
  .data-table-bulk-actions {
    @apply hidden;
  }

  .data-table {
    @apply text-xs;
  }
}
```

## Performance Optimizations

### CSS Containment
```css
.component-container {
  contain: layout style paint;
}
```

### GPU Acceleration
```css
.animated-element {
  transform: translateZ(0);
  will-change: transform;
}
```

### Critical CSS
- Load above-the-fold styles immediately
- Defer non-critical styles
- Use CSS-in-JS for dynamic styles when needed

## Usage Examples

### Using CSS Variables
```css
.my-component {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
```

### Combining with Tailwind
```css
.my-button {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
  @apply rounded-md px-4 py-2 transition-colors;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring;
}
```

### Component Variants
```css
.button-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

.button-secondary {
  @apply bg-secondary text-secondary-foreground hover:bg-secondary/80;
}

.button-destructive {
  @apply bg-destructive text-destructive-foreground hover:bg-destructive/90;
}
```

## Best Practices

### 1. Use CSS Variables for Theming
```css
/* ✅ Good */
.my-component {
  color: hsl(var(--primary));
}

/* ❌ Avoid */
.my-component {
  color: #3b82f6;
}
```

### 2. Leverage Tailwind Utilities
```css
/* ✅ Good */
.card {
  @apply rounded-lg border bg-card p-6 shadow-sm;
}

/* ❌ Avoid */
.card {
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
```

### 3. Use Component Classes
```html
<button class="button-primary">Click me</button>
```

### 4. Responsive First
```css
.responsive-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3;
}
```

## Migration Guide

### From Custom CSS to Design System

1. **Replace hardcoded colors** with CSS variables
2. **Use Tailwind utilities** instead of custom CSS
3. **Leverage component classes** for consistency
4. **Implement responsive design** with mobile-first approach
5. **Add accessibility features** and reduced motion support

## Maintenance

### Adding New Colors
1. Add to CSS variables in `globals.css`
2. Update dark mode variants
3. Document in this guide
4. Update component variants if needed

### Adding New Components
1. Create component-specific styles in `components.css`
2. Use established naming conventions
3. Include responsive variants
4. Add accessibility features
5. Document usage patterns

### Performance Monitoring
- Monitor CSS bundle size
- Check for unused styles
- Optimize critical CSS delivery
- Audit for performance regressions

This styling system provides a solid foundation for consistent, accessible, and performant UI components across the Farutech platform.
