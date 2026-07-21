# Architecture & Technical Design

> **File Path**: [`memory/ARCHITECTURE.md`](file:///d:/CoParents/memory/ARCHITECTURE.md)  
> **Main Index**: [`AGENTS.md`](file:///d:/CoParents/AGENTS.md)

---

## 🏗️ System Architecture Overview

The system is built as a single-repo Node.js TypeScript application leveraging Express for API routing and Vite for single-page React frontend bundling.

```
+-------------------------------------------------------+
|                   Browser / Client                    |
|             React 19 SPA (Maintained in src/)         |
+-------------------------------------------------------+
                           |
                     HTTP / REST API
                           v
+-------------------------------------------------------+
|             Node.js Express Server (server.ts)        |
|               Runs via `tsx server.ts`                |
+-------------------------------------------------------+
            /                               \
    (Connected)                       (Disconnected)
           v                                 v
+-----------------------+         +-----------------------+
| Supabase PostgreSQL   |         | In-Memory Fallback    |
| (pg Pool Connection)  |         | (seed-data.ts State)  |
+-----------------------+         +-----------------------+
```

---

## ⚡ Runtime Engine & Commands

- **Development Command**: `npm run dev`  
  Executes `tsx server.ts`. Server initializes `dotenv.config()` for `.env` and `.env.local`. In development mode, `server.ts` programmatically attaches Vite middleware via `createViteServer({ server: { middlewareMode: true }, appType: 'spa' })`.
- **Production Build**: `npm run build`  
  Executes `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`.
- **Production Start**: `npm run start`  
  Runs `node dist/server.cjs`, serving built static assets from `dist/` directory.

---

## 🗄️ Dual-Mode Database Resilience System

Maintained inside [`src/db/supabase.ts`](file:///d:/CoParents/src/db/supabase.ts):

1. **Supabase JS REST API Mode (Primary)**: Connects via `@supabase/supabase-js` `createClient(SUPABASE_URL, SUPABASE_ANON_KEY)` over HTTPS. Performs all CRUD operations via Supabase PostgREST endpoints.
2. **PostgreSQL TCP Mode (Secondary)**: Connects via `pg.Pool` using `SUPABASE_DB_URL` / `DATABASE_URL` (direct port 5432 or pooler port 6543). Enables SSL (`rejectUnauthorized: false`).
3. **In-Memory Fallback Mode**: Activated when neither Supabase credentials nor live database connection are available, utilizing seeded memory state from [`src/db/seed-data.ts`](file:///d:/CoParents/src/db/seed-data.ts).
3. **Status Check**: Available at `/api/db-status`.

---

## 🌐 Complete API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/db-status` | Returns operational database mode (fallback vs PostgreSQL). |
| `POST` | `/api/auth/login` | Validates credentials and writes audit log. |
| `POST` | `/api/auth/forgot-password` | Resets password by verifying registered mobile number. |
| `GET` | `/api/services` | Fetches listings (supports `?type=` and `?includePending=true`). |
| `GET` | `/api/services/:id` | Fetches detailed listing by ID. |
| `POST` | `/api/services` | Creates a new service listing (set to `Pending Approval`). |
| `PUT` | `/api/services/:id` | Updates service listing details or pending changes. |
| `DELETE` | `/api/services/:id` | Deletes a service listing. |
| `GET` | `/api/users` | List all system users. |
| `POST` | `/api/users` | Create user account. |
| `PUT` | `/api/users/:id` | Modify user profile / status. |
| `GET` | `/api/enquiries` | Fetch enquiries. |
| `POST` | `/api/enquiries` | Submit new student/parent enquiry. |
| `PUT` | `/api/enquiries/:id` | Update enquiry status / notes. |
| `GET` | `/api/carousel` | Fetch homepage carousel slides. |
| `POST` | `/api/carousel` | Add hero slide. |
| `PUT` | `/api/carousel/:id` | Edit hero slide. |
| `DELETE` | `/api/carousel/:id` | Remove hero slide. |
| `GET` | `/api/testimonials` | Fetch student/parent reviews. |
| `POST` | `/api/testimonials` | Submit review. |
| `PUT` | `/api/testimonials/:id` | Approve/reject review. |
| `GET` | `/api/news` | Fetch news & announcements. |
| `GET` | `/api/faqs` | Fetch FAQ items. |
| `GET` | `/api/whatsapp` | Fetch WhatsApp Floating widget configuration. |
| `GET` | `/api/social-links` | Fetch active social links. |
| `GET` | `/api/cms` | Fetch CMS homepage & contact settings. |
| `PUT` | `/api/cms` | Update CMS homepage/about settings. |
| `GET` | `/api/audit-logs` | Fetch system audit log entries. |
| `GET` | `/api/analytics` | Fetch operational metrics & distribution chart data. |
| `GET` | `/api/reports/export` | Export CSV/PDF standard reports for users, enquiries, listings. |
