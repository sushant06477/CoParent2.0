import { 
  User, 
  EducationService, 
  CarouselSlide, 
  Testimonial, 
  NewsItem, 
  FAQItem, 
  WhatsAppConfig, 
  SocialLink, 
  CMSConfig,
  Enquiry,
  AuditLog
} from '../types';

export const initialUsers: User[] = [
  { id: 'usr-1', username: 'admin', role: 'Super Admin', name: 'Alok Kumar', email: 'admin@coparents.in', mobile: '9999999991', status: 'Active' },
  { id: 'usr-2', username: 'coadmin', role: 'Co Admin', name: 'Priyesh Ranjan', email: 'coadmin@coparents.in', mobile: '9999999992', status: 'Active' },
  { id: 'usr-3', username: 'coaching_dept', role: 'Coaching', name: 'Mentor Academy Department', email: 'coaching@coparents.in', mobile: '9999999993', departmentId: 'srv-1', status: 'Active' },
  { id: 'usr-4', username: 'hostel_dept', role: 'Hostel', name: 'Anshu Hostels Department', email: 'hostel@coparents.in', mobile: '9999999994', departmentId: 'srv-2', status: 'Active' },
  { id: 'usr-5', username: 'library_dept', role: 'Library', name: 'Gyan Ganga Library', email: 'library@coparents.in', mobile: '9999999995', departmentId: 'srv-3', status: 'Active' },
  { id: 'usr-6', username: 'flat_dept', role: 'Flat / PG', name: 'Patna PG Rentals', email: 'flat@coparents.in', mobile: '9999999996', departmentId: 'srv-4', status: 'Active' },
  { id: 'usr-7', username: 'counsel_dept', role: 'Career Counselling', name: 'Bihar Guidance Bureau', email: 'counsel@coparents.in', mobile: '9999999997', departmentId: 'srv-5', status: 'Active' },
  { id: 'usr-8', username: 'student', role: 'Student', name: 'Aarav Sinha', email: 'aarav@gmail.com', mobile: '9876543210', status: 'Active' },
  { id: 'usr-9', username: 'parent', role: 'Parent', name: 'Rajesh Sinha', email: 'rajesh@gmail.com', mobile: '9876543211', status: 'Active' },
];

