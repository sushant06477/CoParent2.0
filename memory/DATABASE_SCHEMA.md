# Database Schema & Data Models

> **File Path**: [`memory/DATABASE_SCHEMA.md`](file:///d:/CoParents/memory/DATABASE_SCHEMA.md)  
> **Main Index**: [`AGENTS.md`](file:///d:/CoParents/AGENTS.md)

---

## 🗄️ SQL Migration Context

- **Migration File**: [`supabase/migrations/20260721000000_init.sql`](file:///d:/CoParents/supabase/migrations/20260721000000_init.sql)
- **TypeScript Interface Definitions**: [`src/types.ts`](file:///d:/CoParents/src/types.ts)
- **Database Driver / Layer**: [`src/db/supabase.ts`](file:///d:/CoParents/src/db/supabase.ts)
- **Seed Data**: [`src/db/seed-data.ts`](file:///d:/CoParents/src/db/seed-data.ts)

---

## 📋 Primary Tables & Schemas

### 1. `users`
Stores system accounts for administrators, department managers, students, and parents.
- `id` (TEXT, PK)
- `username` (TEXT, UNIQUE, NOT NULL)
- `password` (TEXT, NULLABLE)
- `role` (TEXT, CHECK: Super Admin, Co Admin, Coaching, Hostel, Library, Flat / PG, Career Counselling, Student, Parent)
- `name` (TEXT, NOT NULL)
- `email` (TEXT, NOT NULL)
- `mobile` (TEXT, NOT NULL)
- `departmentId` (TEXT, NULLABLE)
- `status` (TEXT, DEFAULT 'Active', CHECK: Active, Suspended, Pending)

### 2. `services`
Main listings for educational institutions and facilities in Patna.
- `id` (TEXT, PK)
- `type` (TEXT, CHECK: coaching, hostel, library, flat, counselling)
- `name` (TEXT, NOT NULL)
- `rating` (NUMERIC(3,2), DEFAULT 0.00)
- `reviewsCount` (INTEGER, DEFAULT 0)
- `location` (TEXT, e.g. "Boring Road, Patna", "Kankarbagh, Patna")
- `priceFees` (TEXT, e.g. "₹5,000/month", "₹80,000/year")
- `shortDescription` (TEXT)
- `fullDescription` (TEXT)
- `images` (JSONB, Array of image URLs)
- `videoUrl` (TEXT, NULLABLE)
- `facilities` (JSONB, Array of facility strings e.g. ["AC", "Wi-Fi", "Library Access"])
- `courses` (JSONB, Array of course strings e.g. ["IIT-JEE", "NEET"])
- `contactInfo` (JSONB, `{ phone, email, address }`)
- `isFeatured` (BOOLEAN, DEFAULT FALSE)
- `status` (TEXT, CHECK: Approved, Pending Approval, Rejected)
- `pendingChanges` (JSONB, NULLABLE - Stores proposed updates pending Super Admin approval)
- `rejectionRemarks` (TEXT, NULLABLE)
- `createdBy` (TEXT, FK -> `users.id`)
- `updatedAt` (TEXT, ISO timestamp)

### 3. `enquiries`
Captures lead inquiries submitted by students/parents.
- `id` (TEXT, PK)
- `fullName` (TEXT, NOT NULL)
- `mobileNumber` (TEXT, NOT NULL)
- `email` (TEXT, NULLABLE)
- `userType` (TEXT, CHECK: Student, Parent, Coaching, Hostel, Library, Flat / PG, Counsellor)
- `city` (TEXT, DEFAULT 'Patna')
- `areaLocality` (TEXT, NOT NULL)
- `interestedService` (TEXT, CHECK: Coaching, Hostel, Library, Flat / PG, Career Counselling, Scholarships, Career Guidance)
- `preferredCourse` (TEXT, NULLABLE)
- `message` (TEXT, NULLABLE)
- `status` (TEXT, CHECK: New, Contacted, In Progress, Closed)
- `assignedToDepartment` (TEXT, NULLABLE)
- `notes` (TEXT, NULLABLE)
- `createdAt` (TEXT, ISO timestamp)

### 4. `carousel`
Hero slider banners on homepage.
- `id` (TEXT, PK)
- `image` (TEXT, NOT NULL)
- `title` (TEXT, NOT NULL)
- `subtitle` (TEXT, NOT NULL)
- `buttonText` (TEXT, NOT NULL)
- `buttonLink` (TEXT, NOT NULL)
- `status` (TEXT, CHECK: Draft, Published)
- `displayOrder` (INTEGER, DEFAULT 0)
- `videoUrl` (TEXT, NULLABLE)

### 5. `testimonials`
Student and parent reviews.
- `id` (TEXT, PK)
- `name` (TEXT, NOT NULL)
- `role` (TEXT, NOT NULL)
- `content` (TEXT, NOT NULL)
- `rating` (INTEGER, CHECK 1-5)
- `image` (TEXT, NOT NULL)
- `status` (TEXT, CHECK: Pending, Approved, Rejected)

### 6. `news`
Announcements & updates.
- `id` (TEXT, PK)
- `title` (TEXT, NOT NULL)
- `content` (TEXT, NOT NULL)
- `date` (TEXT, NOT NULL)
- `image` (TEXT, NULLABLE)
- `status` (TEXT, CHECK: Draft, Published)

### 7. `faqs`
Frequently asked questions.
- `id` (TEXT, PK)
- `question` (TEXT, NOT NULL)
- `answer` (TEXT, NOT NULL)
- `status` (TEXT, CHECK: Draft, Published)

### 8. `whatsapp_config`
WhatsApp floating action button configuration.
- `id` (TEXT, PK)
- `phoneNumber` (TEXT, NOT NULL)
- `defaultMessage` (TEXT, NOT NULL)
- `isEnabled` (BOOLEAN, DEFAULT TRUE)

### 9. `social_links`
Social media platform links.
- `id` (TEXT, PK)
- `platform` (TEXT, CHECK: Facebook, Instagram, YouTube, LinkedIn, X, Telegram)
- `url` (TEXT, NOT NULL)
- `isEnabled` (BOOLEAN, DEFAULT TRUE)

### 10. `cms_config`
System-wide content management configuration.
- `id` (TEXT, PK, DEFAULT 'main_config')
- `homepage` (JSONB: `{ heroTitle, heroSubtitle, aboutTitle, aboutContent, stats }`)
- `aboutUs` (JSONB: `{ title, content, mission, vision }`)
- `contact` (JSONB: `{ email, phone, address, mapEmbedUrl }`)
- `privacyPolicy` (TEXT)
- `termsConditions` (TEXT)

### 11. `audit_logs`
Tracks key admin & user activities for security.
- `id` (TEXT, PK)
- `userId` (TEXT, FK -> `users.id`)
- `userName` (TEXT, NOT NULL)
- `userRole` (TEXT, NOT NULL)
- `action` (TEXT, NOT NULL)
- `details` (TEXT, NOT NULL)
- `timestamp` (TEXT, ISO timestamp)

### 12. `notifications`
System & user alert notifications.
- `id` (TEXT, PK)
- `userId` (TEXT, FK -> `users.id`, NULLABLE)
- `roleTarget` (TEXT, NULLABLE)
- `title` (TEXT, NOT NULL)
- `message` (TEXT, NOT NULL)
- `isRead` (BOOLEAN, DEFAULT FALSE)
- `createdAt` (TEXT, ISO timestamp)
