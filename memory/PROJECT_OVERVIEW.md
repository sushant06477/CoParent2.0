# Project Overview: Education Ecosystem Portal (CoParents.in)

> **File Path**: [`memory/PROJECT_OVERVIEW.md`](file:///d:/CoParents/memory/PROJECT_OVERVIEW.md)  
> **Main Index**: [`AGENTS.md`](file:///d:/CoParents/AGENTS.md)

---

## 🎯 Purpose & Scope

The **Education Ecosystem Portal** (`coparents.in`) is a web platform focused on Patna, Bihar. It connects students and parents with vetted educational infrastructure and support services, including:
1. **Coaching Institutes** (IIT-JEE, NEET, UPSC, Board Prep across Patna localities like Boring Road, Kankarbagh).
2. **Student Hostels** (Boys & Girls hostels with food, security, and Wi-Fi amenities).
3. **Study Libraries** (24/7 self-study halls with air conditioning and quiet ambiance).
4. **Flats & PGs** (Rental options for students and migrating families).
5. **Career Counselling & Guidance** (1-on-1 expert advisory sessions).

---

## 👥 Persona & Role Matrix

| User Role | Description | Key Capabilities |
| :--- | :--- | :--- |
| **Super Admin** | Platform Owner / Administrator | View audit logs, manage all users, approve/reject service listings & updates, configure homepage CMS, manage hero slides, export analytics reports (CSV/PDF format). |
| **Co Admin** | Assistant Administrator | Approve pending service listings, manage enquiries, review student testimonials. |
| **Coaching Manager** | Department Manager | Add/edit Coaching Institute listings (subject to approval), respond to student enquiries. |
| **Hostel Manager** | Department Manager | Add/edit Hostel listings, manage availability and room facilities. |
| **Library Manager** | Department Manager | Add/edit Library listings, seating info, pricing structures. |
| **Flat/PG Manager** | Department Manager | Add/edit Flat and PG rental listings. |
| **Career Counsellor**| Department Manager | Manage advisory profiles, appointment requests, and counseling services. |
| **Student / Parent** | General Public Visitors | Search and filter listings by locality/budget/rating, submit detailed enquiry forms, request callbacks, read verified reviews & FAQs. |

---

## 🔐 Credentials & Authentication

Login is performed via `/api/auth/login` endpoint (or standard modal UI). Default accounts:

- **Super Admin**: `admin` / `admin123`
- **Co Admin**: `coadmin` / `coadmin123`
- **Coaching Dept**: `coaching` / `coaching123`
- **Hostel Dept**: `hostel` / `hostel123`
- **Library Dept**: `library` / `library123`
- **Flat/PG Dept**: `flat` / `flat123`
- **Career Counseling**: `counsel` / `counsel123`

---

## ⚙️ Environment Variables

Declared in `.env`:

- `GEMINI_API_KEY`: Google Gemini API key (`""` by default, fill in with key from AI Studio).
- `APP_URL`: Base URL for hosted application (`"http://localhost:3000"`).
- `PORT`: Express server port (`3000`).
- `SUPABASE_DB_URL` / `DATABASE_URL`: Direct PostgreSQL connection string for Supabase (`""` by default to use high-fidelity in-memory fallback).
- `SUPABASE_URL` / `VITE_SUPABASE_URL`: Supabase Project API URL template.
- `SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY`: Supabase Public Anon Key template.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key template.
