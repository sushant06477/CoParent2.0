-- ====================================================================
-- SUPABASE POSTGRESQL DATABASE MIGRATION SCRIPT
-- Application: Patna Education Ecosystem Portal (coparents.in)
-- Version: 1.0.0
-- Created At: 2026-07-21
-- ====================================================================

-- --- CLEANUP PRE-EXISTING TABLES (Optional/Safe Mode) ---
-- Uncomment if you want to perform a complete fresh reset:
-- DROP TABLE IF EXISTS notifications CASCADE;
-- DROP TABLE IF EXISTS audit_logs CASCADE;
-- DROP TABLE IF EXISTS enquiries CASCADE;
-- DROP TABLE IF EXISTS cms_config CASCADE;
-- DROP TABLE IF EXISTS social_links CASCADE;
-- DROP TABLE IF EXISTS whatsapp_config CASCADE;
-- DROP TABLE IF EXISTS faqs CASCADE;
-- DROP TABLE IF EXISTS news CASCADE;
-- DROP TABLE IF EXISTS testimonials CASCADE;
-- DROP TABLE IF EXISTS carousel CASCADE;
-- DROP TABLE IF EXISTS services CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ====================================================================
-- 1. TABLE STRUCTURES WITH PROPER KEY CONSTRAINTS
-- ====================================================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  "departmentId" TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  CONSTRAINT check_user_status CHECK (status IN ('Active', 'Suspended', 'Pending'))
);

-- SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0.00,
  "reviewsCount" INTEGER NOT NULL DEFAULT 0,
  location TEXT NOT NULL,
  "priceFees" TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "fullDescription" TEXT NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  "videoUrl" TEXT,
  facilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  courses JSONB DEFAULT '[]'::jsonb,
  "contactInfo" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "isFeatured" BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'Pending',
  "pendingChanges" JSONB,
  "rejectionRemarks" TEXT,
  "createdBy" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "updatedAt" TEXT NOT NULL,
  CONSTRAINT check_service_status CHECK (status IN ('Pending', 'Approved', 'Rejected'))
);

-- CAROUSEL SLIDES TABLE
CREATE TABLE IF NOT EXISTS carousel (
  id TEXT PRIMARY KEY,
  image TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  "buttonText" TEXT NOT NULL,
  "buttonLink" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "videoUrl" TEXT,
  CONSTRAINT check_carousel_status CHECK (status IN ('Draft', 'Published'))
);

-- TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  image TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  CONSTRAINT check_testimonial_rating CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT check_testimonial_status CHECK (status IN ('Pending', 'Approved', 'Rejected'))
);

-- NEWS TABLE
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT,
  status TEXT NOT NULL DEFAULT 'Draft',
  CONSTRAINT check_news_status CHECK (status IN ('Draft', 'Published'))
);

-- FAQS TABLE
CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Published',
  CONSTRAINT check_faq_status CHECK (status IN ('Draft', 'Published'))
);

-- WHATSAPP CONFIG TABLE
CREATE TABLE IF NOT EXISTS whatsapp_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  "phoneNumber" TEXT NOT NULL,
  "defaultMessage" TEXT NOT NULL,
  "isEnabled" BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT single_row CHECK (id = 1)
);

-- SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS social_links (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  "isEnabled" BOOLEAN NOT NULL DEFAULT TRUE
);

-- CMS CONFIG TABLE (Stores general pages and settings JSON)
CREATE TABLE IF NOT EXISTS cms_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  homepage JSONB NOT NULL DEFAULT '{}'::jsonb,
  "aboutUs" JSONB NOT NULL DEFAULT '{}'::jsonb,
  contact JSONB NOT NULL DEFAULT '{}'::jsonb,
  "privacyPolicy" TEXT NOT NULL,
  "termsConditions" TEXT NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "mobileNumber" TEXT NOT NULL,
  email TEXT,
  "userType" TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Patna',
  "areaLocality" TEXT NOT NULL,
  "interestedService" TEXT NOT NULL,
  "preferredCourse" TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  "assignedToDepartment" TEXT,
  notes TEXT,
  "createdAt" TEXT NOT NULL,
  CONSTRAINT check_enquiry_status CHECK (status IN ('New', 'In Progress', 'Resolved', 'Spam'))
);

-- AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "userName" TEXT NOT NULL,
  "userRole" TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TEXT NOT NULL
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
  "roleTarget" TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TEXT NOT NULL
);

-- ====================================================================
-- 2. INDEX OPTIMIZATIONS FOR HIGHER PERFORMANCE
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_type ON services(type);
CREATE INDEX IF NOT EXISTS idx_services_created_by ON services("createdBy");
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications("userId");
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications("isRead");

-- ====================================================================
-- 3. SEEDING STRATEGY (BOOTSTRAP INITIAL PORTAL DATA)
-- ====================================================================

-- 3.1. Insert Users
INSERT INTO users (id, username, role, name, email, mobile, "departmentId", status)
VALUES 
  ('usr-1', 'admin', 'Super Admin', 'Alok Kumar', 'admin@coparents.in', '9999999991', NULL, 'Active'),
  ('usr-2', 'coadmin', 'Co Admin', 'Priyesh Ranjan', 'coadmin@coparents.in', '9999999992', NULL, 'Active'),
  ('usr-3', 'coaching_dept', 'Coaching', 'Mentor Academy Department', 'coaching@coparents.in', '9999999993', 'srv-1', 'Active'),
  ('usr-4', 'hostel_dept', 'Hostel', 'Anshu Hostels Department', 'hostel@coparents.in', '9999999994', 'srv-2', 'Active'),
  ('usr-5', 'library_dept', 'Library', 'Gyan Ganga Library', 'library@coparents.in', '9999999995', 'srv-3', 'Active'),
  ('usr-6', 'flat_dept', 'Flat / PG', 'Patna PG Rentals', 'flat@coparents.in', '9999999996', 'srv-4', 'Active'),
  ('usr-7', 'counsel_dept', 'Career Counselling', 'Bihar Guidance Bureau', 'counsel@coparents.in', '9999999997', 'srv-5', 'Active'),
  ('usr-8', 'student', 'Student', 'Aarav Sinha', 'aarav@gmail.com', '9876543210', NULL, 'Active'),
  ('usr-9', 'parent', 'Parent', 'Rajesh Sinha', 'rajesh@gmail.com', '9876543211', NULL, 'Active')
ON CONFLICT (id) DO NOTHING;

