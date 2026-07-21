# UI Components & Dashboard Hierarchy

> **File Path**: [`memory/COMPONENTS.md`](file:///d:/CoParents/memory/COMPONENTS.md)  
> **Main Index**: [`AGENTS.md`](file:///d:/CoParents/AGENTS.md)

---

## 🎨 Main Application Layout (`src/App.tsx`)

[`src/App.tsx`](file:///d:/CoParents/src/App.tsx) acts as the state manager and root UI controller.
- **Top Bar**: Live Database Connection Banner (`/api/db-status`) showing whether PostgreSQL or In-Memory Fallback Mode is active.
- **Navigation Tabs**: `home`, `coaching`, `hostel`, `library`, `flat`, `counselling`, `enquiry`, `gallery`, `news`, `faq`, `contact`, `about`, `privacy`, `terms`, `dashboard`.
- **Modals**: Login Modal, Forgot Password Modal (reset via verified mobile).

---

## 🧩 Component Directory (`src/components/`)

| Component | File Path | Responsibilities & Purpose |
| :--- | :--- | :--- |
| **Header** | [`src/components/Header.tsx`](file:///d:/CoParents/src/components/Header.tsx) | Navigation bar, logo, category dropdown, search trigger, login button / user avatar profile menu. |
| **Footer** | [`src/components/Footer.tsx`](file:///d:/CoParents/src/components/Footer.tsx) | Page footer with quick links, social links, contact info, and legal policy triggers. |
| **HeroCarousel** | [`src/components/HeroCarousel.tsx`](file:///d:/CoParents/src/components/HeroCarousel.tsx) | Dynamic image slider for key campaigns, announcements, and direct CTA buttons. |
| **SearchSection** | [`src/components/SearchSection.tsx`](file:///d:/CoParents/src/components/SearchSection.tsx) | Interactive filter bar (by Patna locality e.g. Boring Road, service category, budget range, ratings). |
| **CategoryCards** | [`src/components/CategoryCards.tsx`](file:///d:/CoParents/src/components/CategoryCards.tsx) | Visual card grid for quick navigation into Coaching, Hostels, Libraries, Flats/PGs, Counselling. |
| **FeaturedSections** | [`src/components/FeaturedSections.tsx`](file:///d:/CoParents/src/components/FeaturedSections.tsx) | Highlights top-rated / sponsored listings per category. |
| **EnquiryForm** | [`src/components/EnquiryForm.tsx`](file:///d:/CoParents/src/components/EnquiryForm.tsx) | Lead generation form allowing students/parents to submit inquiries for specific services. |
| **Statistics** | [`src/components/Statistics.tsx`](file:///d:/CoParents/src/components/Statistics.tsx) | Impact counters (Students helped, Institutes onboarded, Verified Hostels). |
| **SuccessStories** | [`src/components/SuccessStories.tsx`](file:///d:/CoParents/src/components/SuccessStories.tsx) | Case studies and success stories of students in Patna. |
| **ReviewsSlider** | [`src/components/ReviewsSlider.tsx`](file:///d:/CoParents/src/components/ReviewsSlider.tsx) | Student & parent rating testimonials slider. |
| **PhotoGallery** | [`src/components/PhotoGallery.tsx`](file:///d:/CoParents/src/components/PhotoGallery.tsx) | Image gallery showcasing campus facilities, libraries, hostels. |
| **NewsSection** | [`src/components/NewsSection.tsx`](file:///d:/CoParents/src/components/NewsSection.tsx) | News, exam dates, admission alerts, and education portal updates. |
| **FAQSection** | [`src/components/FAQSection.tsx`](file:///d:/CoParents/src/components/FAQSection.tsx) | Accordion component displaying frequently asked questions. |
| **ContactSection** | [`src/components/ContactSection.tsx`](file:///d:/CoParents/src/components/ContactSection.tsx) | Office address, email, phone, and embedded Google Map view for Patna headquarters. |
| **WhatsAppButton** | [`src/components/WhatsAppButton.tsx`](file:///d:/CoParents/src/components/WhatsAppButton.tsx) | Floating WhatsApp action button for instant chat connection. |
| **Dashboard Router**| [`src/components/Dashboard.tsx`](file:///d:/CoParents/src/components/Dashboard.tsx) | Routes logged-in user to appropriate dashboard based on `user.role`. |
| **SuperAdminDashboard** | [`src/components/SuperAdminDashboard.tsx`](file:///d:/CoParents/src/components/SuperAdminDashboard.tsx) | Full admin dashboard with tabs: Overview Analytics, Service Approval Queue, User Management, Lead Management, CMS Editor, Carousel Manager, Audit Logs, Report Exporter. |
| **DepartmentDashboard**| [`src/components/DepartmentDashboard.tsx`](file:///d:/CoParents/src/components/DepartmentDashboard.tsx) | Department manager panel for managing own listings, editing facility details, submitting listing updates for admin review, and handling leads. |
| **StudentParentDashboard**| [`src/components/StudentParentDashboard.tsx`](file:///d:/CoParents/src/components/StudentParentDashboard.tsx) | Dashboard for students/parents to view saved listings, submitted enquiry statuses, and profile details. |
