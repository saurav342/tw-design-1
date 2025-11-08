# Responsive Patterns Quick Reference Guide

## Common Responsive Patterns for LaunchAndLift

### 1. Responsive Grid Layouts

#### Card Grid (1/2/3/4 columns)
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
  {items.map(item => (
    <Card key={item.id}>{item.content}</Card>
  ))}
</div>
```

#### Stats Grid (2/4 columns)
```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {stats.map(stat => (
    <StatCard key={stat.id} {...stat} />
  ))}
</div>
```

### 2. Responsive Typography

#### Hero Title
```jsx
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
  Title
</h1>
```

#### Using clamp() for fluid typography
```css
.hero-title {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

#### Responsive Text Sizes
```jsx
<p className="text-sm sm:text-base md:text-lg lg:text-xl">
  Content
</p>
```

### 3. Responsive Spacing

#### Padding
```jsx
<div className="px-4 sm:px-6 md:px-8 lg:px-12">
  Content
</div>
```

#### Margins
```jsx
<section className="py-8 md:py-12 lg:py-16">
  Content
</section>
```

#### Gaps
```jsx
<div className="flex flex-col sm:flex-row gap-4 md:gap-6 lg:gap-8">
  Items
</div>
```

### 4. Responsive Navigation

#### Mobile Menu with Drawer
```jsx
const [menuOpen, setMenuOpen] = useState(false);

return (
  <>
    {/* Desktop Navigation */}
    <nav className="hidden lg:flex items-center gap-6">
      {links.map(link => <NavLink key={link.to} {...link} />)}
    </nav>

    {/* Mobile Menu Button */}
    <button
      className="lg:hidden"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label="Toggle menu"
    >
      <MenuIcon />
    </button>

    {/* Mobile Drawer */}
    {menuOpen && (
      <div className="lg:hidden fixed inset-0 z-50 bg-white">
        <nav className="flex flex-col p-6">
          {links.map(link => <NavLink key={link.to} {...link} />)}
        </nav>
      </div>
    )}
  </>
);
```

### 5. Responsive Tables

#### Card-based Table (Mobile)
```jsx
{/* Desktop Table */}
<div className="hidden md:block overflow-x-auto">
  <table className="min-w-full">
    <thead>...</thead>
    <tbody>...</tbody>
  </table>
</div>

{/* Mobile Cards */}
<div className="md:hidden space-y-4">
  {data.map(row => (
    <Card key={row.id} className="p-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold">{row.label}</span>
          <span>{row.value}</span>
        </div>
        {/* More fields */}
      </div>
    </Card>
  ))}
</div>
```

#### Scrollable Table
```jsx
<div className="overflow-x-auto -mx-4 px-4">
  <div className="min-w-[600px]">
    <table className="w-full">
      {/* Table content */}
    </table>
  </div>
</div>
```

### 6. Responsive Forms

#### Two-Column Form Layout
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
  <div>
    <Label>Field 1</Label>
    <Input />
  </div>
  <div>
    <Label>Field 2</Label>
    <Input />
  </div>
</div>
```

#### Form with Sidebar
```jsx
<div className="flex flex-col lg:flex-row gap-6">
  {/* Main Form */}
  <div className="flex-1">
    <form>...</form>
  </div>
  
  {/* Sidebar (hidden on mobile) */}
  <aside className="lg:w-64 lg:flex-shrink-0">
    <div className="hidden lg:block">Sidebar content</div>
  </aside>
</div>
```

### 7. Responsive Images

#### Responsive Image
```jsx
<img
  src={imageSrc}
  alt="Description"
  className="w-full h-auto"
  loading="lazy"
/>
```

#### Background Image
```jsx
<div
  className="bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `url(${imageSrc})`,
    minHeight: '400px'
  }}
>
  Content
</div>
```

### 8. Responsive Buttons

#### Button Sizes
```jsx
<button className="px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base">
  Button
</button>
```

#### Full-Width on Mobile
```jsx
<button className="w-full sm:w-auto">
  Button
</button>
```

#### Button Groups
```jsx
<div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
  <button>Button 1</button>
  <button>Button 2</button>
</div>
```

### 9. Responsive Sidebars

#### Collapsible Sidebar
```jsx
const [sidebarOpen, setSidebarOpen] = useState(false);