-- 3.2. Insert Services
INSERT INTO services (
  id, type, name, rating, "reviewsCount", location, "priceFees", 
  "shortDescription", "fullDescription", images, "videoUrl", 
  facilities, courses, "contactInfo", "isFeatured", status, "createdBy", "updatedAt"
) VALUES 
  (
    'srv-1', 
    'coaching', 
    'Patna IIT Academy', 
    4.8, 
    154, 
    'Boring Road, Patna', 
    '₹85,000 / Year', 
    'Patna’s premier coaching for IIT-JEE and NEET preparation with top experienced faculty.', 
    'Patna IIT Academy has been a pioneer in competitive exam coaching for over a decade. Located at Boring Road crossing, we offer comprehensive training for IIT-JEE Main & Advanced, NEET, and foundation courses. Our study material, regular test series, and personalized doubt-solving sessions ensure students from Bihar excel at the national level.', 
    '["https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop&q=60"]'::jsonb, 
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
    '["Air Conditioned Classrooms", "Smart Board Enabled", "Weekly Test Series", "Library Access", "Doubt Clearing Desk"]'::jsonb, 
    '["IIT-JEE Main & Advanced", "NEET / Medical Prep", "Foundation Course (Class 8-10)", "BPSC General Studies"]'::jsonb, 
    '{"phone": "+91 9999988881", "email": "contact@patnaiit.com", "address": "3rd Floor, Shanti Complex, Boring Road Crossing, Patna, Bihar 800001"}'::jsonb, 
    TRUE, 
    'Approved', 
    'usr-3', 
    '2026-07-21T00:00:00.000Z'
  ),
  (
    'srv-2', 
    'hostel', 
    'Ganga Boys Executive Hostel', 
    4.6, 
    82, 
    'Kankarbagh, Patna', 
    '₹6,500 / Month', 
    'Premium boys hostel near Kankarbagh with 3-time quality meals, Wi-Fi, and tight security.', 
    'Located in the peaceful locality of Kankarbagh, Ganga Boys Executive Hostel is the ideal home away from home for students and working professionals. We offer single, double, and triple sharing rooms. Standard amenities include robust Wi-Fi, 24/7 power backup, pure RO water, laundry service, and highly hygienic North & South Indian meals prepared fresh.', 
    '["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&auto=format&fit=crop&q=60"]'::jsonb, 
    NULL, 
    '["High-speed Wi-Fi", "CCTV Surveillance", "Daily Cleaning", "3 Meals + Tea", "Geyser & Water Cooler"]'::jsonb, 
    '[]'::jsonb, 
    '{"phone": "+91 9999988882", "email": "gangaboys@gmail.com", "address": "Sector H, Near Shivaji Park, Kankarbagh, Patna, Bihar 800020"}'::jsonb, 
    TRUE, 
    'Approved', 
    'usr-4', 
    '2026-07-21T00:00:00.000Z'
  ),
  (
    'srv-3', 
    'library', 
    'Chanakya Study Zone & Library', 
    4.9, 
    112, 
    'Mahendru, Patna', 
    '₹800 / Month', 
    'Peaceful self-study library with personal cabins, high-speed internet, and daily newspapers.', 
    'Chanakya Study Zone provides a silent, air-conditioned environment optimized for self-study. Highly recommended for UPSC, BPSC, Bank, and SSC aspirants. We feature high-speed optical fiber internet, comfortable ergonomic chairs, personalized cabins, individual charging points, and access to all standard newspapers and competitive magazines.', 
    '["https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=60"]'::jsonb, 
    NULL, 
    '["Personal Cabins", "Super Silent Environment", "Charging Sockets", "Daily Current Affairs Bulletins", "AC & Power Backup"]'::jsonb, 
    '[]'::jsonb, 
    '{"phone": "+91 9999988883", "email": "chanakyalib@gmail.com", "address": "Opposite Science College Main Gate, Mahendru, Patna, Bihar 800006"}'::jsonb, 
    TRUE, 
    'Approved', 
    'usr-5', 
    '2026-07-21T00:00:00.000Z'
  ),
  (
    'srv-4', 
    'flat', 
    '2BHK Student Friendly Flat', 
    4.3, 
    29, 
    'Rajendra Nagar, Patna', 
    '₹12,000 / Month', 
    'Spacious 2BHK flat perfectly suited for 4 students, within walking distance from Rajendra Nagar Station.', 
    'A premium, student-friendly 2BHK flat available for rent. Semi-furnished with fans, tube lights, and kitchen cabinets. Located on the 2nd floor with reliable ventilation and sunlight. Close to coaching centers, supermarkets, and transport hubs. Rent is highly economical for students who want to share accommodation.', 
    '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=60"]'::jsonb, 
    NULL, 
    '["24/7 Water Supply", "Separate Electricity Meter", "Bike Parking", "Balcony", "Safe Gated Building"]'::jsonb, 
    '[]'::jsonb, 
    '{"phone": "+91 9999988884", "email": "rajendraflatrentals@gmail.com", "address": "Road No. 4, Near Arya Kumar Road, Rajendra Nagar, Patna, Bihar 800016"}'::jsonb, 
    FALSE, 
    'Approved', 
    'usr-6', 
    '2026-07-21T00:00:00.000Z'
  ),
  (
    'srv-5', 
    'counselling', 
    'Patna Career Consultants', 
    4.7, 
    61, 
    'Bailey Road, Patna', 
    '₹1,500 / Session', 
    'Expert career counseling, personality assessments, and university admissions guidance.', 
    'Confused about your career path after 10th or 12th? Patna Career Consultants provides personalized profiling, psychometric tests, and expert career map planning. We specialize in guidance for engineering, medical, law, management, and overseas education opportunities, helping Bihari students reach global heights.', 
    '["https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=60"]'::jsonb, 
    NULL, 
    '["Psychometric Profiling", "One-on-One Interaction", "Overseas Admissions Help", "Parent Counselling Support", "Scholarship Guidance"]'::jsonb, 
    '[]'::jsonb, 
    '{"phone": "+91 9999988885", "email": "consult@patnacareer.com", "address": "Raja Bazar, Bailey Road (Near Paras Hospital), Patna, Bihar 800014"}'::jsonb, 
    TRUE, 
    'Approved', 
    'usr-7', 
    '2026-07-21T00:00:00.000Z'
  )
