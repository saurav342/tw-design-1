# Authentication & Signup Flow Reference

## System Overview

LaunchAndLift has **two different signup flows** for different user types:

### 1. Investor Signup (Direct Account Creation)
**Path:** `/signup/investor`  
**Backend:** Uses `/api/auth/signup` endpoint  
**Flow:** Immediate account creation → Dashboard access

#### Frontend → Backend Data Mapping

| Frontend Field | Backend Field | Required |
|---------------|---------------|----------|
| `fullName` | `fullName` | ✅ |
| `email` | `email` | ✅ |
| `password` | `password` | ✅ |
| `phone` | `investorDetails.phone` | ✅ |
| `linkedinUrl` | `investorDetails.linkedinUrl` | ✅ |
| `location` | `investorDetails.location` | ✅ |
| `notes` | `notes` | ❌ Optional |
| Fixed: `role: 'investor'` | `role` | ✅ |

#### Backend Response
```json
{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": "uuid",
    "fullName": "Investor Name",
    "email": "investor@example.com",
    "role": "investor",
    "investorDetails": {
      "phone": "+1234567890",
      "linkedinUrl": "https://linkedin.com/in/...",
      "location": "San Francisco, CA"
    },
    "createdAt": "ISO_DATE",
    "updatedAt": "ISO_DATE"
  }
}
```

#### Success Flow
1. User fills out investor signup form
2. Frontend calls `signup()` from `useAuth` hook
3. Backend creates user account with `role: 'investor'`
4. Backend returns JWT token + user object
5. Frontend stores token in localStorage
6. Frontend updates auth context state
7. User redirected to `/dashboard/investor`

---

### 2. Founder Signup (Intake/Application System)
**Path:** `/signup/founder`  
**Backend:** Uses `/api/intakes/founders` endpoint  
**Flow:** Application submission → Review by admin → Account activation

#### Frontend → Backend Data Mapping

| Frontend Field | Backend Field | Required |
|---------------|---------------|----------|
| `founderFullName` | `fullName` | ✅ |
| `email` | `email` | ✅ |
| `phoneNumber` | `phoneNumber` | ❌ |
| `linkedInUrl` | `linkedInUrl` | ❌ |
| `numberOfFounders` | `numberOfFounders` | ✅ |
| `secondFounder.*` | `secondFounder` | ❌ Conditional |
| `companyLegalName` | `companyLegalName` | ✅ |
| `brandName` | `brandName` | ✅ |
| `companyWebsite` | `companyWebsite` | ✅ |
| `companyFoundingDate` | `companyFoundingDate` | ❌ |
| `sector` | `sector` | ✅ |
| `currentStage` | `currentStage` / `raiseStage` | ✅ |
| `brief` | `brief` / `tractionSummary` | ✅ |
| `pitchDeck` | `pitchDeck` | ❌ |

#### Success Flow
1. User fills out founder intake form
2. Frontend calls `addFounder()` from `useAppStore`
3. Backend stores intake submission (NOT a user account)
4. Frontend creates **temporary/mock session** using `establishSession()`
5. User redirected to `/payment-details` page
6. **Admin reviews application later**
7. Admin can approve → Real account created

---

## Login Flow (All User Types)

**Path:** `/login`  
**Backend:** Uses `/api/auth/login` endpoint  
**Works for:** Investors, Founders (after approval), Admins

### Test Accounts

#### Demo Founder
```
Email: fe@fe.com
Password: 123
Role: Founder
```

#### Admin Account
```
Email: admin@launchandlift.com
Password: LaunchAndLiftAdmin!23
Role: Admin
```

### Login Request
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "founder" // or "investor" or "admin"
}
```

### Login Response
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "uuid",
    "fullName": "User Name",
    "email": "user@example.com",
    "role": "founder",
    "founderDetails": { ... } // or investorDetails / adminDetails
  }
}
```

---

## Protected Routes

All dashboard routes require authentication:

- `/dashboard/investor` → Role: `investor`
- `/dashboard/founder` → Role: `founder`  
- `/dashboard/founder/marketplace` → Role: `founder`
- `/dashboard/founder/success-fee` → Role: `founder`
- `/dashboard/founder/services` → Role: `founder`
- `/dashboard/admin` → Role: `admin`

### How Protection Works

1. `ProtectedRoute` component checks `user` from auth context
2. If no user → redirect to `/login`
3. If wrong role → redirect to `/`
4. If correct role → render component

---

## Recent Fixes (Nov 7, 2024)

### ✅ Fixed Issues
1. **Infinite render loop** in `useFounderExtras` hook
   - Removed `fetchFounderExtras` from dependency array
   
2. **Investor signup not syncing with backend**
   - Changed from direct `fetch()` to using `signup()` from `useAuth`
   - Now properly creates user account and manages auth state
   
3. **Login page UX improvements**
   - Modern split-screen design
   - Auto-fill demo credentials
   - Password visibility toggle
   - Loading and success states
   - Better error messages
   
4. **ProtectedRoute improvements**
   - Added loading state to prevent redirect flash
   - Better console logging for debugging

### 🎨 UI Modernization
- Redesigned `/login` page with 18 YOE UX principles
- Redesigned `/signup/investor` page to match login aesthetic
- Gradient backgrounds with glassmorphism
- Smooth animations and micro-interactions
- Clear visual feedback for all states

---

## API Endpoints Reference

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/auth/login` | POST | User login | ❌ |
| `/api/auth/signup` | POST | Investor signup (direct) | ❌ |
| `/api/auth/profile` | GET | Get user profile | ✅ Token |
| `/api/intakes/founders` | POST | Founder application | ❌ |
| `/api/intakes/founders` | GET | List founder intakes | ✅ Admin |
| `/api/founder-extras/:id` | GET | Get founder extras | ✅ Token |

---

## Environment Configuration

### Frontend `.env`
```
VITE_API_URL=http://localhost:3000/api
```

### Backend Port
```
PORT=3000 (default)
```

---

## Quick Start Commands

### Start Backend
```bash
cd backend
npm install
npm run dev
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### Test Login
```bash
# Navigate to: http://localhost:5173/login
# Use demo credentials: fe@fe.com / 123
```

### Test Investor Signup
```bash
# Navigate to: http://localhost:5173/signup/investor
# Fill form and create account
```

---

## Troubleshooting

### "Maximum update depth exceeded"
- **Fixed** ✅ Removed unstable function from useEffect dependencies

### "Network request failed" during signup/login
- Check backend is running on port 3000
- Check `.env` file has `VITE_API_URL=http://localhost:3000/api`
- Restart frontend dev server after changing `.env`

### Login works but redirect fails
- Check browser console for ProtectedRoute logs
- Verify user role matches route requirement
- Check auth context state is properly set

---

## File Reference

### Key Frontend Files
- `frontend/src/pages/Login.jsx` - Login page (redesigned)
- `frontend/src/pages/InvestorSignup.jsx` - Investor signup (redesigned)
- `frontend/src/pages/FounderSignup.jsx` - Founder intake form
- `frontend/src/context/AuthContext.jsx` - Auth state management
- `frontend/src/components/ProtectedRoute.jsx` - Route protection
- `frontend/src/hooks/useFounderExtras.js` - Founder data hook (fixed)
- `frontend/src/services/api.js` - API client

### Key Backend Files
- `backend/src/controllers/authController.js` - Auth logic
- `backend/src/models/userModel.js` - User CRUD operations
- `backend/src/data/store.js` - In-memory data store with test accounts
- `backend/src/routes/authRoutes.js` - Auth endpoints

---

**Last Updated:** November 7, 2025  
**Status:** ✅ All systems synced and operational

