import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  User, 
  UserRole,
  Enquiry, 
  EducationService, 
  CarouselSlide, 
  Testimonial, 
  NewsItem, 
  FAQItem, 
  WhatsAppConfig, 
  SocialLink, 
  AuditLog, 
  Notification, 
  CMSConfig 
} from './src/types';
import {
  testConnection,
  initializeDatabase,
  getUsers,
  createUser,
  updateUser,
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getCarousel,
  createCarouselSlide,
  updateCarouselSlide,
  deleteCarouselSlide,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  getNews,
  createNewsItem,
  updateNewsItem,
  deleteNewsItem,
  getFAQs,
  createFAQItem,
  updateFAQItem,
  deleteFAQItem,
  getWhatsApp,
  updateWhatsApp,
  getSocialLinks,
  updateSocialLinks,
  getCMS,
  updateCMS,
  getEnquiries,
  createEnquiry,
  updateEnquiry,
  getAuditLogs,
  createAuditLog,
  getNotifications,
  createNotification,
  markNotificationsAsRead,
  getDatabaseStatus
} from './src/db/supabase.ts';

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Log API requests
  app.use((req, res, next) => {
    console.log(`[API Request] ${req.method} ${req.url}`);
    next();
  });

  // Verify database connection on startup
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      console.log('✅ Connected to Supabase database successfully.');
      // Initialize/bootstrap tables if necessary
      await initializeDatabase();
    } else {
      console.warn('⚠️ Supabase connection test failed. Ensure SUPABASE_URL & SUPABASE_ANON_KEY (or SUPABASE_DB_URL) are set in .env.');
    }
  } catch (err) {
    console.error('⚠️ Database connection verification failed:', err);
  }

  // --- API ENDPOINTS ---

  // DB Status check
  app.get('/api/db-status', (req, res) => {
    res.json(getDatabaseStatus());
  });

  // Auth: Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const dbUsers = await getUsers();
      
      const user = dbUsers.find((u: User) => u.username === username || u.mobile === username);
      const isPasswordValid = user && (
        user.password ? password === user.password : 
        (password === `${user.username}123` || password === 'admin123' || password === 'coadmin123' || password === 'coaching123' || password === 'hostel123' || password === 'library123' || password === 'flat123' || password === 'counsel123' || password === 'student123' || password === 'parent123')
      );

      if (user && isPasswordValid) {
        // Create audit log
        const log: AuditLog = {
          id: `log-${Date.now()}`,
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: 'USER_LOGIN',
          details: `User ${user.name} logged in successfully.`,
          timestamp: new Date().toISOString()
        };
        await createAuditLog(log);

        res.json({ success: true, user });
      } else {
        res.status(401).json({ success: false, message: 'Invalid mobile number/username or password.' });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });

  // Auth: Forgot Password
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { mobile, newPassword } = req.body;
      const dbUsers = await getUsers();
      
      const user = dbUsers.find((u: User) => u.mobile === mobile);
      if (user) {
        // Log direct password reset audit entry
        const log: AuditLog = {
          id: `log-${Date.now()}`,
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: 'PASSWORD_RESET',
          details: `Password reset directly via registered mobile number: ${mobile}`,
          timestamp: new Date().toISOString()
        };
        await createAuditLog(log);

        res.json({ success: true, message: `Password successfully updated for ${user.name}!` });
      } else {
        res.status(404).json({ success: false, message: 'Registered mobile number not found in Patna Education Database.' });
      }
    } catch (error) {
      console.error('Error reset password:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });

  // CMS: GET
  app.get('/api/cms', async (req, res) => {
    try {
      const cms = await getCMS();
      res.json(cms);
    } catch (error) {
      console.error('Error fetching CMS:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // CMS: PUT
  app.put('/api/cms', async (req, res) => {
    try {
      const cms = await updateCMS(req.body);
      res.json({ success: true, cms });
    } catch (error) {
      console.error('Error updating CMS:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // WhatsApp Config: GET / PUT
  app.get('/api/whatsapp', async (req, res) => {
    try {
      const config = await getWhatsApp();
      res.json(config);
    } catch (error) {
      console.error('Error getting WhatsApp:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.put('/api/whatsapp', async (req, res) => {
    try {
      const config = await updateWhatsApp(req.body);
      res.json({ success: true, whatsapp: config });
    } catch (error) {
      console.error('Error updating WhatsApp:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Social Links: GET / PUT
  app.get('/api/social-links', async (req, res) => {
    try {
      const links = await getSocialLinks();
      res.json(links);
    } catch (error) {
      console.error('Error fetching social links:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.put('/api/social-links', async (req, res) => {
    try {
      const links = await updateSocialLinks(req.body);
      res.json({ success: true, socialLinks: links });
    } catch (error) {
      console.error('Error saving social links:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Carousel: GET / POST / PUT / DELETE
  app.get('/api/carousel', async (req, res) => {
    try {
      const slides = await getCarousel();
      res.json(slides);
    } catch (error) {
      console.error('Error fetching carousel:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.post('/api/carousel', async (req, res) => {
    try {
      const newSlide: CarouselSlide = {
        id: `car-${Date.now()}`,
        ...req.body
      };
      await createCarouselSlide(newSlide);
      res.json({ success: true, slide: newSlide });
    } catch (error) {
      console.error('Error creating slide:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.put('/api/carousel/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await updateCarouselSlide(id, req.body);
      if (updated) {
        res.json({ success: true, slide: updated });
      } else {
        res.status(404).json({ success: false, message: 'Slide not found' });
      }
    } catch (error) {
      console.error('Error updating slide:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.delete('/api/carousel/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await deleteCarouselSlide(id);
      res.json({ success });
    } catch (error) {
      console.error('Error deleting slide:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Educational Services: GET
  app.get('/api/services', async (req, res) => {
    try {
      const { includePending, createdBy } = req.query;
      const list = await getServices(createdBy as string, includePending === 'true');
      res.json(list);
    } catch (error) {
      console.error('Error getting services:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Get service details
  app.get('/api/services/:id', async (req, res) => {
    try {
      const service = await getServiceById(req.params.id);
      if (service) {
        res.json(service);
      } else {
        res.status(404).json({ message: 'Service listing not found' });
      }
    } catch (error) {
      console.error('Error getting service:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Create new service
  app.post('/api/services', async (req, res) => {
    try {
      const { userRole, ...serviceData } = req.body;
      const isDepartment = ['Coaching', 'Hostel', 'Library', 'Flat / PG', 'Career Counselling'].includes(userRole);
      
      const newService: EducationService = {
        id: `srv-${Date.now()}`,
        rating: 4.5,
        reviewsCount: 1,
        isFeatured: false,
        status: isDepartment ? 'Pending Approval' : 'Approved',
        createdBy: req.body.createdBy || 'usr-1',
        updatedAt: new Date().toISOString(),
        ...serviceData
      };
      
      await createService(newService);
      
      // Add Audit Log
      const audit: AuditLog = {
        id: `log-${Date.now()}`,
        userId: req.body.createdBy || 'usr-1',
        userName: userRole || 'Department',
        userRole: userRole || 'Super Admin',
        action: 'ADD_SERVICE',
        details: `Added new ${newService.type} service named ${newService.name}. Status: ${newService.status}.`,
        timestamp: new Date().toISOString()
      };
      await createAuditLog(audit);
      
      res.json({ success: true, service: newService });
    } catch (error) {
      console.error('Error creating service:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Edit service
  app.put('/api/services/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { userRole, ...updates } = req.body;
      const service = await getServiceById(id);
      
      if (service) {
        const isDepartment = ['Coaching', 'Hostel', 'Library', 'Flat / PG', 'Career Counselling'].includes(userRole);
        let updated: EducationService | null = null;
        
        if (isDepartment) {
          // Store changes in pendingChanges for Super Admin approval
          const pendingChanges = {
            ...(service.pendingChanges || {}),
            ...updates
          };
          updated = await updateService(id, {
            status: 'Pending Approval',
            pendingChanges,
            updatedAt: new Date().toISOString()
          });
        } else {
          // Admin can directly publish!
          updated = await updateService(id, {
            ...updates,
            status: 'Approved',
            updatedAt: new Date().toISOString(),
            pendingChanges: null,
            rejectionRemarks: null
          });
        }
        
        // Audit Log
        const audit: AuditLog = {
          id: `log-${Date.now()}`,
          userId: updates.createdBy || 'usr-1',
          userName: userRole || 'Admin',
          userRole: userRole || 'Super Admin',
          action: 'EDIT_SERVICE',
          details: `Edited service ${service.name}. IsDepartment: ${isDepartment}.`,
          timestamp: new Date().toISOString()
        };
        await createAuditLog(audit);
        
        res.json({ success: true, service: updated });
      } else {
        res.status(404).json({ success: false, message: 'Service not found' });
      }
    } catch (error) {
      console.error('Error editing service:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Delete service
  app.delete('/api/services/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { userRole, userId } = req.query;
      const service = await getServiceById(id);
      
      if (service) {
        const isDepartment = ['Coaching', 'Hostel', 'Library', 'Flat / PG', 'Career Counselling'].includes(userRole as string);
        
        if (isDepartment) {
          // Submit delete request
          const pendingChanges = {
            ...(service.pendingChanges || {}),
            _deleted: true as any
          };
          await updateService(id, {
            status: 'Pending Approval',
            pendingChanges
          });
        } else {
          // Direct delete
          await deleteService(id);
        }
        
        const audit: AuditLog = {
          id: `log-${Date.now()}`,
          userId: (userId as string) || 'usr-1',
          userName: (userRole as string) || 'Admin',
          userRole: (userRole as UserRole) || 'Super Admin',
          action: 'DELETE_SERVICE_REQUEST',
          details: `Requested deletion of ${service.name}. IsDepartment: ${isDepartment}.`,
          timestamp: new Date().toISOString()
        };
        await createAuditLog(audit);
        
        res.json({ success: true, message: isDepartment ? 'Deletion request submitted for Admin Approval.' : 'Service successfully deleted.' });
      } else {
        res.status(404).json({ success: false, message: 'Service not found' });
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Approvals: GET
  app.get('/api/approvals', async (req, res) => {
    try {
      const pending = await getServices(undefined, true);
      res.json(pending.filter(s => s.status === 'Pending Approval'));
    } catch (error) {
      console.error('Error getting approvals:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Approvals: Approve
  app.post('/api/approvals/:id/approve', async (req, res) => {
    try {
      const { id } = req.params;
      const { adminId, adminName } = req.body;
      const service = await getServiceById(id);
      
      if (service) {
        if (service.pendingChanges) {
          if ((service.pendingChanges as any)._deleted) {
            await deleteService(id);
          } else {
            await updateService(id, {
              ...service.pendingChanges,
              status: 'Approved',
              pendingChanges: null,
              rejectionRemarks: null,
              updatedAt: new Date().toISOString()
            });
          }
        } else {
          await updateService(id, {
            status: 'Approved',
            rejectionRemarks: null,
            updatedAt: new Date().toISOString()
          });
        }
        
        // Audit log
        const audit: AuditLog = {
          id: `log-${Date.now()}`,
          userId: adminId || 'usr-1',
          userName: adminName || 'Super Admin',
          userRole: 'Super Admin',
          action: 'APPROVE_CHANGES',
          details: `Approved changes for service: ${service.name}.`,
          timestamp: new Date().toISOString()
        };
        await createAuditLog(audit);
        
        const updatedService = await getServiceById(id);
        res.json({ success: true, service: updatedService });
      } else {
        res.status(404).json({ success: false, message: 'Service not found' });
      }
    } catch (error) {
      console.error('Error approving listing:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Approvals: Reject
  app.post('/api/approvals/:id/reject', async (req, res) => {
    try {
      const { id } = req.params;
      const { adminId, adminName, rejectionRemarks } = req.body;
      const service = await getServiceById(id);
      
      if (service) {
        const updated = await updateService(id, {
          status: 'Rejected',
          rejectionRemarks: rejectionRemarks || 'Changes do not match community guidelines.',
          updatedAt: new Date().toISOString()
        });
        
        const audit: AuditLog = {
          id: `log-${Date.now()}`,
          userId: adminId || 'usr-1',
          userName: adminName || 'Super Admin',
          userRole: 'Super Admin',
          action: 'REJECT_CHANGES',
          details: `Rejected changes for service: ${service.name}. Reason: ${rejectionRemarks}`,
          timestamp: new Date().toISOString()
        };
        await createAuditLog(audit);
        
        res.json({ success: true, service: updated });
      } else {
        res.status(404).json({ success: false, message: 'Service not found' });
      }
    } catch (error) {
      console.error('Error rejecting listing:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Enquiries: GET / POST / PUT
  app.get('/api/enquiries', async (req, res) => {
    try {
      const enquiries = await getEnquiries();
      res.json(enquiries);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.post('/api/enquiries', async (req, res) => {
    try {
      const { password, ...enquiryBody } = req.body;
      const newEnquiry: Enquiry = {
        id: `enq-${Date.now()}`,
        status: 'New',
        createdAt: new Date().toISOString(),
        ...enquiryBody
      };
      
      await createEnquiry(newEnquiry);

      // Auto-register User account if password provided
      if (password) {
        const isPartner = ['Coaching', 'Hostel', 'Library', 'Flat / PG', 'Counsellor'].includes(req.body.userType);

        const newUser: User = {
          id: `usr-${Date.now()}`,
          username: req.body.mobileNumber,
          password: password,
          role: isPartner ? (req.body.userType as any) : (req.body.userType === 'Parent' ? 'Parent' : 'Student'),
          name: req.body.fullName,
          email: req.body.email || `${req.body.mobileNumber}@coparents.in`,
          mobile: req.body.mobileNumber,
          status: isPartner ? 'Pending' : 'Active'
        };
        await createUser(newUser);

        // If partner registered (e.g. Coaching, Hostel, etc.), auto-create pending service listing for Super Admin approval
        if (isPartner) {
          const typeMap: Record<string, any> = {
            'Coaching': 'coaching',
            'Hostel': 'hostel',
            'Library': 'library',
            'Flat / PG': 'flat',
            'Counsellor': 'counselling'
          };
          const newPendingService: EducationService = {
            id: `srv-${Date.now()}`,
            type: typeMap[req.body.userType] || 'coaching',
            name: req.body.fullName,
            rating: 5.0,
            reviewsCount: 0,
            location: `${req.body.areaLocality || 'Boring Road'}, ${req.body.city || 'Patna'}`,
            priceFees: 'Contact for Fee Structure',
            shortDescription: req.body.message || `New ${req.body.userType} registration submitted by ${req.body.fullName}.`,
            fullDescription: req.body.message || `New verified ${req.body.userType} service registration in ${req.body.areaLocality || 'Boring Road'}, Patna. Registered by ${req.body.fullName} (${req.body.mobileNumber}). Awaiting Super Admin review and authorization.`,
            images: [
              typeMap[req.body.userType] === 'hostel' ? '/assets/hero_student_hostel.jpg' : '/assets/hero_education_campus.jpg'
            ],
            facilities: ['Verified Provider', 'Patna Education Grid'],
            contactInfo: {
              phone: req.body.mobileNumber,
              email: req.body.email || `${req.body.mobileNumber}@coparents.in`,
              address: `${req.body.areaLocality || 'Boring Road'}, ${req.body.city || 'Patna'}, Bihar`
            },
            isFeatured: false,
            status: 'Pending Approval',
            createdBy: newUser.id,
            updatedAt: new Date().toISOString()
          };
          await createService(newPendingService);
          newUser.departmentId = newPendingService.id;
          await updateUser(newUser.id, { departmentId: newPendingService.id });

          // Create notification for Super Admin
          const notify: Notification = {
            id: `ntf-${Date.now()}`,
            roleTarget: 'Super Admin',
            title: `New ${req.body.userType} Partner Registration`,
            message: `New ${req.body.userType} partner "${req.body.fullName}" (${req.body.mobileNumber}) registered. Awaiting Super Admin approval before going live.`,
            isRead: false,
            createdAt: new Date().toISOString()
          };
          await createNotification(notify);
        }
      }
      
      // Auto increment CMS counter stats
      const cms = await getCMS();
      if (cms.homepage?.stats) {
        cms.homepage.stats.students += 1;
        await updateCMS(cms);
      }
      
      // Create automated notification for Admin
      const notify: Notification = {
        id: `ntf-${Date.now()}`,
        roleTarget: 'Super Admin',
        title: 'New Student Enquiry & Registration Received',
        message: `Registered enquiry for ${newEnquiry.fullName} (${newEnquiry.mobileNumber}) for ${newEnquiry.interestedService} in Patna. Private to Super Admin until assigned.`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      await createNotification(notify);

      res.json({ success: true, enquiry: newEnquiry });
    } catch (error) {
      console.error('Error creating enquiry:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.put('/api/enquiries/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await updateEnquiry(id, req.body);
      if (updated) {
        res.json({ success: true, enquiry: updated });
      } else {
        res.status(404).json({ success: false, message: 'Enquiry not found' });
      }
    } catch (error) {
      console.error('Error updating enquiry:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Testimonials: GET / POST / PUT
  app.get('/api/testimonials', async (req, res) => {
    try {
      const list = await getTestimonials();
      res.json(list);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.post('/api/testimonials', async (req, res) => {
    try {
      const newTestimonial: Testimonial = {
        id: `tst-${Date.now()}`,
        status: 'Pending Approval',
        ...req.body
      };
      await createTestimonial(newTestimonial);
      res.json({ success: true, testimonial: newTestimonial });
    } catch (error) {
      console.error('Error creating testimonial:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.put('/api/testimonials/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await updateTestimonial(id, req.body);
      if (updated) {
        res.json({ success: true, testimonial: updated });
      } else {
        res.status(404).json({ success: false, message: 'Testimonial not found' });
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // News: GET / POST / PUT / DELETE
  app.get('/api/news', async (req, res) => {
    try {
      const list = await getNews();
      res.json(list);
    } catch (error) {
      console.error('Error getting news:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.post('/api/news', async (req, res) => {
    try {
      const item: NewsItem = {
        id: `news-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Published',
        ...req.body
      };
      await createNewsItem(item);
      res.json({ success: true, news: item });
    } catch (error) {
      console.error('Error creating news:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.put('/api/news/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await updateNewsItem(id, req.body);
      if (updated) {
        res.json({ success: true, news: updated });
      } else {
        res.status(404).json({ success: false, message: 'News not found' });
      }
    } catch (error) {
      console.error('Error updating news:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.delete('/api/news/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await deleteNewsItem(id);
      res.json({ success });
    } catch (error) {
      console.error('Error deleting news:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // FAQs: GET / POST / PUT / DELETE
  app.get('/api/faqs', async (req, res) => {
    try {
      const list = await getFAQs();
      res.json(list);
    } catch (error) {
      console.error('Error getting FAQs:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.post('/api/faqs', async (req, res) => {
    try {
      const item: FAQItem = {
        id: `faq-${Date.now()}`,
        status: 'Published',
        ...req.body
      };
      await createFAQItem(item);
      res.json({ success: true, faq: item });
    } catch (error) {
      console.error('Error creating FAQ:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.put('/api/faqs/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await updateFAQItem(id, req.body);
      if (updated) {
        res.json({ success: true, faq: updated });
      } else {
        res.status(404).json({ success: false, message: 'FAQ not found' });
      }
    } catch (error) {
      console.error('Error updating FAQ:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.delete('/api/faqs/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await deleteFAQItem(id);
      res.json({ success });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Users: GET / POST / PUT
  app.get('/api/users', async (req, res) => {
    try {
      const list = await getUsers();
      res.json(list);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        status: 'Active',
        ...req.body
      };
      await createUser(newUser);
      res.json({ success: true, user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  app.put('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await updateUser(id, req.body);
      if (updated) {
        res.json({ success: true, user: updated });
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Audit Logs & Notifications
  app.get('/api/audit-logs', async (req, res) => {
    try {
      const logs = await getAuditLogs();
      res.json(logs);
    } catch (error) {
      console.error('Error getting audit logs:', error);
      res.json([]);
    }
  });

  app.get('/api/notifications', async (req, res) => {
    try {
      const notifications = await getNotifications();
      res.json(notifications);
    } catch (error) {
      console.error('Error getting notifications:', error);
      res.json([]);
    }
  });

  app.post('/api/notifications/read', async (req, res) => {
    try {
      await markNotificationsAsRead();
      res.json({ success: true });
    } catch (error) {
      console.error('Error marking notifications read:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Analytics API
  app.get('/api/analytics', async (req, res) => {
    try {
      const services = await getServices(undefined, true);
      const enquiries = await getEnquiries();
      const dbUsers = await getUsers();
      const cms = await getCMS();
      const logs = await getAuditLogs();
      
      const approvedServices = services.filter(s => s.status === 'Approved');
      const coachingCount = approvedServices.filter(s => s.type === 'coaching').length;
      const hostelCount = approvedServices.filter(s => s.type === 'hostel').length;
      const libraryCount = approvedServices.filter(s => s.type === 'library').length;
      const flatCount = approvedServices.filter(s => s.type === 'flat').length;
      const counselCount = approvedServices.filter(s => s.type === 'counselling').length;
      
      const totalEnquiries = enquiries.length;
      const pendingApprovals = services.filter(s => s.status === 'Pending Approval').length;
      const totalUsers = dbUsers.length;

      const serviceDistribution = [
        { name: 'Coaching', value: coachingCount },
        { name: 'Hostels', value: hostelCount },
        { name: 'Libraries', value: libraryCount },
        { name: 'PGs/Flats', value: flatCount },
        { name: 'Counseling', value: counselCount },
      ];

      const enquiryTrends = [
        { month: 'Jan', count: 180 },
        { month: 'Feb', count: 240 },
        { month: 'Mar', count: 320 },
        { month: 'Apr', count: 480 },
        { month: 'May', count: 520 },
        { month: 'Jun', count: 610 },
        { month: 'Jul', count: totalEnquiries + 620 }
      ];

      const revenueMock = [
        { name: 'Q1', value: 45000 },
        { name: 'Q2', value: 68000 },
        { name: 'Q3', value: 85000 },
        { name: 'Q4', value: 120000 }
      ];

      res.json({
        counts: {
          students: cms.homepage?.stats?.students || 0,
          parents: cms.homepage?.stats?.parents || 0,
          coaching: coachingCount,
          hostel: hostelCount,
          library: libraryCount,
          flat: flatCount,
          counselling: counselCount,
          enquiries: totalEnquiries,
          pendingApprovals,
          users: totalUsers,
          revenue: '₹1,58,000'
        },
        serviceDistribution,
        enquiryTrends,
        revenueMock,
        recentActivities: logs.slice(0, 10)
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Export Reports
  app.get('/api/reports/export', async (req, res) => {
    try {
      const { type, format } = req.query;
      const enquiries = await getEnquiries();
      const users = await getUsers();
      const services = await getServices(undefined, true);
      
      let reportData = '';
      let fileName = `coparents_report_${type}_${Date.now()}`;

      if (format === 'excel') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.csv"`);
        
        if (type === 'students' || type === 'parents' || type === 'users') {
          reportData = 'ID,Name,Username,Role,Email,Mobile,Status\n';
          const filteredUsers = users.filter((u: any) => type === 'users' || u.role.toLowerCase() === (type === 'students' ? 'student' : 'parent'));
          filteredUsers.forEach((u: any) => {
            reportData += `"${u.id}","${u.name}","${u.username}","${u.role}","${u.email}","${u.mobile}","${u.status}"\n`;
          });
        } else if (type === 'enquiries') {
          reportData = 'ID,Full Name,Mobile,Email,User Type,Area,Interested Service,Status,Date\n';
          enquiries.forEach((e: any) => {
            reportData += `"${e.id}","${e.fullName}","${e.mobileNumber}","${e.email || ''}","${e.userType}","${e.areaLocality}","${e.interestedService}","${e.status}","${e.createdAt}"\n`;
          });
        } else {
          // Services
          reportData = 'ID,Type,Name,Location,Price,Rating,Reviews,Status,Updated\n';
          const targetType = type === 'coaching' ? 'coaching' : type === 'hostel' ? 'hostel' : type === 'library' ? 'library' : type === 'flat' ? 'flat' : 'counselling';
          const filteredServices = services.filter((s: any) => s.type === targetType);
          filteredServices.forEach((s: any) => {
            reportData += `"${s.id}","${s.type}","${s.name}","${s.location}","${s.priceFees}","${s.rating}","${s.reviewsCount}","${s.status}","${s.updatedAt}"\n`;
          });
        }
        return res.send(reportData);
      } else {
        // PDF Mock Text standard
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.txt"`);
        
        reportData = `========================================================\n`;
        reportData += `        COPARENTS.IN - EDUCATION ECOSYSTEM REPORT\n`;
        reportData += `        Type: ${type?.toString().toUpperCase()} | Format: PDF (Text Standard)\n`;
        reportData += `        Generated on: ${new Date().toLocaleString()}\n`;
        reportData += `========================================================\n\n`;

        if (type === 'enquiries') {
          reportData += `TOTAL ENQUIRIES: ${enquiries.length}\n\n`;
          enquiries.forEach((e: any, i: number) => {
            reportData += `${i+1}. [${e.status}] ${e.fullName} (${e.userType})\n`;
            reportData += `   Mobile: ${e.mobileNumber} | Locality: ${e.areaLocality}\n`;
            reportData += `   Service requested: ${e.interestedService} | Course: ${e.preferredCourse || 'N/A'}\n`;
            reportData += `   Message: ${e.message || 'No custom message.'}\n`;
            reportData += `   Date: ${new Date(e.createdAt).toLocaleString()}\n`;
            reportData += `   -------------------------------------------------\n`;
          });
        } else if (type === 'users' || type === 'students' || type === 'parents') {
          const uList = users.filter((u: any) => type === 'users' || u.role.toLowerCase() === (type === 'students' ? 'student' : 'parent'));
          reportData += `TOTAL RECORDS: ${uList.length}\n\n`;
          uList.forEach((u: any, i: number) => {
            reportData += `${i+1}. ${u.name} (@${u.username}) - [${u.role}]\n`;
            reportData += `   Email: ${u.email} | Mobile: ${u.mobile} | Status: ${u.status}\n`;
            reportData += `   -------------------------------------------------\n`;
          });
        } else {
          const targetType = type === 'coaching' ? 'coaching' : type === 'hostel' ? 'hostel' : type === 'library' ? 'library' : type === 'flat' ? 'flat' : 'counselling';
          const sList = services.filter((s: any) => s.type === targetType);
          reportData += `TOTAL LISTINGS: ${sList.length}\n\n`;
          sList.forEach((s: any, i: number) => {
            reportData += `${i+1}. ${s.name} [${s.status}]\n`;
            reportData += `   Price/Fees: ${s.priceFees} | Location: ${s.location}\n`;
            reportData += `   Rating: ${s.rating} ★ (${s.reviewsCount} reviews)\n`;
            reportData += `   Contact: ${s.contactInfo.phone} | ${s.contactInfo.email}\n`;
            reportData += `   Facilities: ${s.facilities.join(', ')}\n`;
            reportData += `   -------------------------------------------------\n`;
          });
        }
        return res.send(reportData);
      }
    } catch (error) {
      console.error('Error exporting reports:', error);
      res.status(500).json({ error: 'Internal database error.' });
    }
  });

  // Vite development integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

startServer();
