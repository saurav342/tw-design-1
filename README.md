# LaunchAndLift Platform

LaunchAndLift is a full-stack venture platform inspired by lvxventures.com. It pairs a rich React single-page application with a secure Node.js/Express API to serve investors, founders, and administrators.

## Brand & Color Palette

All UI surfaces use the LaunchAndLift palette:

- `#AF3800` (burnt) – primary brand color
- `#FE621D` (sunset) – warm highlight & gradients
- `#FD5200` (blaze) – primary CTA background
- `#00CFC1` (lagoon) – secondary accents
- `#00FFE7` (neon) – highlight/interaction accents

Typography: Poppins (headings) & Inter (body copy).

## Monorepo Structure

```
frontend/   # React + Vite SPA styled with Tailwind CSS
backend/    # Express API with JWT auth and in-memory datastore
```

Key frontend directories:

- `src/pages` – Home, Investors, Founders, Portfolio, Resources, Auth flows, Dashboards
- `src/components` – Shared UI (Navbar, Footer, Carousels, Grids, etc.)
- `src/context/AuthContext.jsx` – Authentication state, localStorage persistence
- `src/services/api.js` – Fetch helpers targeting the backend API
- `src/data/content.js` – LaunchAndLift marketing copy and placeholder assets

Key backend directories:

- `src/controllers` – Route handlers for auth, content, portfolio, admin
- `src/models` – In-memory data access layer, password reset tokens
- `src/routes` – Express routers for `/api/auth`, `/api/content`, `/api/portfolio`, `/api/admin`
- `src/middleware` – JWT authentication & role-based guards
- `src/utils/jwt.js` – Token helpers
- `src/data/store.js` – Seed data and admin bootstrapping

## Getting Started

### Prerequisites

- Node.js ≥ 20.19 or ≥ 22.12 (LTS recommended)
- npm ≥ 10

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The dev server defaults to `http://localhost:5173`. By default, the SPA targets `/api` on the same origin. Override this by adding `VITE_API_URL` (for example `https://your-production-host/api`) in a `.env` file. **When the app runs over HTTPS, the client automatically falls back to same-origin `/api` if a plain `http://` API URL is supplied, so configure your hosting to proxy `/api` to the backend (or expose the backend via HTTPS) to avoid mixed-content blocks.** During local development, Vite proxies `/api` requests to `VITE_PROXY_TARGET` (falling back to `http://localhost:5000`), so set that value if your backend runs on a different host.

For Netlify deployments, `netlify.toml` (repo root) sets the base directory to `frontend/`, rewrites `/api/*` requests to the EC2 backend, and enables SPA routing (`/* → /index.html`). Update the `to` value to match your environment before deploying.

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Environment variables (set in `backend/.env`):

```
PORT=5000
APP_URL=http://localhost:5173
JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES_IN=12h
```

The API boots with seed data and an administrator:

- Email: `admin@launchandlift.com`
- Password: `LaunchAndLiftAdmin!23`

Change the password immediately in production using the Admin Console or the password reset flow.

### Password Reset (Mock)

`POST /api/auth/reset-password` issues a token and logs a reset link to the server console. `POST /api/auth/reset-password/confirm` accepts the token + new password, updates the account, and returns fresh credentials.

## API Overview

| Endpoint | Method | Description | Auth |
| --- | --- | --- | --- |
| `/api/auth/signup` | POST | Register investor, founder, or admin | Public |
| `/api/auth/login` | POST | Login with role-aware authentication | Public |
| `/api/auth/profile` | GET/PUT | Retrieve & update own profile | JWT |
| `/api/auth/reset-password` | POST | Request mocked password reset email | Public |
| `/api/auth/reset-password/confirm` | POST | Complete password reset | Public |
| `/api/portfolio` | GET | List portfolio companies | Public |
| `/api/portfolio` | POST | Create portfolio entry | Admin |
| `/api/portfolio/:id` | PUT/DELETE | Update or remove entry | Admin |
| `/api/content/stats` | GET/PUT | Read or update home page metrics | Admin for PUT |
| `/api/content/testimonials` | GET/POST/DELETE | Manage testimonials | Admin for write |
| `/api/content/faqs` | GET/POST/DELETE | Manage FAQs with audience filters | Admin for write |
| `/api/content/team` | GET/PUT | Manage team members | Admin for PUT |
| `/api/content/news` | GET/PUT | Manage news highlights | Admin for PUT |
| `/api/admin/users` | GET/PATCH/DELETE | Manage user accounts & roles | Admin |
| `/api/admin/metrics` | GET | Platform-level metrics snapshot | Admin |

All protected routes expect `Authorization: Bearer <token>` headers issued by `/api/auth/login` or `/api/auth/signup`.

## Frontend Highlights

- Responsive SPA with React Router for Home, Investors, Founders, Portfolio, Resources, and role-based dashboards.
- Tailwind CSS custom theme encapsulating LaunchAndLift palette and typography.
- Auth flows with role selectors, signup/login modals, and protected routes for Investor (`/dashboard/investor`), Founder (`/dashboard/founder`), and Admin (`/dashboard/admin`).
- Rich marketing sections: hero, stats, video carousel, ecosystem overview, team, testimonials, news ticker, CTAs.
- Admin console wired to backend CRUD endpoints for stats, testimonials, FAQs, news, and user management.

## Development Notes

- The backend uses an in-memory JSON datastore (`src/data/store.js`). Swap with a database by replacing model implementations; controller contracts stay the same.
- Add real email delivery to password resets by integrating providers in `authController.requestPasswordReset`.
- Tailwind configuration lives in `frontend/tailwind.config.js`; theme colors match the palette exactly.
- Vite build warnings may appear with Node 22.5.x; upgrade to ≥ 22.12 for alignments with the Vite engine range.

## Scripts

Frontend:

- `npm run dev` – Start Vite dev server
- `npm run build` – Production build
- `npm run preview` – Preview built app
- `npm run lint` – ESLint via Vite config

Backend:

- `npm run dev` – Nodemon development server
- `npm start` – Launch API once

## Next Steps

1. Wire Mission Control dashboard to a persistent datastore (MongoDB/Postgres) replacing the in-memory seeds.
2. Add automated tests (Jest/Supertest) for authentication, admin workflows, and content CRUD.
3. Deploy frontend (Netlify/Vercel) and backend (Render/Heroku/Fly) with `APP_URL` and `JWT_SECRET` configured.
4. Integrate a real email service (Postmark/SendGrid) for password resets and onboarding sequences.

mmm
