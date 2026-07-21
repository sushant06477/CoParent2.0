# CoParents.in — Patna Education Ecosystem Portal

[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple?logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey?logo=express)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, multi-role portal for searching, listing, and managing educational and residential services across **Patna, Bihar**. Designed to connect students, parents, coaching institutes, hostels, libraries, student PGs/flats, and career counselors through a centralized moderation system.

---

## 🌟 Key Features

- **Multi-Role Access Control (RBAC)**: Dedicated dashboards and controls for Super Admin, Co Admin, Department Managers (Coaching, Hostel, Library, PG/Flat, Counseling), and Student/Parent users.
- **Multi-Stage Moderation & Approval Queue**: Partner listing submissions, edits, or deletion requests enter a `Pending Approval` state requiring Super Admin authorization before going live.
- **Student Lead Privacy Guards**: All student enquiries and registrations are held privately in the Super Admin Ledger by default and can only be accessed by partner institutions when assigned by Super Admin.
- **Fail-Safe Tri-Mode Database Engine**: Operates seamlessly with Supabase REST API, PostgreSQL connection pooling (`pg`), or high-fidelity in-memory fallback mode.
- **Real-Time CMS & Content Management**: Super Admin controls for hero carousel slides, website stats, testimonials, news bulletins, and FAQs.
- **Built-in Audit Trail**: Operation logs tracking user logins, listing modifications, lead assignments, and administrative approvals.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Visuals**: [Lucide React](https://lucide.dev/), [Motion](https://motion.dev/), [Recharts](https://recharts.org/)

### Backend & Database
- **Server**: [Express 4](https://expressjs.com/) on Node.js
- **Database**: PostgreSQL (via Supabase / `pg` pool) with automated in-memory state fallback
- **Bundler**: `esbuild` CJS compilation (`dist/server.cjs`)

---

## 📁 Repository Structure

```
CoParents/
├── assets/                     # Public static media & generated images
├── memory/                     # AI Agent Central Memory Index & Module Specs
│   ├── ARCHITECTURE.md         # Express server & dual-mode DB engine design
│   ├── CHANGELOG_MEMORY.md     # Chronological log of modifications & features
│   ├── COMPONENTS.md           # UI component hierarchy & dashboard specs
│   ├── DATABASE_SCHEMA.md      # PostgreSQL DDL tables & TypeScript models
│   ├── PROJECT_OVERVIEW.md     # System vision & operational rules
│   └── RULES.md                # Codebase conventions & memory protocols
├── src/
│   ├── components/             # React UI components & role dashboards
│   │   ├── DepartmentDashboard.tsx   # Partner management hub
│      ├── EnquiryForm.tsx           # Student registration & enquiry form
│      ├── Header.tsx                # Dynamic navigation & action bar
│      ├── HeroCarousel.tsx          # Interactive hero carousel
│      ├── SuperAdminDashboard.tsx   # Admin ledger, approvals & user management
│      └── ...
│   ├── db/
│   │   ├── seed-data.ts        # Initial seed dataset
│   │   └── supabase.ts         # Tri-mode database layer & REST client
│   ├── App.tsx                 # View state routing & page orchestration
│   ├── main.tsx                # React root entry point
│   └── types.ts                # TypeScript data interfaces
├── supabase/
│   └── migrations/             # PostgreSQL DDL schema migration scripts
├── server.ts                   # Express API server & static file host
├── .env.example                # Environment variables template
├── package.json                # Project dependencies & scripts
└── vite.config.ts              # Vite development configuration
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/sushant06477/CoParent2.0.git
cd CoParent2.0
npm install
```

### 2. Environment Configuration

Copy the example environment file to `.env`:

```bash
cp .env.example .env
```

Set your configuration variables in `.env`:

```env
APP_URL="http://localhost:3000"
PORT=3000

# Optional: Supabase Database Credentials (if connecting to remote PostgreSQL)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
SUPABASE_DB_URL="postgresql://postgres:password@db.your-project.supabase.co:5432/postgres"
```

> **Note**: If Supabase environment variables are omitted, the application automatically runs in **High-Fidelity In-Memory Mode**, using `src/db/seed-data.ts`.

### 3. Run Development Server

Start the development server with hot module reloading:

```bash
npm run dev
```

The app will be accessible at `http://localhost:3000`.

### 4. Build for Production

Build the production bundle and CJS server:

```bash
npm run build
npm run start
```

---

## 🔐 Default Demo Accounts

| Role | Username | Default Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `admin123` | System management, audit logs, CMS config, user & approval management |
| **Co Admin** | `coadmin` | `coadmin123` | Operational oversight and moderation |
| **Coaching Dept** | `coaching` | `coaching123` | Coaching institute listing & lead management |
| **Hostel Dept** | `hostel` | `hostel123` | Boys/Girls hostel listing & room vacancy management |
| **Library Dept** | `library` | `library123` | Silent library listing management |
| **Flat/PG Dept** | `flat` | `flat123` | Student PG & flat rental management |
| **Counseling Dept** | `counsel` | `counsel123` | Career guidance & counseling hub management |

---

## 📡 Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | User login authentication |
| `GET` | `/api/services` | Retrieve public approved listings |
| `POST` | `/api/services` | Submit a new service listing (requires approval for partners) |
| `PUT` | `/api/services/:id` | Update service listing details |
| `GET` | `/api/enquiries` | Fetch student lead enquiries |
| `POST` | `/api/enquiries` | Register new student enquiry & user account |
| `PUT` | `/api/enquiries/:id` | Update enquiry status or assign lead to partner |
| `GET` | `/api/approvals` | Fetch pending listing approvals |
| `POST` | `/api/approvals/:id/approve` | Authorize and publish pending listing |
| `POST` | `/api/approvals/:id/reject` | Reject pending listing request |
| `GET` | `/api/cms` | Retrieve portal CMS configuration |
| `PUT` | `/api/cms` | Update homepage CMS text & stats |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