ON CONFLICT (id) DO NOTHING;

-- 3.3. Insert Carousel
INSERT INTO carousel (id, image, title, subtitle, "buttonText", "buttonLink", status, "displayOrder", "videoUrl")
VALUES 
  ('car-1', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80', 'Unlock Your Academic Future in Patna', 'Search & compare premium Coaching, Hostels, Libraries, and PG accommodations around Patna with transparent reviews and fees.', 'Explore Coaching', '/search?category=Coaching', 'Published', 1, NULL),
  ('car-2', 'https://images.unsplash.com/photo-1513258496099-48168024addd?w=1600&auto=format&fit=crop&q=80', 'Premium Student Accommodations & Hostels', 'Find secure boys/girls hostels and PG rooms in Boring Road, Kankarbagh, and Rajendra Nagar with complete verified details.', 'Find Hostels', '/search?category=Hostel', 'Published', 2, NULL)
ON CONFLICT (id) DO NOTHING;

-- 3.4. Insert Testimonials
INSERT INTO testimonials (id, name, role, content, rating, image, status)
VALUES 
  ('tst-1', 'Sanjeev Jha', 'Parent, BPSC Aspirant Son', 'Coparents.in helped us find the best library and PG for our son in Patna within two days. Highly authentic details and transparent prices! Excellent platform for parents like us.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', 'Approved'),
  ('tst-2', 'Anjali Sharma', 'IIT JEE Aspirant', 'The search filters are amazing. I was looking for a library with personal cabins and charging sockets near Boring Road, and got exactly what I wanted. It saved me weeks of manual searching.', 5, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', 'Approved')
ON CONFLICT (id) DO NOTHING;

-- 3.5. Insert News
INSERT INTO news (id, title, content, date, image, status)
VALUES 
  ('news-1', 'BPSC Exam Schedules Announced: Coaching Centers Start Crash Courses', 'The Bihar Public Service Commission has announced upcoming Prelims dates. Top coaching centers across Patna (Boring Road and Kankarbagh) are rolling out specialized crash courses and test series to support candidates.', '2026-07-18', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80', 'Published'),
  ('news-2', 'Increasing Trend of Silent Study Libraries in Patna for Civil Services', 'Over the last year, Patna has witnessed a massive surge in private silent study libraries. These 24/7 self-study hubs in Mahendru and Rajendra Nagar provide super fast internet, clean desk spaces, and a focused workspace.', '2026-07-15', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80', 'Published')
ON CONFLICT (id) DO NOTHING;

-- 3.6. Insert FAQs
INSERT INTO faqs (id, question, answer, status)
VALUES 
  ('faq-1', 'How do I submit an enquiry for a coaching institute or hostel?', 'Simply fill out the "Register Your Enquiry" form on the homepage. Enter your mobile number, city (default Patna), interested service, and course. Our team or the corresponding verified department will reach out to you immediately.', 'Published'),
  ('faq-2', 'How can coaching owners or PG managers list their services?', 'You can create an account and log in. Once logged in, go to your dedicated Department Dashboard to submit details. Note that all updates, prices, or gallery additions must be approved by the Super Admin before appearing on the portal.', 'Published'),
  ('faq-3', 'Is there any verification for the reviews and ratings?', 'Yes! Only authenticated parents and students who are registered on coparents.in can submit ratings out of 5 and descriptions for hostels, coaching, and libraries. This prevents false spam.', 'Published')
ON CONFLICT (id) DO NOTHING;

-- 3.7. Insert WhatsApp Config
INSERT INTO whatsapp_config (id, "phoneNumber", "defaultMessage", "isEnabled")
VALUES (1, '919999999999', 'Hello, I want information about your educational services.', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3.8. Insert Social Links
INSERT INTO social_links (id, platform, url, "isEnabled")
VALUES 
  ('soc-1', 'Facebook', 'https://facebook.com/coparents.patna', TRUE),
  ('soc-2', 'Instagram', 'https://instagram.com/coparents_patna', TRUE),
  ('soc-3', 'YouTube', 'https://youtube.com/c/coparents_bihar', TRUE),
  ('soc-4', 'LinkedIn', 'https://linkedin.com/company/coparents', TRUE),
  ('soc-5', 'X', 'https://x.com/coparents_in', TRUE),
  ('soc-6', 'Telegram', 'https://t.me/coparents_portal', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3.9. Insert CMS Config
INSERT INTO cms_config (id, homepage, "aboutUs", contact, "privacyPolicy", "termsConditions")
VALUES (
  1, 
  '{"heroTitle": "Patna’s Trusted Education Ecosystem Portal", "heroSubtitle": "Connecting Parents, Students, and Verified Local Institutions on One Elegant Platform", "aboutTitle": "Empowering Patna’s Academic Community", "aboutContent": "Coparents.in is a premier local initiative based in Patna, Bihar. Our core mission is to solve the classic search bottleneck for students migrating to Patna for high-quality preparation (IIT, BPSC, UPSC, Medical). We curate fully-verified Coaching Institutes, silent study Libraries, PGs, Hostels, and expert Career Counsellors. Every listing undergoes rigorous site verification, and fee plans are fully transparent, putting parents back in control of their child’s academic environment.", "stats": {"students": 2450, "parents": 1820, "coachings": 124, "hostels": 210, "libraries": 95, "flats": 340, "counsellors": 45}}'::jsonb, 
  '{"title": "About coparents.in", "content": "Founded in Patna, Bihar, coparents.in stands as the largest curated digital directory for education resources in East India. We bridge the critical information gap between institutions and outstation families moving to Patna.", "mission": "To bring total transparency, safety, and academic rigor to Patna’s local education infrastructure, ensuring every student finds safe lodging and world-class guidance.", "vision": "To turn Patna into a seamless educational hub where technology eliminates real-estate exploitation of migrating student youth."}'::jsonb, 
  '{"email": "help@coparents.in", "phone": "+91 612 2548484", "address": "402, 4th Floor, Grand Plaza, Fraser Road, Patna, Bihar 800001", "mapEmbedUrl": "https://maps.google.com/maps?q=Fraser%20Road%20Patna&t=&z=13&ie=UTF8&iwloc=&output=embed"}'::jsonb, 
  'Your privacy is core to coparents.in. We protect student and parent details. Enquiries are shared strictly with the selected, verified department. We never sell data to unauthorized aggregators.', 
  'All institutions must maintain accurate fee charts. False listings, inflated reviews, or bait-and-switch accommodations will lead to immediate portal blacklisting and legal referral.'
)
ON CONFLICT (id) DO NOTHING;

-- 3.10. Insert Enquiries
INSERT INTO enquiries (
  id, "fullName", "mobileNumber", email, "userType", city, 
  "areaLocality", "interestedService", "preferredCourse", message, 
  status, "assignedToDepartment", notes, "createdAt"
) VALUES 
  ('enq-1', 'Rahul Mishra', '9888877771', 'rahul@gmail.com', 'Student', 'Patna', 'Boring Road', 'Coaching', 'IIT-JEE Main & Advanced', 'Looking for a fresh batch starting in late July for dropper course.', 'New', NULL, NULL, '2026-07-20T21:47:00.000Z'),
  ('enq-2', 'Sumit Prakash', '9888877772', 'sumit@gmail.com', 'Parent', 'Patna', 'Rajendra Nagar', 'Hostel', NULL, 'Need a safe double-sharing boys hostel with healthy food and tight security.', 'In Progress', 'Hostel', 'Called parent. Scheduled hostel visit for tomorrow afternoon.', '2026-07-20T02:47:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- 3.11. Insert Audit Logs
INSERT INTO audit_logs (id, "userId", "userName", "userRole", action, details, timestamp)
VALUES 
  ('log-1', 'usr-1', 'Alok Kumar', 'Super Admin', 'SYSTEM_STARTUP', 'Education Ecosystem Portal database bootstrapped and migrated to Supabase PostgreSQL.', '2026-07-21T02:47:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- 4. ROW-LEVEL SECURITY TEMPLATES (FOR DIRECT SUPABASE FRONTEND OR SECURITY HARDENING)
-- ====================================================================

-- Enable Row-Level Security on all tables (Standard Supabase Best Practice)
-- Note: When connecting with PostgreSQL admin pools, this can be bypassed or custom policies added.
-- Uncomment below if you want to enforce strict RLS directly in Supabase frontend.

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE services ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE carousel ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE news ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE whatsapp_config ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cms_config ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
