# AI Agent Central Memory Index (AGENTS.md)

> [!IMPORTANT]
> **MANDATORY PERSISTENCE RULE FOR ALL AI AGENTS:**
> Whenever any code, component, endpoint, database schema, migration, or rule in this repository (`d:\CoParents`) is added, modified, fixed, or deleted, **you MUST update the relevant AI Agent memory files (`AGENTS.md` and appropriate sub-files in the [`memory/`](file:///d:/CoParents/memory) directory)** before concluding your turn!

---

## 📌 Project Overview
- **Project Name**: Education Ecosystem Portal (CoParents.in)
- **Primary Function**: Multi-role portal for searching and managing educational services (Coaching Institutes, Hostels, Libraries, Flats/PGs, Career Counselling) in Patna, Bihar.
- **Key Capabilities**: Role-based access control (Super Admin, Co Admin, Department Managers, Students/Parents), multi-stage approval workflow for service listings, live Express API server with Supabase PostgreSQL connection & seamless in-memory fallback, and CMS/Settings management.

---

## 📁 AI Memory Files Structure

All detailed memory modules are maintained inside the [`memory/`](file:///d:/CoParents/memory) folder:

| Memory File | Description & Purpose |
| :--- | :--- |
| 🚀 [PROJECT_OVERVIEW.md](file:///d:/CoParents/memory/PROJECT_OVERVIEW.md) | Project vision, core capabilities, demo credentials, environment variables, and user roles. |
| 🏗️ [ARCHITECTURE.md](file:///d:/CoParents/memory/ARCHITECTURE.md) | High-level system architecture, Express + Vite dev server setup, dual-mode database engine, and API endpoints. |
| 🗄️ [DATABASE_SCHEMA.md](file:///d:/CoParents/memory/DATABASE_SCHEMA.md) | Complete PostgreSQL schema, table relations, TypeScript definitions, seed data, and migration files. |
| 🧩 [COMPONENTS.md](file:///d:/CoParents/memory/COMPONENTS.md) | Component index, UI hierarchy, role dashboards (`SuperAdminDashboard`, `DepartmentDashboard`, `StudentParentDashboard`), and modal flows. |
| 📜 [RULES.md](file:///d:/CoParents/memory/RULES.md) | Coding conventions, Tailwind CSS guidelines, state management practices, and step-by-step memory updating protocol. |
| 📝 [CHANGELOG_MEMORY.md](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md) | Chronological log of modifications, refactoring, and additions executed by AI agents in this project. |

---

## ⚡ Tech Stack At A Glance

- **Frontend Framework**: React 19 (`react@^19.0.1`), Vite (`vite@^6.2.3`), TypeScript (`typescript@~5.8.2`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss@^4.1.14`)
- **Icons & Animation**: Lucide React (`lucide-react@^0.546.0`), Motion (`motion@^12.23.24`), Recharts (`recharts@^3.10.0`)
- **Backend API & Server**: Express (`express@^4.21.2`), `tsx` runner, Node.js environment
- **Database**: PostgreSQL via `pg` (`pg@^8.22.0`) / Supabase DB, with automatic high-fidelity in-memory fallback mode (`memUsers`, `memServices`, etc.)
- **AI Integrations**: Google GenAI (`@google/genai@^2.4.0`)

---

## 🔑 Demo & Test Accounts

| Role | Username | Default Password | Description |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `admin123` | Full system access, audit logs, CMS config, user & approval management. |
| **Co Admin** | `coadmin` | `coadmin123` | Operational management and service moderation. |
| **Coaching Dept** | `coaching` | `coaching123` | Department manager for coaching institute listings in Patna. |
| **Hostel Dept** | `hostel` | `hostel123` | Department manager for hostel listings. |
| **Library Dept** | `library` | `library123` | Department manager for library listings. |
| **Flat/PG Dept** | `flat` | `flat123` | Department manager for PG and Flat listings. |
| **Counseling Dept** | `counsel` | `counsel123` | Department manager for career counselling services. |

---

## 🔄 Memory Maintenance Instructions for Agents

Whenever you perform work in this repository:
1. **Locate affected components/files** in [`memory/COMPONENTS.md`](file:///d:/CoParents/memory/COMPONENTS.md) or [`memory/ARCHITECTURE.md`](file:///d:/CoParents/memory/ARCHITECTURE.md).
2. **Reflect code changes** in the corresponding memory document.
3. **Append a summary line** in [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md) with date, action, and affected files.
