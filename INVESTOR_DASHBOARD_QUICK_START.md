# Investor Dashboard - Quick Start Guide

## Access the Dashboard

### Development
1. Start the frontend: `cd frontend && npm run dev`
2. Navigate to: `http://localhost:5173/login`
3. Login with investor credentials or create new investor account
4. You'll be redirected to: `/dashboard/investor`

### User Flow
```
Login → Auth Check → Redirect to /dashboard/investor
```

## Dashboard Structure

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  STATS CARDS (4 cards: All | Interested | Portfolio | $$$) │
├─────────────┬───────────────────────────────────────────────┤
│  FILTERS    │  TABS: All | Interested | Portfolio          │
│  ========   │  ════════════════════════════════════════════ │
│             │                                                │
│  Stage      │  [Startup Cards]                              │
│  Sector     │                                                │
│  Geography  │  • Match Score Badge                          │
│             │  • Status Badges (Interested/Portfolio)       │
│             │  • Investment Details (if portfolio)          │
│             │  • Smart Action Button                        │
│             │                                                │
└─────────────┴───────────────────────────────────────────────┘
```

## Key Components

### 1. Stats Dashboard (Top)
- **All Startups**: Count of approved startups (blue gradient)
- **Interested**: Count of intros requested (pink gradient)
- **Portfolio**: Count of investments (purple gradient)
- **Total Invested**: Sum of investments (green gradient)

### 2. Filter Sidebar (Left)
- **Stage**: All, Seed, Series A, etc.
- **Sector**: All, AI Infrastructure, Climate Tech, etc.
- **Geography**: All, San Francisco, Austin, etc.
- Active filters shown with gradient background

### 3. Tabbed Content (Right)
#### Tab 1: All Startups
- Shows all approved startups
- Filtered by sidebar selections
- Button: "Request Intro"
- After clicking: Badge shows "Interested" + button changes to "Intro Requested"

#### Tab 2: Interested
- Shows startups where intro was requested
- Auto-populated when "Request Intro" clicked
- Same filtering as marketplace
- Empty state: "Browse the marketplace..."

#### Tab 3: Portfolio
- Shows invested startups
- Portfolio summary stats at top
- Shows investment amount and date
- Button disabled: "In Your Portfolio"

## Data Flow

### Adding Interest
```javascript
// User clicks "Request Intro"
handleRequestIntro(founder) → 
  addInvestorInterest(founderId) → 
    state.investorInterests.push(founderId)
```

### Checking Status
```javascript
// Is this startup interesting?
investorInterests.includes(founderId) → true/false