return (
  <div className="flex">
    {/* Mobile Sidebar Toggle */}
    <button
      className="lg:hidden"
      onClick={() => setSidebarOpen(!sidebarOpen)}
    >
      <MenuIcon />
    </button>

    {/* Sidebar */}
    <aside
      className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed lg:static
        inset-y-0 left-0
        w-64
        bg-white
        shadow-lg lg:shadow-none
        z-50
        transition-transform
      `}
    >
      Sidebar content
    </aside>

    {/* Main Content */}
    <main className="flex-1">
      Content
    </main>
  </div>
);
```

### 10. Responsive Modal/Dialog

#### Full-Screen on Mobile
```jsx
<div
  className={`
    fixed inset-0 z-50
    ${isOpen ? 'block' : 'hidden'}
    p-4 sm:p-6 md:p-8
  `}
>
  <div className="
    w-full h-full
    sm:max-w-lg sm:max-h-[90vh] sm:mx-auto
    bg-white rounded-lg
    overflow-auto
  ">
    Content
  </div>
</div>
```

### 11. Responsive Stats/Counters

#### Stats Panel
```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {stats.map(stat => (
    <div key={stat.id} className="text-center p-4 bg-white rounded-lg">
      <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
      <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
    </div>
  ))}
</div>
```

### 12. Responsive Hero Sections

#### Hero with Image
```jsx
<div className="flex flex-col lg:flex-row items-center gap-8">
  <div className="flex-1 order-2 lg:order-1">
    <h1 className="text-3xl md:text-4xl lg:text-5xl">Title</h1>
    <p className="text-base md:text-lg mt-4">Description</p>
  </div>
  <div className="flex-1 order-1 lg:order-2">
    <img src={heroImage} alt="Hero" className="w-full" />
  </div>
</div>
```

### 13. Responsive Tabs

#### Scrollable Tabs on Mobile
```jsx
<div className="overflow-x-auto">
  <div className="flex min-w-max sm:min-w-0 gap-2 sm:gap-4">
    {tabs.map(tab => (
      <button
        key={tab.id}
        className="flex-shrink-0 px-4 py-2 whitespace-nowrap"
      >
        {tab.label}
      </button>
    ))}
  </div>
</div>
```

### 14. Responsive Cards

#### Card Component
```jsx
<Card className="
  w-full
  p-4 sm:p-6 md:p-8
  shadow-sm hover:shadow-md
  transition-shadow
">
  <CardHeader className="pb-4">
    <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
  </CardHeader>
  <CardContent className="text-sm md:text-base">
    {content}
  </CardContent>
</Card>
```

### 15. Responsive Containers

#### Container with Max Width
```jsx
<div className="
  w-full
  mx-auto
  px-4 sm:px-6 md:px-8 lg:px-12
  max-w-7xl
">
  Content
</div>
```

## Utility Classes Reference

### Display
- `hidden md:block` - Hide on mobile, show on desktop
- `block md:hidden` - Show on mobile, hide on desktop
- `flex flex-col md:flex-row` - Stack on mobile, row on desktop

### Spacing
- `p-4 md:p-6 lg:p-8` - Responsive padding
- `gap-4 md:gap-6 lg:gap-8` - Responsive gaps
- `space-y-4 md:space-y-6` - Responsive vertical spacing

### Typography
- `text-sm md:text-base lg:text-lg` - Responsive text sizes
- `text-2xl md:text-3xl lg:text-4xl` - Responsive headings

### Layout
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` - Responsive grids
- `w-full md:w-1/2 lg:w-1/3` - Responsive widths
- `flex-col md:flex-row` - Responsive flex direction

## Best Practices

1. **Mobile-First Approach**: Start with mobile styles, then add larger breakpoints
2. **Touch Targets**: Minimum 44x44px for touch elements
3. **Readable Text**: Minimum 16px font size on mobile
4. **Adequate Spacing**: Use consistent spacing scale
5. **Performance**: Optimize images and animations for mobile
6. **Testing**: Test on real devices, not just browser dev tools
7. **Progressive Enhancement**: Ensure core functionality works on all devices
8. **Accessibility**: Maintain accessibility standards across all breakpoints

## Common Issues to Avoid

1. ❌ Fixed widths that don't scale
2. ❌ Horizontal scrolling (except for tables with overflow-x-auto)
3. ❌ Text too small to read on mobile
4. ❌ Buttons/links too close together
5. ❌ Forms that are hard to fill on mobile
6. ❌ Images that don't scale properly
7. ❌ Navigation that's hard to use on mobile
8. ❌ Modals that don't work well on mobile
9. ❌ Tables that overflow on mobile
10. ❌ Animations that are too heavy for mobile

## Testing Checklist

- [ ] Test on iPhone SE (375px)
- [ ] Test on iPhone 12/13/14 (390px)
- [ ] Test on iPad (768px)
- [ ] Test on Desktop (1280px+)
- [ ] Check for horizontal scrolling
- [ ] Verify touch targets are large enough
- [ ] Test forms on mobile
- [ ] Test navigation on mobile
- [ ] Verify images load and scale properly
- [ ] Check performance on mobile
- [ ] Test with different orientations (portrait/landscape)

