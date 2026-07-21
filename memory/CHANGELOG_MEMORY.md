# AI Agent Activity & Memory Changelog

> **File Path**: [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)  
> **Main Index**: [`AGENTS.md`](file:///d:/CoParents/AGENTS.md)

---

## 📜 Log of Changes

### [2026-07-21] Gitignore Security Audit & Sanitized .env.example
- **Agent**: Antigravity AI Assistant
- **Summary**: Conducted full codebase vulnerability audit prior to Git upload. Updated `.gitignore` with comprehensive patterns ignoring `.env*`, build bundles (`dist/`), `node_modules/`, editor/OS temp files, and runtime logs. Created sanitized `.env.example` template.
- **Modified Files**:
  - [`.gitignore`](file:///d:/CoParents/.gitignore)
  - [`.env.example`](file:///d:/CoParents/.env.example)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Super Admin Approval Action Buttons & Re-approval Loop
- **Agent**: Antigravity AI Assistant
- **Summary**: Enhanced `SuperAdminDashboard.tsx` with prominent 'Approve & Publish' buttons in Pending Approvals queue and 'Approve & Activate' buttons in Users & Departments table. Verified end-to-end partner lifecycle where approved Coaching users can log in, edit listing details, and re-submit changes for Super Admin re-approval.
- **Modified Files**:
  - [`src/components/SuperAdminDashboard.tsx`](file:///d:/CoParents/src/components/SuperAdminDashboard.tsx)
  - [`src/components/DepartmentDashboard.tsx`](file:///d:/CoParents/src/components/DepartmentDashboard.tsx)
  - [`dist/server.cjs`](file:///d:/CoParents/dist/server.cjs)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Partner Approval Workflow & Super Admin Student Lead Privacy
- **Agent**: Antigravity AI Assistant
- **Summary**: Implemented multi-stage partner approval workflow and student lead privacy guards. Coaching/Hostel partner registrations generate `Pending` user accounts and `Pending Approval` listings requiring Super Admin authorization before public display. Enquiries remain 100% private to Super Admin until explicitly assigned to a partner.
- **Modified Files**:
  - [`server.ts`](file:///d:/CoParents/server.ts)
  - [`src/components/DepartmentDashboard.tsx`](file:///d:/CoParents/src/components/DepartmentDashboard.tsx)
  - [`src/components/SuperAdminDashboard.tsx`](file:///d:/CoParents/src/components/SuperAdminDashboard.tsx)
  - [`dist/server.cjs`](file:///d:/CoParents/dist/server.cjs)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Database DDL Password Column Migration & Auto-Sync
- **Agent**: Antigravity AI Assistant
- **Summary**: Added `password TEXT` column to the `users` table schema in `supabase/migrations/20260721000000_init.sql` and `src/db/supabase.ts`. Added automatic DDL migration `ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;` in `initializeDatabase()`, and updated PostgreSQL `createUser` / `updateUser` queries.
- **Modified Files**:
  - [`src/db/supabase.ts`](file:///d:/CoParents/src/db/supabase.ts)
  - [`supabase/migrations/20260721000000_init.sql`](file:///d:/CoParents/supabase/migrations/20260721000000_init.sql)
  - [`memory/DATABASE_SCHEMA.md`](file:///d:/CoParents/memory/DATABASE_SCHEMA.md)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Registration Form Password, Confirm Password & Full Field Validation
- **Agent**: Antigravity AI Assistant
- **Summary**: Updated `EnquiryForm.tsx` to add `password` and `confirmPassword` fields with eye show/hide toggles, password strength indicator, and field-by-field validation rules (Full Name min 2 chars, 10-digit mobile, email format, password matching). Updated `server.ts` to auto-create user accounts upon registration and allow mobile/password login.
- **Modified Files**:
  - [`src/components/EnquiryForm.tsx`](file:///d:/CoParents/src/components/EnquiryForm.tsx)
  - [`src/types.ts`](file:///d:/CoParents/src/types.ts)
  - [`server.ts`](file:///d:/CoParents/server.ts)
  - [`dist/server.cjs`](file:///d:/CoParents/dist/server.cjs)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Dedicated Registration Page (/register) & Home CTA Section
- **Agent**: Antigravity AI Assistant
- **Summary**: Moved `EnquiryForm` off the Home page into a dedicated Registration Page at route `/register` (`activeTab === 'register'`). Replaced the Home page form with a high-impact Registration CTA banner featuring a 'Proceed to Registration' button. Added 'Register' tab and button to `Header.tsx` navigation.
- **Modified Files**:
  - [`src/App.tsx`](file:///d:/CoParents/src/App.tsx)
  - [`src/components/Header.tsx`](file:///d:/CoParents/src/components/Header.tsx)
  - [`dist/server.cjs`](file:///d:/CoParents/dist/server.cjs)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Edit Slide & Service Form Smooth Auto-Scroll Fix
- **Agent**: Antigravity AI Assistant
- **Summary**: Fixed issue where clicking 'Edit Slide' or 'Edit Listing' activated the form overlay above the viewport without bringing it into focus. Implemented `useRef` auto-scroll and emerald glow border indicators on `SuperAdminDashboard.tsx`.
- **Modified Files**:
  - [`src/components/SuperAdminDashboard.tsx`](file:///d:/CoParents/src/components/SuperAdminDashboard.tsx)
  - [`dist/server.cjs`](file:///d:/CoParents/dist/server.cjs)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Admin Carousel Form Live Image Preview & Asset Shortcuts
- **Agent**: Antigravity AI Assistant
- **Summary**: Added real-time Live Image Preview box, preset asset selector buttons (`Use Campus Asset` / `Use Hostel Asset`), and image fallback handling to the Carousel Slide creation form in `SuperAdminDashboard.tsx`.
- **Modified Files**:
  - [`src/components/SuperAdminDashboard.tsx`](file:///d:/CoParents/src/components/SuperAdminDashboard.tsx)
  - [`dist/server.cjs`](file:///d:/CoParents/dist/server.cjs)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Hero Carousel Image Rendering & Asset Fallback Fix
- **Agent**: Antigravity AI Assistant
- **Summary**: Fixed hero carousel background image rendering in `HeroCarousel.tsx` by replacing CSS `background-image` with direct `<img>` tags, adding automatic image error fallbacks (`/assets/hero_education_campus.jpg` and `/assets/hero_student_hostel.jpg`), and adjusting text overlay gradient for high contrast visibility.
- **Modified Files**:
  - [`src/components/HeroCarousel.tsx`](file:///d:/CoParents/src/components/HeroCarousel.tsx)
  - [`src/db/seed-data.ts`](file:///d:/CoParents/src/db/seed-data.ts)
  - [`assets/hero_education_campus.jpg`](file:///d:/CoParents/assets/hero_education_campus.jpg)
  - [`assets/hero_student_hostel.jpg`](file:///d:/CoParents/assets/hero_student_hostel.jpg)
  - [`dist/server.cjs`](file:///d:/CoParents/dist/server.cjs)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Complete Database Form Wiring & RLS Fail-Safe Persistence Fix
- **Agent**: Antigravity AI Assistant
- **Summary**: Audited all database CRUD functions in `src/db/supabase.ts`. Refactored write operations (`createService`, `updateService`, `updateCMS`, `createCarouselSlide`, `updateWhatsApp`, `createUser`, `updateUser`, etc.) to ALWAYS update in-memory state and log Supabase REST/RLS errors. Prioritized `SUPABASE_SERVICE_ROLE_KEY` in `getSupabaseClient()` to bypass RLS policies on server-side admin writes.
- **Modified Files**:
  - [`src/db/supabase.ts`](file:///d:/CoParents/src/db/supabase.ts)
  - [`dist/server.cjs`](file:///d:/CoParents/dist/server.cjs)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Enhanced Users & Services Auto-Seed Fallback
- **Agent**: Antigravity AI Assistant
- **Summary**: Updated `getUsers()` and `getServices()` in `src/db/supabase.ts` to auto-seed initial data to Supabase if empty, and fall back to seeded memory arrays (`memUsers`, `memServices`) if the remote Supabase table has 0 rows or is missing, guaranteeing zero-downtime login with `admin` / `admin123`.
- **Modified Files**:
  - [`src/db/supabase.ts`](file:///d:/CoParents/src/db/supabase.ts)
  - [`dist/server.cjs`](file:///d:/CoParents/dist/server.cjs)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Production Bundle & Server Connection Logs Sync
- **Agent**: Antigravity AI Assistant
- **Summary**: Updated startup warning in `server.ts` to reference `SUPABASE_URL` and `SUPABASE_ANON_KEY` and re-built `dist/server.cjs` via `npm run build` so `npm run start` executes the updated Supabase REST client logic.
- **Modified Files**:
  - [`server.ts`](file:///d:/CoParents/server.ts)
  - [`dist/server.cjs`](file:///d:/CoParents/dist/server.cjs)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Architecture Refactored to Primary Supabase JS REST Client Mode
- **Agent**: Antigravity AI Assistant
- **Summary**: Installed `@supabase/supabase-js` and refactored `src/db/supabase.ts` to make HTTP REST API calls via `SUPABASE_URL` and `SUPABASE_ANON_KEY` (or `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`) the primary database engine.
- **Modified Files**:
  - [`package.json`](file:///d:/CoParents/package.json)
  - [`src/db/supabase.ts`](file:///d:/CoParents/src/db/supabase.ts)
  - [`.env`](file:///d:/CoParents/.env)
  - [`memory/ARCHITECTURE.md`](file:///d:/CoParents/memory/ARCHITECTURE.md)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Expanded SSL Match for Supabase Pooler Domains
- **Agent**: Antigravity AI Assistant
- **Summary**: Updated SSL check in `src/db/supabase.ts` `getPool()` to cover `supabase.com` connection pooler domains (`pooler.supabase.com`) in addition to `supabase.co`.
- **Modified Files**:
  - [`src/db/supabase.ts`](file:///d:/CoParents/src/db/supabase.ts)
  - [`memory/ARCHITECTURE.md`](file:///d:/CoParents/memory/ARCHITECTURE.md)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Added PostgreSQL Connection String Format Validation
- **Agent**: Antigravity AI Assistant
- **Summary**: Added format check in `src/db/supabase.ts` `testConnection()` to intercept HTTP/HTTPS URLs mistakenly passed into `SUPABASE_DB_URL` and display explicit instructions on using standard PostgreSQL connection URI (`postgresql://...`).
- **Modified Files**:
  - [`src/db/supabase.ts`](file:///d:/CoParents/src/db/supabase.ts)
  - [`memory/ARCHITECTURE.md`](file:///d:/CoParents/memory/ARCHITECTURE.md)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Added Dotenv Initialization in server.ts
- **Agent**: Antigravity AI Assistant
- **Summary**: Imported and initialized `dotenv.config()` at the top of `server.ts` so environment variables defined in `.env` and `.env.local` are automatically loaded into `process.env` when running `npm run dev` (`tsx server.ts`).
- **Modified Files**:
  - [`server.ts`](file:///d:/CoParents/server.ts)
  - [`memory/ARCHITECTURE.md`](file:///d:/CoParents/memory/ARCHITECTURE.md)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Supabase Anon Key & API Credentials Templates Added
- **Agent**: Antigravity AI Assistant
- **Summary**: Added template placeholders for `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY` to `.env`.
- **Modified Files**:
  - [`.env`](file:///d:/CoParents/.env)
  - [`memory/PROJECT_OVERVIEW.md`](file:///d:/CoParents/memory/PROJECT_OVERVIEW.md)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Environment Key Variables Initialization
- **Agent**: Antigravity AI Assistant
- **Summary**: Defined explicit, active environment variables (`GEMINI_API_KEY=""`, `APP_URL="http://localhost:3000"`, `PORT=3000`, `SUPABASE_DB_URL=""`) in `.env` so key variables are directly accessible and ready for configuration while defaulting seamlessly to in-memory fallback.
- **Modified Files**:
  - [`.env`](file:///d:/CoParents/.env)
  - [`memory/PROJECT_OVERVIEW.md`](file:///d:/CoParents/memory/PROJECT_OVERVIEW.md)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Environment Configuration Clean Up
- **Agent**: Antigravity AI Assistant
- **Summary**: Refactored `.env` configuration file to eliminate placeholder connection strings (`db.[REF].supabase.co`) that caused unnecessary 4-second database connection timeouts before falling back to in-memory mode. Configured explicit default `APP_URL` and `PORT`.
- **Modified Files**:
  - [`.env`](file:///d:/CoParents/.env)
  - [`memory/PROJECT_OVERVIEW.md`](file:///d:/CoParents/memory/PROJECT_OVERVIEW.md)
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md)

### [2026-07-21] Initial Creation of AI Agent Memory System
- **Agent**: Antigravity AI Assistant
- **Summary**: Analyzed project codebase (React 19, Express server, Supabase PostgreSQL, dual-mode database engine, multi-role dashboard system). Initialized comprehensive AI Agent memory architecture.
- **Created Files**:
  - [`AGENTS.md`](file:///d:/CoParents/AGENTS.md): Root memory hub and persistence rule.
  - [`MEMORY.md`](file:///d:/CoParents/MEMORY.md): Quick reference entry point.
  - [`memory/PROJECT_OVERVIEW.md`](file:///d:/CoParents/memory/PROJECT_OVERVIEW.md): App capabilities, Patna education portal scope, credentials, env vars.
  - [`memory/ARCHITECTURE.md`](file:///d:/CoParents/memory/ARCHITECTURE.md): Server routes, dev/prod builds, dual-mode DB engine.
  - [`memory/DATABASE_SCHEMA.md`](file:///d:/CoParents/memory/DATABASE_SCHEMA.md): PostgreSQL tables, types, migration mapping.
  - [`memory/COMPONENTS.md`](file:///d:/CoParents/memory/COMPONENTS.md): UI component breakdown and dashboard role hierarchy.
  - [`memory/RULES.md`](file:///d:/CoParents/memory/RULES.md): Coding conventions and mandatory memory updating workflow.
  - [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md): Living log of AI agent modifications.
