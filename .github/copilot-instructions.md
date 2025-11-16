# CRTV Shots - AI Coding Agent Instructions

## Architecture Overview

**CRTV Shots** is a React + Vite SPA with a PHP backend. The codebase handles:
- **Booking workflow**: Multi-step service selection, date/time booking, checkout
- **E-commerce**: Merchandise catalog with shopping cart
- **Admin dashboard**: Service management, availability scheduling, order management
- **Authentication**: Admin login with 2FA, session-based on backend

### Key Data Flows

1. **Booking**: User selects service → picks date/time → enters details → checkout via PHP backend
2. **Cart**: Context-based state (`CartContext.jsx`) → checkout → payment
3. **Admin**: Login → verify 2FA → access admin dashboard → manage services/bookings

### Service Boundaries

- **Frontend** (`/src`): React components, pages, contexts, styling
- **Backend** (`https://crtvshotss.atwebpages.com`): PHP scripts for auth, orders, products, availability
- **Static assets**: Images in `/public/Images/services/`

## Build & Development

```bash
npm run dev        # Start Vite dev server (https://localhost:5173 with mkcert)
npm run build      # Production build to dist/
npm run lint       # ESLint check
npm run preview    # Preview production build
```

**HTTPS by default** via `vite-plugin-mkcert` for cookie-based session handling with backend.

## Critical Patterns

### 1. Backend Integration
- **Fetch calls** hardcoded to `https://crtvshotss.atwebpages.com` (live server)
- **Credentials**: `credentials: "include"` for session cookies on admin auth
- **FormData**: Used for POST requests (see `Login.jsx`, `Checkout.jsx`)
- **Key endpoints**:
  - Admin: `/login.php`, `/verify_2fa.php`
  - Orders: `/orders/place_order.php`, `/orders_list.php`
  - Products: `/products/get_products.php`
  - Availability: `/save_availability.php`

### 2. State Management
- **UserContext**: Lightweight—stores `user`, `loading`, `error`; admin auth handled server-side via `$_SESSION`
- **CartContext**: Full cart logic (add/remove/quantity), exposes `useCart()` hook
- **No persistence**: Cart/user state not localStorage—cleared on page refresh

### 3. Component Structure
- **Pages** under `/src/pages`: Full-page components (HomePage, BookingPage, AdminDashboard, etc.)
- **Components** under `/src/components`: Reusable UI (Header, Footer, VideoModal, etc.)
- **CSS co-located**: Each page has matching `.css` file for scoped styling

### 4. Conditional Rendering
- **Header**: Hidden on `/admin` and `/login` routes (see `App.jsx`)
- **Admin auth**: No automatic fetch—each admin call checks `$_SESSION['is_admin']` server-side
- **2FA flow**: After login, redirect to `/Verify2FA`; email stored in `sessionStorage`

### 5. Routing Pattern (React Router v7)
- **Route structure**: All routes in `AppContent()` function in `App.jsx`
- **No error boundaries**: Add if implementing error handling
- **Dynamic routes**: `/product/:id` for product detail, no `useParams` example visible—ensure proper destructuring

## Development Workflows

### Adding a New Service
1. Add service object to `serviceCategories` and `services` array in `/src/pages/BookingPage.jsx`
2. Backend updates: POST to `/save_availability.php` 
3. Images: Place in `/public/Images/services/` and reference in `availableImages` array in `AdminDashboard.jsx`

### Admin Task Flow
1. User → `/login` → enter email/password → `/Verify2FA` → `/admin`
2. Dashboard fetches available dates: `GET /save_availability.php?action=list`
3. Manage services: POST updates to `/services_list.php`

### Cart Checkout
1. `CartContext` accumulates items via `addToCart()`
2. User navigates to `/checkout`
3. `Checkout.jsx` fetches user via `localhost/crtvsite/backend/users/get_user.php` (local dev) or live URL
4. POST order to `/orders/place_order.php`

## Key Files to Know

| File | Purpose |
|------|---------|
| `/src/App.jsx` | Router setup, context providers, conditional header render |
| `/src/context/CartContext.jsx` | Cart state & logic; provides `useCart()` hook |
| `/src/context/UserContext.jsx` | User state; admin auth via backend session |
| `/src/pages/BookingPage.jsx` | Multi-step booking UI (1920+ lines) |
| `/src/pages/AdminDashboard.jsx` | Service/availability/order management (1940+ lines) |
| `/src/components/Header.jsx` | Navigation, dynamic dark/light detection, cart icon |
| `tailwind.config.js` | Tailwind v4 config (minimal—Tailwind integrated via Vite plugin) |
| `vite.config.js` | React, Tailwind, mkcert plugins; HTTPS server |

## Styling & Tooling

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Icons**: `lucide-react`, `@heroicons/react`
- **Animations**: `framer-motion`
- **Carousel**: `swiper`
- **ESLint**: Flat config with React hooks & refresh rules

## Common Gotchas

1. **Hardcoded API URLs**: Before merging, verify dev vs. production endpoints (local `localhost/crtvsite/` vs. live `crtvshotss.atwebpages.com`)
2. **Session handling**: HTTPS + credentials required for backend cookies; http localhost in dev may fail
3. **Missing image files**: Booking/admin pages reference images in `/public/Images/services/`—ensure files exist
4. **No error boundaries**: Long pages like `BookingPage.jsx` have minimal error handling
5. **FormData for uploads**: POST requests use `new FormData()`; keep consistency across endpoints

## AI Agent Priorities

When making changes:
1. **Preserve cart/auth flows**: These are complex; test before/after in browser
2. **Coordinate frontend URLs**: Verify backend endpoints when touching API calls
3. **Test routing**: New routes need entries in `App.jsx` and conditional header logic
4. **Check FormData usage**: Ensure POST payloads match backend expectations