export const initialServices: EducationService[] = [
  {
    id: 'srv-1',
    type: 'coaching',
    name: 'Patna IIT Academy',
    rating: 4.8,
    reviewsCount: 154,
    location: 'Boring Road, Patna',
    priceFees: '₹85,000 / Year',
    shortDescription: 'Patna’s premier coaching for IIT-JEE and NEET preparation with top experienced faculty.',
    fullDescription: 'Patna IIT Academy has been a pioneer in competitive exam coaching for over a decade. Located at Boring Road crossing, we offer comprehensive training for IIT-JEE Main & Advanced, NEET, and foundation courses. Our study material, regular test series, and personalized doubt-solving sessions ensure students from Bihar excel at the national level.',
    images: [
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop&q=60'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    facilities: ['Air Conditioned Classrooms', 'Smart Board Enabled', 'Weekly Test Series', 'Library Access', 'Doubt Clearing Desk'],
    courses: ['IIT-JEE Main & Advanced', 'NEET / Medical Prep', 'Foundation Course (Class 8-10)', 'BPSC General Studies'],
    contactInfo: {
      phone: '+91 9999988881',
      email: 'contact@patnaiit.com',
      address: '3rd Floor, Shanti Complex, Boring Road Crossing, Patna, Bihar 800001'
    },
    isFeatured: true,
    status: 'Approved',
    createdBy: 'usr-3',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv-2',
    type: 'hostel',
    name: 'Ganga Boys Executive Hostel',
    rating: 4.6,
    reviewsCount: 82,
    location: 'Kankarbagh, Patna',
    priceFees: '₹6,500 / Month',
    shortDescription: 'Premium boys hostel near Kankarbagh with 3-time quality meals, Wi-Fi, and tight security.',
    fullDescription: 'Located in the peaceful locality of Kankarbagh, Ganga Boys Executive Hostel is the ideal home away from home for students and working professionals. We offer single, double, and triple sharing rooms. Standard amenities include robust Wi-Fi, 24/7 power backup, pure RO water, laundry service, and highly hygienic North & South Indian meals prepared fresh.',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&auto=format&fit=crop&q=60'
    ],
    facilities: ['High-speed Wi-Fi', 'CCTV Surveillance', 'Daily Cleaning', '3 Meals + Tea', 'Geyser & Water Cooler'],
    contactInfo: {
      phone: '+91 9999988882',
      email: 'gangaboys@gmail.com',
      address: 'Sector H, Near Shivaji Park, Kankarbagh, Patna, Bihar 800020'
    },
    isFeatured: true,
    status: 'Approved',
    createdBy: 'usr-4',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv-3',
    type: 'library',
    name: 'Chanakya Study Zone & Library',
    rating: 4.9,
    reviewsCount: 112,
    location: 'Mahendru, Patna',
    priceFees: '₹800 / Month',
    shortDescription: 'Peaceful self-study library with personal cabins, high-speed internet, and daily newspapers.',
    fullDescription: 'Chanakya Study Zone provides a silent, air-conditioned environment optimized for self-study. Highly recommended for UPSC, BPSC, Bank, and SSC aspirants. We feature high-speed optical fiber internet, comfortable ergonomic chairs, personalized cabins, individual charging points, and access to all standard newspapers and competitive magazines.',
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=60'
    ],
    facilities: ['Personal Cabins', 'Super Silent Environment', 'Charging Sockets', 'Daily Current Affairs Bulletins', 'AC & Power Backup'],
    contactInfo: {
      phone: '+91 9999988883',
      email: 'chanakyalib@gmail.com',
      address: 'Opposite Science College Main Gate, Mahendru, Patna, Bihar 800006'
    },
    isFeatured: true,
    status: 'Approved',
    createdBy: 'usr-5',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv-4',
    type: 'flat',
    name: '2BHK Student Friendly Flat',
    rating: 4.3,
    reviewsCount: 29,
    location: 'Rajendra Nagar, Patna',
    priceFees: '₹12,000 / Month',
    shortDescription: 'Spacious 2BHK flat perfectly suited for 4 students, within walking distance from Rajendra Nagar Station.',
    fullDescription: 'A premium, student-friendly 2BHK flat available for rent. Semi-furnished with fans, tube lights, and kitchen cabinets. Located on the 2nd floor with reliable ventilation and sunlight. Close to coaching centers, supermarkets, and transport hubs. Rent is highly economical for students who want to share accommodation.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=60'
    ],
    facilities: ['24/7 Water Supply', 'Separate Electricity Meter', 'Bike Parking', 'Balcony', 'Safe Gated Building'],
    contactInfo: {
      phone: '+91 9999988884',
      email: 'rajendraflatrentals@gmail.com',
      address: 'Road No. 4, Near Arya Kumar Road, Rajendra Nagar, Patna, Bihar 800016'
    },
    isFeatured: false,
    status: 'Approved',
    createdBy: 'usr-6',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv-5',
    type: 'counselling',
    name: 'Patna Career Consultants',
    rating: 4.7,
    reviewsCount: 61,
    location: 'Bailey Road, Patna',
    priceFees: '₹1,500 / Session',
    shortDescription: 'Expert career counseling, personality assessments, and university admissions guidance.',
    fullDescription: 'Confused about your career path after 10th or 12th? Patna Career Consultants provides personalized profiling, psychometric tests, and expert career map planning. We specialize in guidance for engineering, medical, law, management, and overseas education opportunities, helping Bihari students reach global heights.',
    images: [
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=60'
    ],
    facilities: ['Psychometric Profiling', 'One-on-One Interaction', 'Overseas Admissions Help', 'Parent Counselling Support', 'Scholarship Guidance'],
    contactInfo: {
      phone: '+91 9999988885',
      email: 'consult@patnacareer.com',
      address: 'Raja Bazar, Bailey Road (Near Paras Hospital), Patna, Bihar 800014'
    },
    isFeatured: true,
    status: 'Approved',
    createdBy: 'usr-7',
    updatedAt: new Date().toISOString()
  }
];