// Is this in portfolio?
investorPortfolio.some(inv => inv.founderId === founderId) → true/false
```

### Portfolio Entry
```javascript
{
  founderId: 'founder-1',
  amountInvested: 500000,
  investedAt: '2024-08-09T12:00:00.000Z'
}
```

## Testing Scenarios

### Scenario 1: Browse Marketplace
1. Navigate to "All Startups" tab (default)
2. See 1 approved startup (OrbitStack)
3. Apply filters to test filtering
4. Check match score badge

### Scenario 2: Show Interest
1. On "All Startups" tab
2. Click "Request Intro" on a startup
3. Button changes to "Intro Requested" (pink)
4. Badge appears: "Interested"
5. Navigate to "Interested" tab
6. Startup now appears there

### Scenario 3: View Portfolio
1. Navigate to "Portfolio" tab
2. See portfolio summary (1 company, $500K invested)
3. See OrbitStack with investment details
4. Button is disabled: "In Your Portfolio"
5. Green "Portfolio" badge visible

### Scenario 4: Cross-Tab Filtering
1. Set filter: Stage = "Seed"
2. Switch between tabs
3. Filters persist across all tabs
4. Counts update in tab badges

## Button States

### Visual States
| State | Color | Icon | Text | Disabled |
|-------|-------|------|------|----------|
| Default | Default | None | "Request Intro" | No |
| Interested | Pink | Heart | "Intro Requested" | No |
| Portfolio | Green | Check | "In Your Portfolio" | Yes |

### Logic
```javascript
if (isInPortfolio) {
  // Green, disabled, checkmark
} else if (isInterested) {
  // Pink, enabled, heart
} else {
  // Default, enabled
}
```

## Mock Data

### Current Portfolio (Pre-loaded)
- **OrbitStack** (founder-1)
  - Amount: $500,000
  - Date: 90 days ago
  - Status: Portfolio company

### Adding More Portfolio Items (for testing)
```javascript
// In useAppStore.js, add to investorPortfolio array:
{
  founderId: 'founder-2',
  amountInvested: 300000,
  investedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
}
```

## Styling Notes

### Color Palette
- **Marketplace**: Blue (#3B82F6) → Cyan (#06B6D4)
- **Interested**: Pink (#EC4899) → Rose (#F43F5E)
- **Portfolio**: Purple (#8B5CF6) → Indigo (#6366F1)
- **Success**: Green (#10B981) → Emerald (#059669)

### Glassmorphism
- Background: `bg-white/5` with `backdrop-blur`
- Borders: `border-white/10`
- Hover: `hover:bg-white/10`

### Animations
- Stats cards: Fade in from top
- Sidebar: Slide in from left
- Content: Fade in from bottom
- Tab transitions: Built into Radix UI

## Responsive Breakpoints

### Mobile (< 640px)
- Stats: Stack vertically (1 column)
- Filters: Hidden or collapsible
- Tabs: Condensed labels ("All", "Saved", "Mine")

### Tablet (640px - 1024px)
- Stats: 2 columns
- Filters: Collapsible sidebar
- Tabs: Full labels visible

### Desktop (> 1024px)
- Stats: 4 columns
- Filters: Always visible sidebar
- Tabs: Full labels + counts
- Two-column layout (filters | content)

## Common Issues & Solutions

### Issue: Stats showing 0
**Solution**: Check if `founders` array has approved startups
```javascript
approvedFounders = founders.filter(f => f.status === 'approved')
```

### Issue: Interested tab empty after clicking intro
**Solution**: Verify `addInvestorInterest` is being called
```javascript
console.log('Interests:', investorInterests)
```

### Issue: Portfolio not showing investment amount
**Solution**: Check `investmentAmount` prop is passed to StartupCard
```javascript
investmentAmount={investment?.amountInvested}
```

### Issue: Filters not working
**Solution**: Ensure filters apply to all tab contents
```javascript
// Each tab should use filteredFounders, interestedFounders, etc.
const interestedFounders = approvedFounders.filter(founder =>
  investorInterests.includes(founder.id)
)
```

## Next Steps for Production

### Backend Integration
1. Create API endpoints:
   - `POST /api/investor/interests` - Add interest
   - `GET /api/investor/interests` - Get interests
   - `GET /api/investor/portfolio` - Get investments
   
2. Replace mock data with API calls

3. Add authentication checks

4. Persist state to database

### Features to Add
1. **Notifications**: Alert when interested startup updates profile
2. **Comparison**: Side-by-side startup comparison
3. **Export**: Export portfolio to PDF/Excel
4. **Messages**: Direct messaging with founders
5. **Calendar**: Schedule calls/meetings

## File References

### Modified Files
- `frontend/src/pages/InvestorDashboard.jsx` - Main dashboard component
- `frontend/src/components/StartupCard.jsx` - Enhanced card component
- `frontend/src/store/useAppStore.js` - State management

### Related Files
- `frontend/src/components/ui/tabs.jsx` - Tab component
- `frontend/src/components/MatchScoreBadge.jsx` - Match score display
- `frontend/src/lib/formatters.js` - Currency formatting

## Support
For questions or issues with the dashboard:
1. Check console for errors
2. Verify mock data in `useAppStore.js`
3. Check component props in StartupCard
4. Review filter logic in InvestorDashboard

