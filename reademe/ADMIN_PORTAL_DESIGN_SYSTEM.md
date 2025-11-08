# Admin Portal - Design System Reference

## 🎨 Visual Design Language

### Color Palette

#### Primary Colors
```
Blue Spectrum (Users & Growth)
- Primary: #3B82F6 (blue-500)
- Light: #60A5FA (blue-400)
- Dark: #2563EB (blue-600)
- Background: rgba(59, 130, 246, 0.1)

Purple Spectrum (Intakes & Analytics)
- Primary: #A855F7 (purple-500)
- Light: #C084FC (purple-400)
- Dark: #9333EA (purple-600)
- Background: rgba(168, 85, 247, 0.1)

Indigo Spectrum (Services)
- Primary: #6366F1 (indigo-500)
- Light: #818CF8 (indigo-400)
- Dark: #4F46E5 (indigo-600)
- Background: rgba(99, 102, 241, 0.1)

Emerald Spectrum (Revenue & Success)
- Primary: #10B981 (emerald-500)
- Light: #34D399 (emerald-400)
- Dark: #059669 (emerald-600)
- Background: rgba(16, 185, 129, 0.1)
```

#### Status Colors
```
Success: #10B981 (emerald-500)
Warning: #F59E0B (amber-500)
Error: #EF4444 (rose-500)
Info: #3B82F6 (blue-500)
```

#### Urgency Levels
```
High Urgency: 
- Border: rgba(239, 68, 68, 0.4) (rose-500/40)
- Background: rgba(239, 68, 68, 0.15) (rose-500/15)
- Text: #FCA5A5 (rose-300)

Medium Urgency:
- Border: rgba(99, 102, 241, 0.4) (indigo-500/40)
- Background: rgba(99, 102, 241, 0.15) (indigo-500/15)
- Text: #A5B4FC (indigo-300)

Low Urgency:
- Border: rgba(16, 185, 129, 0.4) (emerald-500/40)
- Background: rgba(16, 185, 129, 0.15) (emerald-500/15)
- Text: #6EE7B7 (emerald-300)
```

#### Neutrals
```
White: #FFFFFF
Slate 50: #F8FAFC
Slate 100: #F1F5F9
Slate 200: #E2E8F0
Slate 300: #CBD5E1
Slate 400: #94A3B8
Slate 500: #64748B
Black: #000000
```

---

## 📐 Layout & Spacing

### Grid System
```css
Container: max-width: 1920px
Columns: 12-column grid
Gaps: 
  - Small: 1rem (16px)
  - Medium: 1.5rem (24px)
  - Large: 2rem (32px)
```

### Spacing Scale
```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
3xl: 4rem (64px)
```

### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large desktop */
```

---

## 🔤 Typography

### Font Family
```css
font-family: Inter, system-ui, -apple-system, sans-serif
```

### Type Scale
```
Heading 1: 2.25rem (36px), font-weight: 700
Heading 2: 1.875rem (30px), font-weight: 700
Heading 3: 1.5rem (24px), font-weight: 600
Heading 4: 1.25rem (20px), font-weight: 600
Body Large: 1rem (16px), font-weight: 400
Body: 0.875rem (14px), font-weight: 400
Small: 0.75rem (12px), font-weight: 400
Tiny: 0.625rem (10px), font-weight: 600, uppercase
```

### Line Heights
```
Tight: 1.25
Normal: 1.5
Relaxed: 1.75
Loose: 2
```

### Letter Spacing
```
Tight: -0.025em
Normal: 0
Wide: 0.025em
Wider: 0.05em
Widest: 0.28em (for uppercase labels)
```

---

## 🎯 Component Library

### Metric Cards

#### Structure
```jsx
<Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-[color]/10 via-black/40 to-black/60">
  {/* Blur overlay */}
  <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-[color]/20 blur-3xl" />
  
  <CardHeader className="relative pb-3">
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <Icon className="h-5 w-5 text-[color]-400" />
    </div>
  </CardHeader>
  
  <CardContent className="relative">
    <p className="text-4xl font-bold text-white">{value}</p>
    <div className="mt-3 flex items-center gap-2 text-xs">
      <TrendIcon />
      <span>{trend}</span>
    </div>
    <div className="mt-2 text-xs text-slate-300">
      {supporting text}
    </div>
  </CardContent>