export const initialCarousel: CarouselSlide[] = [
  {
    id: 'car-1',
    image: '/assets/hero_education_campus.jpg',
    title: 'Unlock Your Academic Future in Patna',
    subtitle: 'Search & compare premium Coaching, Hostels, Libraries, and PG accommodations around Patna with transparent reviews and fees.',
    buttonText: 'Explore Coaching',
    buttonLink: '/search?category=Coaching',
    status: 'Published',
    displayOrder: 1
  },
  {
    id: 'car-2',
    image: '/assets/hero_student_hostel.jpg',
    title: 'Premium Student Accommodations & Hostels',
    subtitle: 'Find secure boys/girls hostels and PG rooms in Boring Road, Kankarbagh, and Rajendra Nagar with complete verified details.',
    buttonText: 'Find Hostels',
    buttonLink: '/search?category=Hostel',
    status: 'Published',
    displayOrder: 2
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'tst-1',
    name: 'Sanjeev Jha',
    role: 'Parent, BPSC Aspirant Son',
    content: 'Coparents.in helped us find the best library and PG for our son in Patna within two days. Highly authentic details and transparent prices! Excellent platform for parents like us.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    status: 'Approved'
  },
  {
    id: 'tst-2',
    name: 'Anjali Sharma',
    role: 'IIT JEE Aspirant',
    content: 'The search filters are amazing. I was looking for a library with personal cabins and charging sockets near Boring Road, and got exactly what I wanted. It saved me weeks of manual searching.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    status: 'Approved'
  }
];

export const initialNews: NewsItem[] = [
  {
    id: 'news-1',
    title: 'BPSC Exam Schedules Announced: Coaching Centers Start Crash Courses',
    content: 'The Bihar Public Service Commission has announced upcoming Prelims dates. Top coaching centers across Patna (Boring Road and Kankarbagh) are rolling out specialized crash courses and test series to support candidates.',
    date: '2026-07-18',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    status: 'Published'
  },
  {
    id: 'news-2',
    title: 'Increasing Trend of Silent Study Libraries in Patna for Civil Services',
    content: 'Over the last year, Patna has witnessed a massive surge in private silent study libraries. These 24/7 self-study hubs in Mahendru and Rajendra Nagar provide super fast internet, clean desk spaces, and a focused workspace.',
    date: '2026-07-15',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80',
    status: 'Published'
  }
];

export const initialFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I submit an enquiry for a coaching institute or hostel?',
    answer: 'Simply fill out the "Register Your Enquiry" form on the homepage. Enter your mobile number, city (default Patna), interested service, and course. Our team or the corresponding verified department will reach out to you immediately.',
    status: 'Published'
  },
  {
    id: 'faq-2',
    question: 'How can coaching owners or PG managers list their services?',
    answer: 'You can create an account and log in. Once logged in, go to your dedicated Department Dashboard to submit details. Note that all updates, prices, or gallery additions must be approved by the Super Admin before appearing on the portal.',
    status: 'Published'
  },
  {
    id: 'faq-3',
    question: 'Is there any verification for the reviews and ratings?',
    answer: 'Yes! Only authenticated parents and students who are registered on coparents.in can submit ratings out of 5 and descriptions for hostels, coaching, and libraries. This prevents false spam.',
    status: 'Published'
  }
];

export const initialWhatsApp: WhatsAppConfig = {
  phoneNumber: '919999999999',
  defaultMessage: 'Hello, I want information about your educational services.',
  isEnabled: true
};

