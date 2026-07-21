export type UserRole =
  | 'Super Admin'
  | 'Co Admin'
  | 'Coaching'
  | 'Hostel'
  | 'Library'
  | 'Flat / PG'
  | 'Career Counselling'
  | 'Student'
  | 'Parent';

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  name: string;
  email: string;
  mobile: string;
  departmentId?: string; // Links to the specific service if role is a department
  status: 'Active' | 'Inactive';
}

export interface Enquiry {
  id: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  userType: 'Student' | 'Parent' | 'Coaching' | 'Hostel' | 'Library' | 'Flat / PG' | 'Counsellor';
  city: string; // Default: Patna
  areaLocality: string;
  interestedService: 'Coaching' | 'Hostel' | 'Library' | 'Flat / PG' | 'Career Counselling' | 'Scholarships' | 'Career Guidance';
  preferredCourse?: string;
  message?: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed';
  assignedToDepartment?: string; // department user id or department name
  notes?: string;
  createdAt: string;
}

export interface EducationService {
  id: string;
  type: 'coaching' | 'hostel' | 'library' | 'flat' | 'counselling';
  name: string;
  rating: number;
  reviewsCount: number;
  location: string; // e.g. Boring Road, Kankarbagh, Mahendru
  priceFees: string; // e.g., ₹5,000/month or ₹80,000/year
  shortDescription: string;
  fullDescription: string;
  images: string[];
  videoUrl?: string;
  facilities: string[];
  courses?: string[]; // Only for coaching
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  isFeatured: boolean;
  status: 'Approved' | 'Pending Approval' | 'Rejected';
  pendingChanges?: Partial<Omit<EducationService, 'id' | 'type' | 'status' | 'pendingChanges'>>;
  rejectionRemarks?: string;
  createdBy: string; // User ID
  updatedAt: string;
}

export interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  status: 'Published' | 'Hidden';
  displayOrder: number;
  videoUrl?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  status: 'Approved' | 'Pending Approval' | 'Rejected';
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  status: 'Published' | 'Draft';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  status: 'Published' | 'Draft';
}

export interface WhatsAppConfig {
  phoneNumber: string;
  defaultMessage: string;
  isEnabled: boolean;
}

export interface SocialLink {
  id: string;
  platform: 'Facebook' | 'Instagram' | 'YouTube' | 'LinkedIn' | 'X' | 'Telegram';
  url: string;
  isEnabled: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId?: string; // If target is a specific user, undefined means public
  roleTarget?: UserRole; // Target specific role
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CMSConfig {
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;
    aboutContent: string;
    stats: {
      students: number;
      parents: number;
      coachings: number;
      hostels: number;
      libraries: number;
      flats: number;
      counsellors: number;
    };
  };
  aboutUs: {
    title: string;
    content: string;
    mission: string;
    vision: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    mapEmbedUrl: string; // Google Maps URL
  };
  privacyPolicy: string;
  termsConditions: string;
}