</Card>
```

#### Variants
1. **User Metrics**: Blue gradient
2. **Intake Metrics**: Purple gradient
3. **Service Metrics**: Indigo gradient
4. **Revenue Metrics**: Emerald gradient

---

### Activity Timeline Item

```jsx
<div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all hover:bg-white/[0.05]">
  <div className="rounded-lg p-2 {color-based-class}">
    <Icon className="h-4 w-4" />
  </div>
  <div className="flex-1">
    <p className="text-sm text-slate-200">{description}</p>
    <p className="mt-1 text-xs text-slate-400">{timestamp}</p>
  </div>
  <Button variant="secondary" size="sm" className="h-7 w-7 p-0">
    <ChevronRight className="h-3 w-3" />
  </Button>
</div>
```

---

### Quick Action Button

```jsx
<Button className="w-full justify-start gap-3 bg-gradient-to-r from-[color1]/20 to-[color2]/20 hover:from-[color1]/30 hover:to-[color2]/30">
  <Icon className="h-4 w-4" />
  {label}
  {badge && (
    <span className="ml-auto rounded-full bg-[color]/20 px-2 py-0.5 text-xs text-[color]-300">
      {badgeCount}
    </span>
  )}
</Button>
```

**Variants**:
- Indigo → Purple: Founder reviews
- Emerald → Teal: Matchmaking
- Rose → Orange: Urgent services
- Blue → Cyan: User management

---

### Progress Bar

```jsx
<div>
  <div className="mb-2 flex items-center justify-between text-sm">
    <span className="text-slate-300">{category}</span>
    <span className="font-semibold text-white">{value}</span>
  </div>
  <div className="relative h-3 overflow-hidden rounded-full bg-white/5">
    <div
      className="h-full bg-gradient-to-r from-[color1] to-[color2] transition-all duration-500"
      style={{ width: `${percentage}%` }}
    />
  </div>
  <div className="mt-1 text-xs text-slate-400">
    {count} items • {percentage}%
  </div>
</div>
```

---

### Founder Status Badge

```jsx
// Pending
<span className="rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-200">
  Pending Review
</span>

// Approved
<span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
  Approved
</span>
```

---

### Match Score Badge

Uses the `MatchScoreBadge` component with color coding:
- 85-100%: Emerald (excellent match)
- 70-84%: Blue (good match)
- 50-69%: Amber (moderate match)
- Below 50%: Rose (weak match)

---

### Service Request Card

```jsx
<div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_60px_-55px_rgba(99,102,241,0.95)]">
  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
    <div>
      <p className="text-sm font-semibold text-white">{serviceType}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-400">
        {timestamp}
      </p>
    </div>
    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold {urgency-class}">
      {urgency}
    </span>
  </div>
  {note && (
    <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-200">
      {note}
    </p>
  )}
</div>
```

---

## 🎭 Animation Patterns

### Fade In with Slide Up
```jsx
<Motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {content}
</Motion.div>
```

### Fade In with Slide Right
```jsx
<Motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.2 }}
>
  {content}
