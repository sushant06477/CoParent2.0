# AI Agent Operational Rules & Conventions

> **File Path**: [`memory/RULES.md`](file:///d:/CoParents/memory/RULES.md)  
> **Main Index**: [`AGENTS.md`](file:///d:/CoParents/AGENTS.md)

---

## ⚠️ MANDATORY RULE: Memory Update Protocol

> [!IMPORTANT]
> **ANY AI AGENT WORKING ON THIS CODEBASE MUST FOLLOW THIS STEP-BY-STEP WORKFLOW:**

1. **Before making changes**: Read [`AGENTS.md`](file:///d:/CoParents/AGENTS.md) and relevant files in [`memory/`](file:///d:/CoParents/memory) to understand current state and schema.
2. **After making changes**:
   - If UI components were created, modified, or deleted: update [`memory/COMPONENTS.md`](file:///d:/CoParents/memory/COMPONENTS.md).
   - If API routes or backend server code in `server.ts` or `supabase.ts` changed: update [`memory/ARCHITECTURE.md`](file:///d:/CoParents/memory/ARCHITECTURE.md).
   - If database schema, types in `types.ts`, seed data, or migrations changed: update [`memory/DATABASE_SCHEMA.md`](file:///d:/CoParents/memory/DATABASE_SCHEMA.md).
   - Log the entry in [`memory/CHANGELOG_MEMORY.md`](file:///d:/CoParents/memory/CHANGELOG_MEMORY.md) with date, summary of changes, and modified files.

---

## 🎨 Coding & Styling Guidelines

1. **TypeScript Type Safety**: Always update interfaces in [`src/types.ts`](file:///d:/CoParents/src/types.ts) before using new properties in UI components or backend API calls.
2. **Tailwind CSS v4 Usage**: Use Tailwind utility classes for styling. Avoid inline styles where possible. Maintain color harmony with existing teal/indigo/emerald themes.
3. **Database Consistency**: Keep in-memory fallback state in [`src/db/supabase.ts`](file:///d:/CoParents/src/db/supabase.ts) and seed data in [`src/db/seed-data.ts`](file:///d:/CoParents/src/db/seed-data.ts) aligned with PostgreSQL migration scripts in [`supabase/migrations/`](file:///d:/CoParents/supabase/migrations).
4. **Icons**: Use `lucide-react` icons. Import icons cleanly at top of files.
5. **Form Validation & UX**: Show clear toast/alert feedback on actions (e.g. login error, enquiry submit success, service listing pending approval).