export const initialSocialLinks: SocialLink[] = [
  { id: 'soc-1', platform: 'Facebook', url: 'https://facebook.com/coparents.patna', isEnabled: true },
  { id: 'soc-2', platform: 'Instagram', url: 'https://instagram.com/coparents_patna', isEnabled: true },
  { id: 'soc-3', platform: 'YouTube', url: 'https://youtube.com/c/coparents_bihar', isEnabled: true },
  { id: 'soc-4', platform: 'LinkedIn', url: 'https://linkedin.com/company/coparents', isEnabled: true },
  { id: 'soc-5', platform: 'X', url: 'https://x.com/coparents_in', isEnabled: true },
  { id: 'soc-6', platform: 'Telegram', url: 'https://t.me/coparents_portal', isEnabled: true },
];

export const initialCMS: CMSConfig = {
  homepage: {
    heroTitle: 'Patna’s Trusted Education Ecosystem Portal',
    heroSubtitle: 'Connecting Parents, Students, and Verified Local Institutions on One Elegant Platform',
    aboutTitle: 'Empowering Patna’s Academic Community',
    aboutContent: 'Coparents.in is a premier local initiative based in Patna, Bihar. Our core mission is to solve the classic search bottleneck for students migrating to Patna for high-quality preparation (IIT, BPSC, UPSC, Medical). We curate fully-verified Coaching Institutes, silent study Libraries, PGs, Hostels, and expert Career Counsellors. Every listing undergoes rigorous site verification, and fee plans are fully transparent, putting parents back in control of their child’s academic environment.',
    stats: {
      students: 2450,
      parents: 1820,
      coachings: 124,
      hostels: 210,
      libraries: 95,
      flats: 340,
      counsellors: 45
    }
  },
  aboutUs: {
    title: 'About coparents.in',
    content: 'Founded in Patna, Bihar, coparents.in stands as the largest curated digital directory for education resources in East India. We bridge the critical information gap between institutions and outstation families moving to Patna.',
    mission: 'To bring total transparency, safety, and academic rigor to Patna’s local education infrastructure, ensuring every student finds safe lodging and world-class guidance.',
    vision: 'To turn Patna into a seamless educational hub where technology eliminates real-estate exploitation of migrating student youth.'
  },
  contact: {
    email: 'help@coparents.in',
    phone: '+91 612 2548484',
    address: '402, 4th Floor, Grand Plaza, Fraser Road, Patna, Bihar 800001',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Fraser%20Road%20Patna&t=&z=13&ie=UTF8&iwloc=&output=embed'
  },
  privacyPolicy: 'Your privacy is core to coparents.in. We protect student and parent details. Enquiries are shared strictly with the selected, verified department. We never sell data to unauthorized aggregators.',
  termsConditions: 'All institutions must maintain accurate fee charts. False listings, inflated reviews, or bait-and-switch accommodations will lead to immediate portal blacklisting and legal referral.'
};

export const initialEnquiries: Enquiry[] = [
  {
    id: 'enq-1',
    fullName: 'Rahul Mishra',
    mobileNumber: '9888877771',
    email: 'rahul@gmail.com',
    userType: 'Student',
    city: 'Patna',
    areaLocality: 'Boring Road',
    interestedService: 'Coaching',
    preferredCourse: 'IIT-JEE Main & Advanced',
    message: 'Looking for a fresh batch starting in late July for dropper course.',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString() // 5 hours ago
  },
  {
    id: 'enq-2',
    fullName: 'Sumit Prakash',
    mobileNumber: '9888877772',
    email: 'sumit@gmail.com',
    userType: 'Parent',
    city: 'Patna',
    areaLocality: 'Rajendra Nagar',
    interestedService: 'Hostel',
    message: 'Need a safe double-sharing boys hostel with healthy food and tight security.',
    status: 'In Progress',
    assignedToDepartment: 'Hostel',
    notes: 'Called parent. Scheduled hostel visit for tomorrow afternoon.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'usr-1',
    userName: 'Alok Kumar',
    userRole: 'Super Admin',
    action: 'SYSTEM_STARTUP',
    details: 'Education Ecosystem Portal database bootstrapped and migrated to Supabase PostgreSQL.',
    timestamp: new Date().toISOString()
  }
];
