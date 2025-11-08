# Investor Dashboard Redesign

## Overview
Complete redesign of the investor dashboard with a modern, tabbed interface focused on the three core investor needs:
1. **All Startups** - Browse the marketplace
2. **Interested** - Track startups you've shown interest in
3. **Portfolio** - Manage your investments

## Key Features

### 1. Header Stats Dashboard
Four key metrics displayed at the top:
- **All Startups**: Total approved startups in the marketplace
- **Interested**: Number of startups you've requested intros for
- **Portfolio**: Number of companies you've invested in
- **Total Invested**: Sum of all your investments

Each stat has a distinct gradient icon for visual hierarchy.

### 2. Three-Tab Interface

#### Tab 1: All Startups (Marketplace)
- Browse all approved startups on the platform
- Filter by Stage, Sector, and Geography
- View match scores for each startup
- Request introductions to founders
- Visual indicators for startups you're interested in or already invested in

#### Tab 2: Interested Startups
- View all startups you've requested introductions for
- Startups automatically added here when you click "Request Intro"
- Same filtering capabilities as the marketplace
- Empty state encourages browsing the marketplace

#### Tab 3: Portfolio
- View all your investments in one place
- Portfolio summary shows:
  - Total amount invested
  - Number of portfolio companies
  - Average investment per company
- Each card shows your specific investment amount and date
- Cards are marked with a green "Portfolio" badge
- Empty state for new investors

### 3. Enhanced Startup Cards
Startup cards now display contextual information:
- **Interest Badge**: Pink "Interested" badge when you've requested an intro
- **Portfolio Badge**: Green "Portfolio" badge for your investments
- **Investment Details**: Shows investment amount and date for portfolio companies
- **Smart Button States**:
  - Default: "Request Intro"
  - After requesting: "Intro Requested" (pink, with heart icon)
  - Portfolio: "In Your Portfolio" (green, disabled, with checkmark)

### 4. Persistent Filters
The filter sidebar works across all tabs:
- Stage filter (Seed, Series A, etc.)
- Sector filter (AI Infrastructure, Climate Tech, etc.)
- Geography filter (North America, Europe, etc.)
- Active filters highlighted with gradient styling

## Technical Implementation

### State Management Updates (`useAppStore.js`)
Added three new features:
1. **`investorInterests`**: Array of founder IDs the investor has shown interest in
2. **`investorPortfolio`**: Array of investment objects with:
   - `founderId`: ID of the startup
   - `amountInvested`: Investment amount in USD
   - `investedAt`: ISO timestamp of investment date
3. New actions:
   - `addInvestorInterest(founderId)`: Mark a startup as interesting
   - `removeInvestorInterest(founderId)`: Remove from interested list
   - `addToPortfolio(founderId, amountInvested)`: Add investment to portfolio

### Component Updates

#### `InvestorDashboard.jsx`
- Complete redesign with tabbed interface
- Stats dashboard at the top
- Three separate tab contents with different data filtering
- Contextual empty states for each tab

#### `StartupCard.jsx`
- New props: `isInterested`, `isInPortfolio`, `investmentAmount`, `investmentDate`
- Status badges (Interested/Portfolio)
- Investment details section for portfolio companies
- Smart button states with icons
- Date formatting utility

## Design Improvements

### Visual Hierarchy
1. **Stats Dashboard**: Gradient icon cards with hover effects
2. **Tab Navigation**: Clear active state with gradients and counts
3. **Content Areas**: Consistent card styling with glassmorphism
4. **Empty States**: Centered, icon-based with helpful messages

### User Experience
1. **Progressive Disclosure**: Information organized by relevance
2. **Visual Feedback**: Badges and button states show current status
3. **Filtering**: Consistent filters across all tabs
4. **Responsive Design**: Works on mobile (tabs condense, stats stack)

### Color Coding
- **Blue/Cyan**: All startups/marketplace
- **Pink/Rose**: Interest/saved items
- **Purple/Indigo**: Portfolio/investments
- **Green/Emerald**: Confirmed investments and success states

## Mock Data
Added sample portfolio data for testing:
- 1 portfolio company (OrbitStack) with $500K investment from 90 days ago
- Empty interests list (will populate as user interacts)

## Future Enhancements (Recommendations)

### Short-term
1. **Remove from Interested**: Add ability to remove startups from interested list
2. **Sort Options**: Sort by match score, date added, funding stage
3. **Search**: Text search for startup names
4. **Bulk Actions**: Select multiple startups to compare

### Medium-term
1. **Investment Pipeline**: Add stages (Interested → Due Diligence → Term Sheet → Closed)
2. **Notes**: Add private notes to startup cards
3. **Reminders**: Set follow-up reminders for interested startups
4. **Analytics**: Portfolio performance tracking and metrics

### Long-term
1. **Direct Messaging**: Chat with founders
2. **Document Repository**: Store and manage due diligence docs
3. **Portfolio Updates**: Receive updates from portfolio companies
4. **Co-investor Network**: See which other investors are interested in the same startups

## Testing Notes
To test the dashboard:
1. Navigate to `/dashboard/investor` (requires investor login)
2. The "All Startups" tab shows the marketplace
3. Click "Request Intro" to add a startup to "Interested"
4. The "Portfolio" tab shows mock investment in OrbitStack
5. Filters work across all tabs

## Accessibility
- Semantic HTML with proper heading hierarchy
- ARIA labels on interactive elements (via Radix UI)
- Keyboard navigation support
- Color-blind friendly status indicators (icons + text)
- Sufficient color contrast ratios