</Motion.div>
```

### Stagger Children
```jsx
<Motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ staggerChildren: 0.1 }}
>
  {children.map((child) => (
    <Motion.div
      key={child.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {child}
    </Motion.div>
  ))}
</Motion.div>
```

### Loading Spinner
```jsx
<RefreshCw className="h-4 w-4 animate-spin" />
```

---

## 🔲 Border & Shadow Styles

### Borders
```css
Standard: border border-white/10
Hover: border-indigo-500/30
Active: border-indigo-500
```

### Shadows
```css
Card: shadow-xl
Metric Card: shadow-[0_30px_80px_-60px_rgba(99,102,241,0.75)]
Service Card: shadow-[0_20px_60px_-55px_rgba(99,102,241,0.95)]
Hover: hover:shadow-lg hover:shadow-indigo-500/10
```

### Blur Effects
```css
Backdrop: backdrop-blur-sm
Glow: blur-3xl
```

---

## 🎨 Gradient Patterns

### Card Backgrounds
```css
Blue Theme: bg-gradient-to-br from-blue-500/10 via-black/40 to-black/60
Purple Theme: bg-gradient-to-br from-purple-500/10 via-black/40 to-black/60
Indigo Theme: bg-gradient-to-br from-indigo-500/10 via-black/40 to-black/60
Emerald Theme: bg-gradient-to-br from-emerald-500/10 via-black/40 to-black/60
```

### Button Gradients
```css
Indigo-Purple: bg-gradient-to-r from-indigo-500 to-purple-500
Emerald-Teal: bg-gradient-to-r from-emerald-500 to-teal-500
Rose-Orange: bg-gradient-to-r from-rose-500 to-orange-500
Blue-Cyan: bg-gradient-to-r from-blue-500 to-cyan-500
```

### Progress Bars
```css
Primary: bg-gradient-to-r from-indigo-500 to-purple-500
Success: bg-gradient-to-r from-emerald-500 to-teal-500
Warning: bg-gradient-to-r from-amber-500 to-orange-500
```

---

## 📱 Responsive Patterns

### Card Grid
```jsx
// 4 columns on xl, 2 on md, 1 on mobile
<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
  {cards}
</div>
```

### Two Column Layout
```jsx
// 60/40 split on lg, stacked on mobile
<div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
  <div>{main}</div>
  <div>{sidebar}</div>
</div>
```

### Flexible Row
```jsx
// Row on md+, column on mobile
<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  {content}
</div>
```

---

## 🎯 Icon Usage

### Icon Library: Lucide React

#### Navigation Icons
- `BarChart3`: Overview/Analytics
- `Building2`: Founders/Companies
- `Target`: Matchmaking
- `Sparkles`: Services
- `Users`: User Management

#### Action Icons
- `CheckCircle2`: Approve/Success
- `MailPlus`: Send Email
- `RefreshCw`: Refresh
- `Download`: Export
- `Bell`: Notifications
- `Search`: Search
- `Filter`: Filter

#### Status Icons
- `AlertTriangle`: Warning/High Urgency
- `Clock`: Pending/Time
- `TrendingUp`: Growth/Increase
- `ArrowUp/ArrowDown`: Trends
- `Eye`: View
- `ChevronRight`: Navigate

#### Category Icons
- `DollarSign`: Revenue
- `ClipboardList`: Services/Requests
- `Activity`: Activity Feed
- `LineChart`: Analytics
- `PieChart`: Distribution

### Icon Sizing
```
Small: h-3 w-3 (12px)
Medium: h-4 w-4 (16px)
Large: h-5 w-5 (20px)
XLarge: h-6 w-6 (24px)
```

---

## 🔘 Button Styles

### Primary Button
```jsx
<Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
  <Icon className="h-4 w-4" />
  {label}
</Button>
```

### Secondary Button
```jsx
<Button variant="secondary" className="gap-2">
  <Icon className="h-4 w-4" />
  {label}
</Button>
```

### Icon-Only Button
```jsx
<Button variant="secondary" size="sm" className="h-7 w-7 p-0">
  <Icon className="h-3 w-3" />
</Button>
```

---

## 📊 Data Display Patterns

### Stat Display
```jsx
<div>
  <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
  <p className="text-4xl font-bold text-white">{value}</p>
  <p className="text-xs text-slate-300">{context}</p>
</div>
```

### Key-Value Pair
```jsx
<div className="flex items-center justify-between">
  <span className="text-slate-300">{key}</span>
  <span className="font-semibold text-white">{value}</span>
</div>
```

### Tag/Badge List
```jsx
<div className="flex flex-wrap gap-2 text-xs text-slate-400">
  {tags.map(tag => (
    <span key={tag} className="rounded-full border border-white/10 px-2 py-0.5">
      {tag}
    </span>
  ))}
</div>
```

---

## 🎨 Dark Theme Optimizations

### Background Layers
```
Base: bg-black or bg-slate-950
Elevated 1: bg-black/40
Elevated 2: bg-black/60
Elevated 3: bg-white/[0.02]
Elevated 4: bg-white/[0.06]
```

### Text Hierarchy
```
Primary: text-white (100% opacity)
Secondary: text-slate-200 (90% opacity)
Tertiary: text-slate-300 (80% opacity)
Muted: text-slate-400 (60% opacity)
```

### Overlay Strategy
- Semi-transparent white overlays on black
- Gradient overlays for depth
- Blur effects for glassmorphism

---

## ♿ Accessibility Standards

### WCAG 2.1 AA Compliance

#### Color Contrast
- Text on background: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: 3:1 ratio

#### Focus States
```css
focus:outline-none 
focus:ring-2 
focus:ring-indigo-500/20 
focus:border-indigo-500/50
```

#### Keyboard Navigation
- Tab order follows visual hierarchy
- All interactive elements keyboard accessible
- Skip links for main content

#### Screen Readers
- Semantic HTML elements
- ARIA labels where needed
- Alt text for icons (via aria-label)

---

## 📐 Layout Components

### Container
```jsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {content}
</div>
```

### Section Spacing
```jsx
<div className="space-y-8">
  {sections}
</div>
```

### Card Grid
```jsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {cards}
</div>
```

---

## 🎬 Micro-interactions

### Hover Effects
```css
/* Card hover */
hover:bg-white/[0.05]
hover:border-indigo-500/30
hover:shadow-lg

/* Button hover */
hover:scale-105
hover:shadow-xl

/* Icon hover */
hover:rotate-90
hover:text-indigo-300
```

### Transition Timing
```css
transition-all duration-200 /* Fast: Hover states */
transition-all duration-300 /* Medium: Slides */
transition-all duration-500 /* Slow: Progress bars */
```

---

## 🔍 Search & Filter UI

### Search Input
```jsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
  <input
    type="text"
    placeholder="Search..."
    className="w-full rounded-xl border border-white/10 bg-black/40 py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
  />
</div>
```

### Filter Button
```jsx
<Button variant="secondary" className="gap-2">
  <Filter className="h-4 w-4" />
  Filter
</Button>
```

---

## 📈 Chart Styling (Future)

### Recommended Library
- **Recharts** or **Chart.js** for data visualization
- Matches color palette
- Dark mode optimized
- Responsive by default

### Chart Colors
```javascript
const chartColors = [
  '#6366F1', // Indigo
  '#8B5CF6', // Purple  
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#EF4444', // Rose
];
```

---

## 🎯 Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: #6366F1;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
}
```

---

## 📚 Component Usage Examples

### Metric Card with Trend
```jsx
<Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-blue-500/10 via-black/40 to-black/60">
  <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-blue-500/20 blur-3xl" />
  <CardHeader className="relative pb-3">
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Total Users
      </p>
      <Users className="h-5 w-5 text-blue-400" />
    </div>
  </CardHeader>
  <CardContent className="relative">
    <p className="text-4xl font-bold text-white">1,234</p>
    <div className="mt-3 flex items-center gap-2 text-xs">
      <span className="flex items-center gap-1 text-emerald-400">
        <ArrowUp className="h-3 w-3" />
        +15%
      </span>
      <span className="text-slate-400">vs last month</span>
    </div>
  </CardContent>
</Card>
```

---

## 🎨 Design Philosophy Summary

### Core Principles

1. **Clarity Over Cleverness**
   - Information should be immediately understandable
   - No unnecessary decoration
   - Purpose-driven design

2. **Progressive Disclosure**
   - Show most important info first
   - Reveal details on interaction
   - Avoid cognitive overload

3. **Consistent Patterns**
   - Reuse components and styles
   - Predictable interactions
   - Unified visual language

4. **Purposeful Motion**
   - Animations guide attention
   - Transitions feel natural
   - Loading states provide feedback

5. **Accessible by Default**
   - High contrast
   - Keyboard navigable
   - Screen reader friendly

---

**Last Updated**: November 7, 2025  
**Design System Version**: 1.0.0  
**Maintained By**: Launch and Lift Design Team

