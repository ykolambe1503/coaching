# Modern UI System Documentation

## Overview

This document outlines the modern UI system implemented for the Coaching Platform frontend. The system is built with React, TypeScript, and Tailwind CSS, providing a comprehensive set of reusable components and design tokens.

## Design System

### Color Palette

The design system uses a comprehensive color palette with semantic naming:

- **Primary**: Blue tones for main actions and branding
- **Secondary**: Purple tones for secondary actions and accents
- **Accent**: Orange tones for highlights and call-to-actions
- **Success**: Green tones for positive states
- **Warning**: Yellow/Orange tones for caution states
- **Error**: Red tones for error states
- **Neutral**: Gray tones for text and backgrounds

Each color has 11 shades (50-950) for maximum flexibility.

### Typography

- **Font Family**: Inter (primary), Cal Sans (display headings)
- **Font Sizes**: Responsive scale from xs (12px) to 9xl (128px)
- **Font Weights**: 300-900 range with semantic naming

### Spacing & Layout

- **Spacing Scale**: Consistent 4px base unit with extended scale
- **Border Radius**: From sm (2px) to 5xl (40px)
- **Container**: Responsive max-width with consistent padding

## Component Library

### Core Components

#### Button
```tsx
import { Button } from '../components/ui/Button';

<Button variant="primary" size="lg" loading={false} icon={<Icon />}>
  Click me
</Button>
```

**Variants**: primary, secondary, ghost, danger, success
**Sizes**: sm, md, lg, xl

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

<Card variant="hover">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

**Variants**: default, hover, interactive
**Padding**: none, sm, md, lg, xl

#### Input
```tsx
import { Input } from '../components/ui/Input';

<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  icon={<MailIcon />}
  error="Invalid email"
/>
```

#### Badge
```tsx
import { Badge } from '../components/ui/Badge';

<Badge variant="success" size="md">
  Active
</Badge>
```

**Variants**: primary, success, warning, error, neutral
**Sizes**: sm, md, lg

#### StatsCard
```tsx
import { StatsCard } from '../components/ui/StatsCard';

<StatsCard
  title="Total Users"
  value={1234}
  icon={UsersIcon}
  color="primary"
  trend={{
    value: 12,
    label: "vs last month",
    direction: "up"
  }}
/>
```

#### Modal
```tsx
import { Modal } from '../components/ui/Modal';

<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Modal Title"
  description="Modal description"
  size="lg"
>
  Modal content
</Modal>
```

#### Toast System
```tsx
import { useToast, ToastContainer } from '../components/ui/Toast';

const { toast, toasts, removeToast } = useToast();

// Usage
toast.success("Success!", "Operation completed successfully");
toast.error("Error!", "Something went wrong");

// Render container
<ToastContainer toasts={toasts} onClose={removeToast} />
```

### Layout Components

#### Navigation & Sidebar
```tsx
import { Sidebar, Navigation } from '../components/ui/Navigation';

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    active: true,
    badge: 5
  }
];

<Sidebar
  title="App Name"
  subtitle="Subtitle"
  logo={<Logo />}
  navigation={navigationItems}
  footer={<FooterContent />}
/>
```

### Loading States

#### LoadingSpinner
```tsx
import { LoadingSpinner, LoadingOverlay } from '../components/ui/LoadingSpinner';

<LoadingSpinner size="lg" text="Loading..." />

<LoadingOverlay isLoading={loading} text="Processing...">
  <YourContent />
</LoadingOverlay>
```

## Utility Classes

### Custom Tailwind Classes

The system extends Tailwind with custom utility classes:

```css
/* Buttons */
.btn-primary, .btn-secondary, .btn-ghost, .btn-danger, .btn-success
.btn-sm, .btn-md, .btn-lg, .btn-xl

/* Cards */
.card, .card-hover, .card-interactive

/* Inputs */
.input, .input-error

/* Badges */
.badge-primary, .badge-success, .badge-warning, .badge-error, .badge-neutral

/* Layout */
.container-fluid, .section-padding

/* Effects */
.glass, .glass-dark
.gradient-primary, .gradient-secondary, .gradient-accent
.text-gradient-primary, .text-gradient-accent

/* Animations */
.animate-in, .animate-slide-up, .animate-scale-in
.animate-float, .animate-bounce-subtle, .animate-pulse-soft

/* Shadows */
.shadow-soft, .shadow-medium, .shadow-large
.shadow-glow, .shadow-glow-lg
```

## Animation System

### Built-in Animations

- **fade-in**: Smooth opacity transition
- **slide-up/down**: Vertical slide animations
- **scale-in**: Scale from 95% to 100%
- **float**: Gentle floating motion
- **bounce-subtle**: Subtle bounce effect
- **pulse-soft**: Gentle pulsing

### Usage
```tsx
<div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
  Content with delayed animation
</div>
```

## Responsive Design

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Mobile-First Approach
All components are designed mobile-first with progressive enhancement for larger screens.

## Best Practices

### Component Usage
1. **Consistency**: Use design system components instead of custom styles
2. **Accessibility**: All components include proper ARIA attributes
3. **Performance**: Components are optimized for minimal re-renders
4. **Theming**: Use semantic color names instead of specific colors

### Code Organization
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Layout-specific components
│   └── features/     # Feature-specific components
├── utils/
│   └── cn.ts         # Class name utility
└── styles/
    └── index.css     # Global styles and Tailwind
```

### Styling Guidelines
1. Use utility classes for spacing and layout
2. Use component variants for different states
3. Leverage the design system colors and typography
4. Implement responsive design with mobile-first approach

## Examples

### Landing Page
The landing page showcases:
- Hero section with gradient backgrounds
- Feature cards with hover effects
- Responsive grid layouts
- Call-to-action sections
- Modern typography and spacing

### Dashboard
The dashboard demonstrates:
- Sidebar navigation
- Stats cards with trends
- Data tables with modern styling
- Modal dialogs
- Loading states

### Forms
Form components include:
- Input fields with icons and validation
- Button variants and states
- Error handling and feedback
- Responsive layouts

## Future Enhancements

### Planned Features
1. **Dark Mode**: Complete dark theme implementation
2. **Theme Customization**: Runtime theme switching
3. **Advanced Charts**: Data visualization components
4. **Form Builder**: Dynamic form generation
5. **Table Components**: Advanced data table with sorting/filtering
6. **Date Picker**: Custom date selection component
7. **File Upload**: Drag-and-drop file upload component

### Performance Optimizations
1. **Code Splitting**: Lazy load components
2. **Bundle Analysis**: Optimize bundle size
3. **Image Optimization**: WebP support and lazy loading
4. **CSS Optimization**: Purge unused styles

## Migration Guide

### From Old System
1. Replace old button classes with new Button component
2. Update card layouts to use Card components
3. Replace custom modals with Modal component
4. Update color classes to use new design tokens
5. Implement new animation classes

### Testing
- All components include TypeScript types
- Components are tested for accessibility
- Responsive design is tested across breakpoints
- Performance is monitored for large datasets

This modern UI system provides a solid foundation for building beautiful, accessible, and performant user interfaces while maintaining consistency across the entire application.