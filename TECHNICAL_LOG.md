# LuLu Happiness × GameFaktory - Technical Log

## [2026-10-07] Initial Technical Foundation
- **Technology introduced**: React + Vite + Tailwind CSS v3.
- **Dependencies**: Added `react-router-dom` for navigation, `zustand` for state management, and `lucide-react` for icons.
- **Architecture changes**: Adopted a modular folder structure (`src/components`, `src/pages`, `src/store`).
- **Styling**: Configured Tailwind CSS with custom LuLu Happiness branding colors to ensure utility classes match the brand guidelines precisely.
- **Mobile-first approach**: Structured the root `App.jsx` to enforce a mobile-constrained viewport layout on larger screens to reflect the PWA/mobile-first nature of the campaign.

## [2026-10-07] Tailwind Version Fix
- **What was changed**: Pinned `tailwindcss` dependency strictly to `^3.4` instead of latest.
- **Why it was changed**: The default `npm install tailwindcss` pulled the new v4 major release which has a different PostCSS integration architecture, causing a build error. Reverted to v3 to stabilize the build.
