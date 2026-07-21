import { Pool } from 'pg';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
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
  AuditLog,
  Notification
} from '../types';
import {
  initialUsers,
  initialServices,
  initialCarousel,
  initialTestimonials,
  initialNews,
  initialFAQs,
  initialWhatsApp,
  initialSocialLinks,
  initialCMS,
  initialEnquiries,
  initialAuditLogs
} from './seed-data.ts';

let pool: Pool | null = null;
let supabaseClient: SupabaseClient | null = null;
let dbInitialized = false;
let useFallbackMode = false;
let useSupabaseJsMode = false;
let usePgMode = false;
let dbStatusChecked = false;

// Robust In-Memory State Cache & Fallback (holds live state across requests in Node process)
const memUsers: User[] = JSON.parse(JSON.stringify(initialUsers));
const memServices: EducationService[] = JSON.parse(JSON.stringify(initialServices));
const memCarousel: CarouselSlide[] = JSON.parse(JSON.stringify(initialCarousel));
const memTestimonials: Testimonial[] = JSON.parse(JSON.stringify(initialTestimonials));
const memNews: NewsItem[] = JSON.parse(JSON.stringify(initialNews));
const memFAQs: FAQItem[] = JSON.parse(JSON.stringify(initialFAQs));
let memWhatsApp: WhatsAppConfig = JSON.parse(JSON.stringify(initialWhatsApp));
let memSocialLinks: SocialLink[] = JSON.parse(JSON.stringify(initialSocialLinks));
let memCMS: CMSConfig = JSON.parse(JSON.stringify(initialCMS));
const memEnquiries: Enquiry[] = JSON.parse(JSON.stringify(initialEnquiries));
const memAuditLogs: AuditLog[] = JSON.parse(JSON.stringify(initialAuditLogs));
const memNotifications: Notification[] = [];

// Lazy initialization of Supabase JS Client (Prefers SERVICE_ROLE_KEY for server-side RLS bypass)
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (url && key && url.trim() !== '' && key.trim() !== '') {
    supabaseClient = createClient(url, key);
    return supabaseClient;
  }
  return null;
}

// Lazy initialization of pg Pool
export function getPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'Supabase/PostgreSQL connection string is missing! ' +
      'Please declare SUPABASE_DB_URL or DATABASE_URL in your environment.'
    );
  }

  pool = new Pool({
    connectionString,
    ssl: (connectionString.includes('supabase') || connectionString.includes('render.com') || connectionString.includes('neon.tech'))
      ? { rejectUnauthorized: false }
      : undefined,
    max: 10,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 4000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err);
  });

  return pool;
}

// Check database connection and dynamically toggle operational mode
export async function testConnection(): Promise<boolean> {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

  // 1. Primary Check: Supabase HTTP REST API via @supabase/supabase-js (URL + ANON/SERVICE KEY)
  if (url && key && url.trim() !== '' && key.trim() !== '') {
    try {
      const client = getSupabaseClient();
      if (client) {
        const { error } = await client.from('users').select('id').limit(1);
        if (!error || error.code === 'PGRST116' || error.code === '42P01' || error.message.includes('relation') || error.message.includes('table')) {
          console.log('✅ Connected to Supabase via HTTP REST API (SUPABASE_URL + KEY)!');
          useSupabaseJsMode = true;
          usePgMode = false;
          useFallbackMode = false;
          dbStatusChecked = true;
          return true;
        } else {
          console.warn('⚠️ Supabase JS Client API test returned error:', error.message);
        }
      }
    } catch (e) {
      console.warn('⚠️ Supabase JS Client connection failed:', e instanceof Error ? e.message : e);
    }
  }

  // 2. Secondary Check: PostgreSQL Direct TCP Connection (SUPABASE_DB_URL)
  if (dbUrl && !dbUrl.startsWith('http://') && !dbUrl.startsWith('https://')) {
    try {
      const client = getPool();
      const res = await client.query('SELECT NOW()');
      if (res.rows.length > 0) {
        console.log('✅ Connected to Supabase PostgreSQL database via pg Pool!');
        usePgMode = true;
        useSupabaseJsMode = false;
        useFallbackMode = false;
        dbStatusChecked = true;
        return true;
      }
    } catch (error) {
      console.error('⚠️ PostgreSQL Connection Failed:', error instanceof Error ? error.message : error);
    }
  }

  console.warn('⚙️ Activating high-fidelity In-Memory Database Fallback Mode.');
  useFallbackMode = true;
  useSupabaseJsMode = false;
  usePgMode = false;
  dbStatusChecked = true;
  return false;
}

// Get current database operational mode
export function getDatabaseStatus() {
  return {
    useFallbackMode,
    useSupabaseJsMode,
    usePgMode,
    configured: !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_DB_URL || process.env.DATABASE_URL),
    connectionSuccessful: !useFallbackMode && dbStatusChecked,
    mode: useSupabaseJsMode ? 'Supabase REST API (URL + Key)' : usePgMode ? 'PostgreSQL Pool (pg)' : 'In-Memory Fallback',
  };
}

// Auto-run DDL migrations or seed default data if database is empty
export async function initializeDatabase(): Promise<void> {
  if (dbInitialized) return;
  
  if (!dbStatusChecked) {
    await testConnection();
  }

  if (useFallbackMode) {
    console.log('🌱 Seeded In-Memory fallback database is ready to handle operations.');
    dbInitialized = true;
    return;
  }

  if (useSupabaseJsMode && supabaseClient) {
    try {
      const { data } = await supabaseClient.from('users').select('id').limit(1);
      if (!data || data.length === 0) {
        console.log('🌱 Supabase database appears empty via REST API. Seeding initial data...');
        await supabaseClient.from('users').upsert(initialUsers).catch(e => console.warn('Supabase seed users error:', e.message));
        await supabaseClient.from('services').upsert(initialServices).catch(e => console.warn('Supabase seed services error:', e.message));
        await supabaseClient.from('carousel').upsert(initialCarousel).catch(e => console.warn('Supabase seed carousel error:', e.message));
        await supabaseClient.from('testimonials').upsert(initialTestimonials).catch(e => console.warn('Supabase seed testimonials error:', e.message));
        await supabaseClient.from('news').upsert(initialNews).catch(e => console.warn('Supabase seed news error:', e.message));
        await supabaseClient.from('faqs').upsert(initialFAQs).catch(e => console.warn('Supabase seed faqs error:', e.message));
        await supabaseClient.from('whatsapp_config').upsert({ id: 1, ...initialWhatsApp }).catch(e => console.warn('Supabase seed whatsapp error:', e.message));
        await supabaseClient.from('social_links').upsert(initialSocialLinks).catch(e => console.warn('Supabase seed social_links error:', e.message));
        await supabaseClient.from('cms_config').upsert({ id: 1, ...initialCMS }).catch(e => console.warn('Supabase seed cms_config error:', e.message));
        await supabaseClient.from('enquiries').upsert(initialEnquiries).catch(e => console.warn('Supabase seed enquiries error:', e.message));
        await supabaseClient.from('audit_logs').upsert(initialAuditLogs).catch(e => console.warn('Supabase seed audit_logs error:', e.message));
        console.log('🎉 Supabase REST API seeding completed!');
      }
    } catch (e) {
      console.warn('Note on Supabase REST seeding:', e);
    }
    dbInitialized = true;
    return;
  }

  if (usePgMode) {
    const client = getPool();
    try {
      console.log('🚀 Running database migrations / table checks via pg Pool...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT, role TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, mobile TEXT NOT NULL, "departmentId" TEXT, status TEXT NOT NULL
        );
        ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;
        CREATE TABLE IF NOT EXISTS services (
          id TEXT PRIMARY KEY, type TEXT NOT NULL, name TEXT NOT NULL, rating NUMERIC(3,2) NOT NULL, "reviewsCount" INTEGER NOT NULL, location TEXT NOT NULL, "priceFees" TEXT NOT NULL, "shortDescription" TEXT NOT NULL, "fullDescription" TEXT NOT NULL, images JSONB NOT NULL, "videoUrl" TEXT, facilities JSONB NOT NULL, courses JSONB, "contactInfo" JSONB NOT NULL, "isFeatured" BOOLEAN NOT NULL DEFAULT FALSE, status TEXT NOT NULL, "pendingChanges" JSONB, "rejectionRemarks" TEXT, "createdBy" TEXT NOT NULL, "updatedAt" TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS carousel (
          id TEXT PRIMARY KEY, image TEXT NOT NULL, title TEXT NOT NULL, subtitle TEXT NOT NULL, "buttonText" TEXT NOT NULL, "buttonLink" TEXT NOT NULL, status TEXT NOT NULL, "displayOrder" INTEGER NOT NULL, "videoUrl" TEXT
        );
        CREATE TABLE IF NOT EXISTS testimonials (
          id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, content TEXT NOT NULL, rating INTEGER NOT NULL, image TEXT NOT NULL, status TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS news (
          id TEXT PRIMARY KEY, title TEXT NOT NULL, content TEXT NOT NULL, date TEXT NOT NULL, image TEXT, status TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS faqs (
          id TEXT PRIMARY KEY, question TEXT NOT NULL, answer TEXT NOT NULL, status TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS whatsapp_config (
          id INTEGER PRIMARY KEY DEFAULT 1, "phoneNumber" TEXT NOT NULL, "defaultMessage" TEXT NOT NULL, "isEnabled" BOOLEAN NOT NULL
        );
        CREATE TABLE IF NOT EXISTS social_links (
          id TEXT PRIMARY KEY, platform TEXT NOT NULL, url TEXT NOT NULL, "isEnabled" BOOLEAN NOT NULL
        );
        CREATE TABLE IF NOT EXISTS cms_config (
          id INTEGER PRIMARY KEY DEFAULT 1, homepage JSONB NOT NULL, "aboutUs" JSONB NOT NULL, contact JSONB NOT NULL, "privacyPolicy" TEXT NOT NULL, "termsConditions" TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS enquiries (
          id TEXT PRIMARY KEY, "fullName" TEXT NOT NULL, "mobileNumber" TEXT NOT NULL, email TEXT, "userType" TEXT NOT NULL, city TEXT NOT NULL, "areaLocality" TEXT NOT NULL, "interestedService" TEXT NOT NULL, "preferredCourse" TEXT, message TEXT, status TEXT NOT NULL, "assignedToDepartment" TEXT, notes TEXT, "createdAt" TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS audit_logs (
          id TEXT PRIMARY KEY, "userId" TEXT NOT NULL, "userName" TEXT NOT NULL, "userRole" TEXT NOT NULL, action TEXT NOT NULL, details TEXT NOT NULL, timestamp TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS notifications (
          id TEXT PRIMARY KEY, "userId" TEXT, "roleTarget" TEXT, title TEXT NOT NULL, message TEXT NOT NULL, "isRead" BOOLEAN NOT NULL, "createdAt" TEXT NOT NULL
        );
      `);

      const userCountResult = await client.query('SELECT COUNT(*) FROM users');
      if (parseInt(userCountResult.rows[0].count, 10) === 0) {
        console.log('🌱 Database is empty! Seeding default data...');
        for (const u of initialUsers) {
          await client.query(`INSERT INTO users (id, username, role, name, email, mobile, "departmentId", status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [u.id, u.username, u.role, u.name, u.email, u.mobile, u.departmentId || null, u.status]);
        }
        for (const s of initialServices) {
          await client.query(`INSERT INTO services (id, type, name, rating, "reviewsCount", location, "priceFees", "shortDescription", "fullDescription", images, "videoUrl", facilities, courses, "contactInfo", "isFeatured", status, "createdBy", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`, [s.id, s.type, s.name, s.rating, s.reviewsCount, s.location, s.priceFees, s.shortDescription, s.fullDescription, JSON.stringify(s.images), s.videoUrl || null, JSON.stringify(s.facilities), s.courses ? JSON.stringify(s.courses) : null, JSON.stringify(s.contactInfo), s.isFeatured, s.status, s.createdBy, s.updatedAt]);
        }
        for (const c of initialCarousel) {
          await client.query(`INSERT INTO carousel (id, image, title, subtitle, "buttonText", "buttonLink", status, "displayOrder", "videoUrl") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [c.id, c.image, c.title, c.subtitle, c.buttonText, c.buttonLink, c.status, c.displayOrder, c.videoUrl || null]);
        }
        for (const t of initialTestimonials) {
          await client.query(`INSERT INTO testimonials (id, name, role, content, rating, image, status) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [t.id, t.name, t.role, t.content, t.rating, t.image, t.status]);
        }
        for (const n of initialNews) {
          await client.query(`INSERT INTO news (id, title, content, date, image, status) VALUES ($1, $2, $3, $4, $5, $6)`, [n.id, n.title, n.content, n.date, n.image || null, n.status]);
        }
        for (const f of initialFAQs) {
          await client.query(`INSERT INTO faqs (id, question, answer, status) VALUES ($1, $2, $3, $4)`, [f.id, f.question, f.answer, f.status]);
        }
        await client.query(`INSERT INTO whatsapp_config (id, "phoneNumber", "defaultMessage", "isEnabled") VALUES (1, $1, $2, $3) ON CONFLICT (id) DO NOTHING`, [initialWhatsApp.phoneNumber, initialWhatsApp.defaultMessage, initialWhatsApp.isEnabled]);
        for (const s of initialSocialLinks) {
          await client.query(`INSERT INTO social_links (id, platform, url, "isEnabled") VALUES ($1, $2, $3, $4)`, [s.id, s.platform, s.url, s.isEnabled]);
        }
        await client.query(`INSERT INTO cms_config (id, homepage, "aboutUs", contact, "privacyPolicy", "termsConditions") VALUES (1, $1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`, [JSON.stringify(initialCMS.homepage), JSON.stringify(initialCMS.aboutUs), JSON.stringify(initialCMS.contact), initialCMS.privacyPolicy, initialCMS.termsConditions]);
        for (const e of initialEnquiries) {
          await client.query(`INSERT INTO enquiries (id, "fullName", "mobileNumber", email, "userType", city, "areaLocality", "interestedService", "preferredCourse", message, status, "assignedToDepartment", notes, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`, [e.id, e.fullName, e.mobileNumber, e.email || null, e.userType, e.city, e.areaLocality, e.interestedService, e.preferredCourse || null, e.message || null, e.status, e.assignedToDepartment || null, e.notes || null, e.createdAt]);
        }
        for (const a of initialAuditLogs) {
          await client.query(`INSERT INTO audit_logs (id, "userId", "userName", "userRole", action, details, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [a.id, a.userId, a.userName, a.userRole, a.action, a.details, a.timestamp]);
        }
        console.log('🎉 PostgreSQL DB seeding complete!');
      }
      dbInitialized = true;
    } catch (error) {
      console.error('❌ Failed to run database initialization migrations:', error);
    }
  }
}

// ==========================================
// DB OPERATIONS REPOSITORY HELPER FUNCTIONS
// ==========================================

// USERS
export async function getUsers(): Promise<User[]> {
  await initializeDatabase();
  if (useFallbackMode) return memUsers;
  if (useSupabaseJsMode && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('users').select('*');
      if (!error && data && data.length > 0) {
        // Sync local cache
        data.forEach((u: any) => {
          const idx = memUsers.findIndex(m => m.id === u.id);
          if (idx >= 0) memUsers[idx] = u;
          else memUsers.push(u);
        });
        return data as User[];
      }
      // Auto-seed to Supabase if table is empty or missing
      await supabaseClient.from('users').upsert(initialUsers).catch(() => {});
    } catch (e) {
      console.warn('Could not fetch users from Supabase REST API, falling back to seed data:', e);
    }
    return memUsers;
  }
  if (usePgMode) {
    const res = await getPool().query('SELECT * FROM users').catch(() => ({ rows: [] }));
    return res.rows.length > 0 ? res.rows : memUsers;
  }
  return memUsers;
}

export async function createUser(user: User): Promise<User> {
  await initializeDatabase();
  const existing = memUsers.findIndex(u => u.id === user.id);
  if (existing >= 0) memUsers[existing] = user;
  else memUsers.push(user);

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('users').upsert(user);
    if (error) console.warn('⚠️ Supabase createUser warning:', error.message);
  } else if (usePgMode) {
    await getPool().query(
      `INSERT INTO users (id, username, password, role, name, email, mobile, "departmentId", status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET username=$2, password=$3, role=$4, name=$5, email=$6, mobile=$7, "departmentId"=$8, status=$9`,
      [user.id, user.username, user.password || null, user.role, user.name, user.email, user.mobile, user.departmentId || null, user.status]
    ).catch(e => console.warn('⚠️ pg createUser error:', e));
  }
  return user;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  await initializeDatabase();
  const idx = memUsers.findIndex(u => u.id === id);
  if (idx !== -1) {
    memUsers[idx] = { ...memUsers[idx], ...updates };
  }

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('users').update(updates).eq('id', id);
    if (error) console.warn('⚠️ Supabase updateUser warning:', error.message);
  } else if (usePgMode) {
    const current = await getPool().query('SELECT * FROM users WHERE id = $1', [id]).catch(() => ({ rows: [] }));
    if (current.rows.length > 0) {
      const updated = { ...current.rows[0], ...updates };
      await getPool().query(
        `UPDATE users SET username = $1, password = $2, role = $3, name = $4, email = $5, mobile = $6, "departmentId" = $7, status = $8 WHERE id = $9`,
        [updated.username, updated.password || null, updated.role, updated.name, updated.email, updated.mobile, updated.departmentId, updated.status, id]
      ).catch(e => console.warn('⚠️ pg updateUser error:', e));
    }
  }
  return idx !== -1 ? memUsers[idx] : null;
}

// SERVICES
export async function getServices(createdBy?: string, includePending?: boolean): Promise<EducationService[]> {
  await initializeDatabase();
  if (useFallbackMode) {
    let list = memServices;
    if (createdBy) {
      list = list.filter(s => s.createdBy === createdBy);
    } else if (!includePending) {
      list = list.filter(s => s.status === 'Approved');
    }
    return list;
  }
  if (useSupabaseJsMode && supabaseClient) {
    try {
      let query = supabaseClient.from('services').select('*');
      if (createdBy) {
        query = query.eq('createdBy', createdBy);
      } else if (!includePending) {
        query = query.eq('status', 'Approved');
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const parsed = (data || []).map((row: any) => ({
          ...row,
          rating: parseFloat(row.rating),
          images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
          facilities: typeof row.facilities === 'string' ? JSON.parse(row.facilities) : row.facilities,
          courses: row.courses ? (typeof row.courses === 'string' ? JSON.parse(row.courses) : row.courses) : undefined,
          contactInfo: typeof row.contactInfo === 'string' ? JSON.parse(row.contactInfo) : row.contactInfo,
          pendingChanges: row.pendingChanges ? (typeof row.pendingChanges === 'string' ? JSON.parse(row.pendingChanges) : row.pendingChanges) : undefined,
        }));
        // Sync local cache
        parsed.forEach(p => {
          const idx = memServices.findIndex(m => m.id === p.id);
          if (idx >= 0) memServices[idx] = p;
          else memServices.push(p);
        });
        return parsed;
      }
      await supabaseClient.from('services').upsert(initialServices).catch(() => {});
    } catch (e) {
      console.warn('Supabase services fetch error:', e);
    }
    let list = memServices;
    if (createdBy) {
      list = list.filter(s => s.createdBy === createdBy);
    } else if (!includePending) {
      list = list.filter(s => s.status === 'Approved');
    }
    return list;
  }
  
  if (usePgMode) {
    let query = 'SELECT * FROM services';
    const params: any[] = [];
    if (createdBy) {
      query += ' WHERE "createdBy" = $1';
      params.push(createdBy);
    } else if (!includePending) {
      query += " WHERE status = 'Approved'";
    }
    const res = await getPool().query(query, params).catch(() => ({ rows: [] }));
    if (res.rows.length > 0) {
      return res.rows.map(row => ({
        ...row,
        rating: parseFloat(row.rating),
        images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
        facilities: typeof row.facilities === 'string' ? JSON.parse(row.facilities) : row.facilities,
        courses: row.courses ? (typeof row.courses === 'string' ? JSON.parse(row.courses) : row.courses) : undefined,
        contactInfo: typeof row.contactInfo === 'string' ? JSON.parse(row.contactInfo) : row.contactInfo,
        pendingChanges: row.pendingChanges ? (typeof row.pendingChanges === 'string' ? JSON.parse(row.pendingChanges) : row.pendingChanges) : undefined,
      }));
    }
  }

  let list = memServices;
  if (createdBy) {
    list = list.filter(s => s.createdBy === createdBy);
  } else if (!includePending) {
    list = list.filter(s => s.status === 'Approved');
  }
  return list;
}

export async function getServiceById(id: string): Promise<EducationService | null> {
  await initializeDatabase();
  const memMatch = memServices.find(item => item.id === id);

  if (useSupabaseJsMode && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('services').select('*').eq('id', id).single();
      if (!error && data) {
        return {
          ...data,
          rating: parseFloat(data.rating),
          images: typeof data.images === 'string' ? JSON.parse(data.images) : data.images,
          facilities: typeof data.facilities === 'string' ? JSON.parse(data.facilities) : data.facilities,
          courses: data.courses ? (typeof data.courses === 'string' ? JSON.parse(data.courses) : data.courses) : undefined,
          contactInfo: typeof data.contactInfo === 'string' ? JSON.parse(data.contactInfo) : data.contactInfo,
          pendingChanges: data.pendingChanges ? (typeof data.pendingChanges === 'string' ? JSON.parse(data.pendingChanges) : data.pendingChanges) : undefined,
        };
      }
    } catch (e) {
      console.warn('getServiceById fetch warning:', e);
    }
    return memMatch || null;
  }

  if (usePgMode) {
    const res = await getPool().query('SELECT * FROM services WHERE id = $1', [id]).catch(() => ({ rows: [] }));
    if (res.rows.length > 0) {
      const row = res.rows[0];
      return {
        ...row,
        rating: parseFloat(row.rating),
        images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
        facilities: typeof row.facilities === 'string' ? JSON.parse(row.facilities) : row.facilities,
        courses: row.courses ? (typeof row.courses === 'string' ? JSON.parse(row.courses) : row.courses) : undefined,
        contactInfo: typeof row.contactInfo === 'string' ? JSON.parse(row.contactInfo) : row.contactInfo,
        pendingChanges: row.pendingChanges ? (typeof row.pendingChanges === 'string' ? JSON.parse(row.pendingChanges) : row.pendingChanges) : undefined,
      };
    }
  }

  return memMatch || null;
}

export async function createService(service: EducationService): Promise<EducationService> {
  await initializeDatabase();
  const existing = memServices.findIndex(s => s.id === service.id);
  if (existing >= 0) memServices[existing] = service;
  else memServices.unshift(service);

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('services').upsert(service);
    if (error) console.warn('⚠️ Supabase createService warning:', error.message);
  } else if (usePgMode) {
    await getPool().query(
      `INSERT INTO services (id, type, name, rating, "reviewsCount", location, "priceFees", "shortDescription", "fullDescription", images, "videoUrl", facilities, courses, "contactInfo", "isFeatured", status, "createdBy", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       ON CONFLICT (id) DO UPDATE SET name=$3, rating=$4, "reviewsCount"=$5, location=$6, "priceFees"=$7, "shortDescription"=$8, "fullDescription"=$9, images=$10, "videoUrl"=$11, facilities=$12, courses=$13, "contactInfo"=$14, "isFeatured"=$15, status=$16, "createdBy"=$17, "updatedAt"=$18`,
      [
        service.id, service.type, service.name, service.rating, service.reviewsCount, service.location, service.priceFees,
        service.shortDescription, service.fullDescription, JSON.stringify(service.images), service.videoUrl || null,
        JSON.stringify(service.facilities), service.courses ? JSON.stringify(service.courses) : null,
        JSON.stringify(service.contactInfo), service.isFeatured, service.status, service.createdBy, service.updatedAt
      ]
    ).catch(e => console.warn('⚠️ pg createService error:', e));
  }
  return service;
}

export async function updateService(id: string, updates: Partial<EducationService>): Promise<EducationService | null> {
  await initializeDatabase();
  const idx = memServices.findIndex(item => item.id === id);
  if (idx !== -1) {
    memServices[idx] = { ...memServices[idx], ...updates };
  }

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('services').update(updates).eq('id', id);
    if (error) console.warn('⚠️ Supabase updateService warning:', error.message);
  } else if (usePgMode) {
    const current = await getServiceById(id);
    if (current) {
      const updated = { ...current, ...updates };
      await getPool().query(
        `UPDATE services SET name = $1, rating = $2, "reviewsCount" = $3, location = $4, "priceFees" = $5, "shortDescription" = $6, "fullDescription" = $7, images = $8, "videoUrl" = $9, facilities = $10, courses = $11, "contactInfo" = $12, "isFeatured" = $13, status = $14, "pendingChanges" = $15, "rejectionRemarks" = $16, "createdBy" = $17, "updatedAt" = $18 WHERE id = $19`,
        [
          updated.name, updated.rating, updated.reviewsCount, updated.location, updated.priceFees,
          updated.shortDescription, updated.fullDescription, JSON.stringify(updated.images), updated.videoUrl || null,
          JSON.stringify(updated.facilities), updated.courses ? JSON.stringify(updated.courses) : null,
          JSON.stringify(updated.contactInfo), updated.isFeatured, updated.status,
          updated.pendingChanges ? JSON.stringify(updated.pendingChanges) : null,
          updated.rejectionRemarks || null, updated.createdBy, updated.updatedAt, id
        ]
      ).catch(e => console.warn('⚠️ pg updateService error:', e));
    }
  }
  return idx !== -1 ? memServices[idx] : null;
}

export async function deleteService(id: string): Promise<boolean> {
  await initializeDatabase();
  const idx = memServices.findIndex(item => item.id === id);
  if (idx !== -1) memServices.splice(idx, 1);

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('services').delete().eq('id', id);
    if (error) console.warn('⚠️ Supabase deleteService warning:', error.message);
  } else if (usePgMode) {
    await getPool().query('DELETE FROM services WHERE id = $1', [id]).catch(e => console.warn('⚠️ pg deleteService error:', e));
  }
  return idx !== -1;
}

// CAROUSEL SLIDES
export async function getCarousel(): Promise<CarouselSlide[]> {
  await initializeDatabase();
  if (useFallbackMode) return [...memCarousel].sort((a, b) => a.displayOrder - b.displayOrder);
  if (useSupabaseJsMode && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('carousel').select('*').order('displayOrder', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as CarouselSlide[];
      }
      await supabaseClient.from('carousel').upsert(initialCarousel).catch(() => {});
    } catch (e) {
      console.warn('Supabase carousel fetch error:', e);
    }
    return [...memCarousel].sort((a, b) => a.displayOrder - b.displayOrder);
  }
  if (usePgMode) {
    const res = await getPool().query('SELECT * FROM carousel ORDER BY "displayOrder" ASC').catch(() => ({ rows: [] }));
    return res.rows.length > 0 ? res.rows : [...memCarousel].sort((a, b) => a.displayOrder - b.displayOrder);
  }
  return [...memCarousel].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function createCarouselSlide(slide: CarouselSlide): Promise<CarouselSlide> {
  await initializeDatabase();
  const idx = memCarousel.findIndex(s => s.id === slide.id);
  if (idx >= 0) memCarousel[idx] = slide;
  else memCarousel.push(slide);

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('carousel').upsert(slide);
    if (error) console.warn('⚠️ Supabase createCarouselSlide warning:', error.message);
  } else if (usePgMode) {
    await getPool().query(
      `INSERT INTO carousel (id, image, title, subtitle, "buttonText", "buttonLink", status, "displayOrder", "videoUrl")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET image=$2, title=$3, subtitle=$4, "buttonText"=$5, "buttonLink"=$6, status=$7, "displayOrder"=$8, "videoUrl"=$9`,
      [slide.id, slide.image, slide.title, slide.subtitle, slide.buttonText, slide.buttonLink, slide.status, slide.displayOrder, slide.videoUrl || null]
    ).catch(e => console.warn('⚠️ pg createCarouselSlide error:', e));
  }
  return slide;
}

export async function updateCarouselSlide(id: string, updates: Partial<CarouselSlide>): Promise<CarouselSlide | null> {
  await initializeDatabase();
  const idx = memCarousel.findIndex(item => item.id === id);
  if (idx !== -1) {
    memCarousel[idx] = { ...memCarousel[idx], ...updates };
  }

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('carousel').update(updates).eq('id', id);
    if (error) console.warn('⚠️ Supabase updateCarouselSlide warning:', error.message);
  } else if (usePgMode) {
    const res = await getPool().query('SELECT * FROM carousel WHERE id = $1', [id]).catch(() => ({ rows: [] }));
    if (res.rows.length > 0) {
      const updated = { ...res.rows[0], ...updates };
      await getPool().query(
        `UPDATE carousel SET image = $1, title = $2, subtitle = $3, "buttonText" = $4, "buttonLink" = $5, status = $6, "displayOrder" = $7, "videoUrl" = $8 WHERE id = $9`,
        [updated.image, updated.title, updated.subtitle, updated.buttonText, updated.buttonLink, updated.status, updated.displayOrder, updated.videoUrl || null, id]
      ).catch(e => console.warn('⚠️ pg updateCarouselSlide error:', e));
    }
  }
  return idx !== -1 ? memCarousel[idx] : null;
}

export async function deleteCarouselSlide(id: string): Promise<boolean> {
  await initializeDatabase();
  const idx = memCarousel.findIndex(item => item.id === id);
  if (idx !== -1) memCarousel.splice(idx, 1);

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('carousel').delete().eq('id', id);
    if (error) console.warn('⚠️ Supabase deleteCarouselSlide warning:', error.message);
  } else if (usePgMode) {
    await getPool().query('DELETE FROM carousel WHERE id = $1', [id]).catch(e => console.warn('⚠️ pg deleteCarouselSlide error:', e));
  }
  return idx !== -1;
}

// TESTIMONIALS
export async function getTestimonials(): Promise<Testimonial[]> {
  await initializeDatabase();
  if (useFallbackMode) return memTestimonials;
  if (useSupabaseJsMode && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('testimonials').select('*');
      if (!error && data && data.length > 0) return data as Testimonial[];
      await supabaseClient.from('testimonials').upsert(initialTestimonials).catch(() => {});
    } catch (e) {
      console.warn('Supabase testimonials fetch error:', e);
    }
    return memTestimonials;
  }
  if (usePgMode) {
    const res = await getPool().query('SELECT * FROM testimonials').catch(() => ({ rows: [] }));
    return res.rows.length > 0 ? res.rows : memTestimonials;
  }
  return memTestimonials;
}

export async function createTestimonial(t: Testimonial): Promise<Testimonial> {
  await initializeDatabase();
  const idx = memTestimonials.findIndex(item => item.id === t.id);
  if (idx >= 0) memTestimonials[idx] = t;
  else memTestimonials.push(t);

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('testimonials').upsert(t);
    if (error) console.warn('⚠️ Supabase createTestimonial warning:', error.message);
  } else if (usePgMode) {
    await getPool().query(
      `INSERT INTO testimonials (id, name, role, content, rating, image, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET name=$2, role=$3, content=$4, rating=$5, image=$6, status=$7`,
      [t.id, t.name, t.role, t.content, t.rating, t.image, t.status]
    ).catch(e => console.warn('⚠️ pg createTestimonial error:', e));
  }
  return t;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> {
  await initializeDatabase();
  const idx = memTestimonials.findIndex(item => item.id === id);
  if (idx !== -1) {
    memTestimonials[idx] = { ...memTestimonials[idx], ...updates };
  }

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('testimonials').update(updates).eq('id', id);
    if (error) console.warn('⚠️ Supabase updateTestimonial warning:', error.message);
  } else if (usePgMode) {
    const res = await getPool().query('SELECT * FROM testimonials WHERE id = $1', [id]).catch(() => ({ rows: [] }));
    if (res.rows.length > 0) {
      const updated = { ...res.rows[0], ...updates };
      await getPool().query(
        `UPDATE testimonials SET name = $1, role = $2, content = $3, rating = $4, image = $5, status = $6 WHERE id = $7`,
        [updated.name, updated.role, updated.content, updated.rating, updated.image, updated.status, id]
      ).catch(e => console.warn('⚠️ pg updateTestimonial error:', e));
    }
  }
  return idx !== -1 ? memTestimonials[idx] : null;
}

// NEWS
export async function getNews(): Promise<NewsItem[]> {
  await initializeDatabase();
  if (useFallbackMode) return [...memNews].sort((a, b) => b.id.localeCompare(a.id));
  if (useSupabaseJsMode && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('news').select('*').order('id', { ascending: false });
      if (!error && data && data.length > 0) return data as NewsItem[];
      await supabaseClient.from('news').upsert(initialNews).catch(() => {});
    } catch (e) {
      console.warn('Supabase news fetch error:', e);
    }
    return [...memNews].sort((a, b) => b.id.localeCompare(a.id));
  }
  if (usePgMode) {
    const res = await getPool().query('SELECT * FROM news ORDER BY id DESC').catch(() => ({ rows: [] }));
    return res.rows.length > 0 ? res.rows : [...memNews].sort((a, b) => b.id.localeCompare(a.id));
  }
  return [...memNews].sort((a, b) => b.id.localeCompare(a.id));
}

export async function createNewsItem(item: NewsItem): Promise<NewsItem> {
  await initializeDatabase();
  const idx = memNews.findIndex(n => n.id === item.id);
  if (idx >= 0) memNews[idx] = item;
  else memNews.unshift(item);

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('news').upsert(item);
    if (error) console.warn('⚠️ Supabase createNewsItem warning:', error.message);
  } else if (usePgMode) {
    await getPool().query(
      `INSERT INTO news (id, title, content, date, image, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET title=$2, content=$3, date=$4, image=$5, status=$6`,
      [item.id, item.title, item.content, item.date, item.image || null, item.status]
    ).catch(e => console.warn('⚠️ pg createNewsItem error:', e));
  }
  return item;
}

export async function updateNewsItem(id: string, updates: Partial<NewsItem>): Promise<NewsItem | null> {
  await initializeDatabase();
  const idx = memNews.findIndex(item => item.id === id);
  if (idx !== -1) {
    memNews[idx] = { ...memNews[idx], ...updates };
  }

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('news').update(updates).eq('id', id);
    if (error) console.warn('⚠️ Supabase updateNewsItem warning:', error.message);
  } else if (usePgMode) {
    const res = await getPool().query('SELECT * FROM news WHERE id = $1', [id]).catch(() => ({ rows: [] }));
    if (res.rows.length > 0) {
      const updated = { ...res.rows[0], ...updates };
      await getPool().query(
        `UPDATE news SET title = $1, content = $2, date = $3, image = $4, status = $5 WHERE id = $6`,
        [updated.title, updated.content, updated.date, updated.image || null, updated.status, id]
      ).catch(e => console.warn('⚠️ pg updateNewsItem error:', e));
    }
  }
  return idx !== -1 ? memNews[idx] : null;
}

export async function deleteNewsItem(id: string): Promise<boolean> {
  await initializeDatabase();
  const idx = memNews.findIndex(item => item.id === id);
  if (idx !== -1) memNews.splice(idx, 1);

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('news').delete().eq('id', id);
    if (error) console.warn('⚠️ Supabase deleteNewsItem warning:', error.message);
  } else if (usePgMode) {
    await getPool().query('DELETE FROM news WHERE id = $1', [id]).catch(e => console.warn('⚠️ pg deleteNewsItem error:', e));
  }
  return idx !== -1;
}

// FAQS
export async function getFAQs(): Promise<FAQItem[]> {
  await initializeDatabase();
  if (useFallbackMode) return memFAQs;
  if (useSupabaseJsMode && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('faqs').select('*');
      if (!error && data && data.length > 0) return data as FAQItem[];
      await supabaseClient.from('faqs').upsert(initialFAQs).catch(() => {});
    } catch (e) {
      console.warn('Supabase faqs fetch error:', e);
    }
    return memFAQs;
  }
  if (usePgMode) {
    const res = await getPool().query('SELECT * FROM faqs').catch(() => ({ rows: [] }));
    return res.rows.length > 0 ? res.rows : memFAQs;
  }
  return memFAQs;
}

export async function createFAQItem(item: FAQItem): Promise<FAQItem> {
  await initializeDatabase();
  const idx = memFAQs.findIndex(f => f.id === item.id);
  if (idx >= 0) memFAQs[idx] = item;
  else memFAQs.push(item);

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('faqs').upsert(item);
    if (error) console.warn('⚠️ Supabase createFAQItem warning:', error.message);
  } else if (usePgMode) {
    await getPool().query(
      `INSERT INTO faqs (id, question, answer, status)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET question=$2, answer=$3, status=$4`,
      [item.id, item.question, item.answer, item.status]
    ).catch(e => console.warn('⚠️ pg createFAQItem error:', e));
  }
  return item;
}

export async function updateFAQItem(id: string, updates: Partial<FAQItem>): Promise<FAQItem | null> {
  await initializeDatabase();
  const idx = memFAQs.findIndex(item => item.id === id);
  if (idx !== -1) {
    memFAQs[idx] = { ...memFAQs[idx], ...updates };
  }

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('faqs').update(updates).eq('id', id);
    if (error) console.warn('⚠️ Supabase updateFAQItem warning:', error.message);
  } else if (usePgMode) {
    const res = await getPool().query('SELECT * FROM faqs WHERE id = $1', [id]).catch(() => ({ rows: [] }));
    if (res.rows.length > 0) {
      const updated = { ...res.rows[0], ...updates };
      await getPool().query(
        `UPDATE faqs SET question = $1, answer = $2, status = $3 WHERE id = $4`,
        [updated.question, updated.answer, updated.status, id]
      ).catch(e => console.warn('⚠️ pg updateFAQItem error:', e));
    }
  }
  return idx !== -1 ? memFAQs[idx] : null;
}

export async function deleteFAQItem(id: string): Promise<boolean> {
  await initializeDatabase();
  const idx = memFAQs.findIndex(item => item.id === id);
  if (idx !== -1) memFAQs.splice(idx, 1);

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('faqs').delete().eq('id', id);
    if (error) console.warn('⚠️ Supabase deleteFAQItem warning:', error.message);
  } else if (usePgMode) {
    await getPool().query('DELETE FROM faqs WHERE id = $1', [id]).catch(e => console.warn('⚠️ pg deleteFAQItem error:', e));
  }
  return idx !== -1;
}

// WHATSAPP CONFIG
export async function getWhatsApp(): Promise<WhatsAppConfig> {
  await initializeDatabase();
  if (useFallbackMode) return memWhatsApp;
  if (useSupabaseJsMode && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('whatsapp_config').select('*').eq('id', 1).single();
      if (!error && data) return data as WhatsAppConfig;
    } catch (e) {
      console.warn('Supabase whatsapp fetch error:', e);
    }
    return memWhatsApp;
  }
  if (usePgMode) {
    const res = await getPool().query('SELECT * FROM whatsapp_config WHERE id = 1').catch(() => ({ rows: [] }));
    if (res.rows.length > 0) return res.rows[0];
  }
  return memWhatsApp;
}

export async function updateWhatsApp(updates: Partial<WhatsAppConfig>): Promise<WhatsAppConfig> {
  await initializeDatabase();
  memWhatsApp = { ...memWhatsApp, ...updates };

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('whatsapp_config').upsert({ id: 1, ...memWhatsApp });
    if (error) console.warn('⚠️ Supabase updateWhatsApp warning:', error.message);
  } else if (usePgMode) {
    await getPool().query(
      `INSERT INTO whatsapp_config (id, "phoneNumber", "defaultMessage", "isEnabled")
       VALUES (1, $1, $2, $3)
       ON CONFLICT (id) DO UPDATE 
       SET "phoneNumber" = EXCLUDED."phoneNumber", "defaultMessage" = EXCLUDED."defaultMessage", "isEnabled" = EXCLUDED."isEnabled"`,
      [memWhatsApp.phoneNumber, memWhatsApp.defaultMessage, memWhatsApp.isEnabled]
    ).catch(e => console.warn('⚠️ pg updateWhatsApp error:', e));
  }
  return memWhatsApp;
}

// SOCIAL LINKS
export async function getSocialLinks(): Promise<SocialLink[]> {
  await initializeDatabase();
  if (useFallbackMode) return memSocialLinks;
  if (useSupabaseJsMode && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('social_links').select('*');
      if (!error && data && data.length > 0) return data as SocialLink[];
    } catch (e) {
      console.warn('Supabase social_links fetch error:', e);
    }
    return memSocialLinks;
  }
  if (usePgMode) {
    const res = await getPool().query('SELECT * FROM social_links').catch(() => ({ rows: [] }));
    if (res.rows.length > 0) return res.rows;
  }
  return memSocialLinks;
}

export async function updateSocialLinks(links: SocialLink[]): Promise<SocialLink[]> {
  await initializeDatabase();
  memSocialLinks = [...links];

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('social_links').upsert(links);
    if (error) console.warn('⚠️ Supabase updateSocialLinks warning:', error.message);
  } else if (usePgMode) {
    const client = getPool();
    await client.query('DELETE FROM social_links').catch(() => {});
    for (const s of links) {
      await client.query(
        `INSERT INTO social_links (id, platform, url, "isEnabled")
         VALUES ($1, $2, $3, $4)`,
        [s.id, s.platform, s.url, s.isEnabled]
      ).catch(e => console.warn('⚠️ pg updateSocialLinks error:', e));
    }
  }
  return links;
}

// CMS CONFIG
export async function getCMS(): Promise<CMSConfig> {
  await initializeDatabase();
  if (useFallbackMode) return memCMS;
  if (useSupabaseJsMode && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('cms_config').select('*').eq('id', 1).single();
      if (!error && data) {
        return {
          homepage: typeof data.homepage === 'string' ? JSON.parse(data.homepage) : data.homepage,
          aboutUs: typeof data.aboutUs === 'string' ? JSON.parse(data.aboutUs) : data.aboutUs,
          contact: typeof data.contact === 'string' ? JSON.parse(data.contact) : data.contact,
          privacyPolicy: data.privacyPolicy,
          termsConditions: data.termsConditions
        };
      }
    } catch (e) {
      console.warn('Supabase getCMS fetch error:', e);
    }
    return memCMS;
  }
  if (usePgMode) {
    const res = await getPool().query('SELECT * FROM cms_config WHERE id = 1').catch(() => ({ rows: [] }));
    if (res.rows.length > 0) {
      const row = res.rows[0];
      return {
        homepage: typeof row.homepage === 'string' ? JSON.parse(row.homepage) : row.homepage,
        aboutUs: typeof row.aboutUs === 'string' ? JSON.parse(row.aboutUs) : row.aboutUs,
        contact: typeof row.contact === 'string' ? JSON.parse(row.contact) : row.contact,
        privacyPolicy: row.privacyPolicy,
        termsConditions: row.termsConditions
      };
    }
  }
  return memCMS;
}

export async function updateCMS(updates: Partial<CMSConfig>): Promise<CMSConfig> {
  await initializeDatabase();
  memCMS = {
    homepage: updates.homepage ? { ...memCMS.homepage, ...updates.homepage } : memCMS.homepage,
    aboutUs: updates.aboutUs ? { ...memCMS.aboutUs, ...updates.aboutUs } : memCMS.aboutUs,
    contact: updates.contact ? { ...memCMS.contact, ...updates.contact } : memCMS.contact,
    privacyPolicy: updates.privacyPolicy !== undefined ? updates.privacyPolicy : memCMS.privacyPolicy,
    termsConditions: updates.termsConditions !== undefined ? updates.termsConditions : memCMS.termsConditions,
  };

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('cms_config').upsert({ id: 1, ...memCMS });
    if (error) console.warn('⚠️ Supabase updateCMS warning:', error.message);
  } else if (usePgMode) {
    await getPool().query(
      `INSERT INTO cms_config (id, homepage, "aboutUs", contact, "privacyPolicy", "termsConditions")
       VALUES (1, $1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE 
       SET homepage = EXCLUDED.homepage, "aboutUs" = EXCLUDED."aboutUs", contact = EXCLUDED.contact, 
           "privacyPolicy" = EXCLUDED."privacyPolicy", "termsConditions" = EXCLUDED."termsConditions"`,
      [
        JSON.stringify(memCMS.homepage),
        JSON.stringify(memCMS.aboutUs),
        JSON.stringify(memCMS.contact),
        memCMS.privacyPolicy,
        memCMS.termsConditions
      ]
    ).catch(e => console.warn('⚠️ pg updateCMS error:', e));
  }
  return memCMS;
}

// ENQUIRIES
export async function getEnquiries(): Promise<Enquiry[]> {
  await initializeDatabase();
  if (useFallbackMode) return [...memEnquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (useSupabaseJsMode && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('enquiries').select('*').order('createdAt', { ascending: false });
      if (!error && data && data.length > 0) return data as Enquiry[];
    } catch (e) {
      console.warn('Supabase enquiries fetch error:', e);
    }
    return [...memEnquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  if (usePgMode) {
    const res = await getPool().query('SELECT * FROM enquiries ORDER BY "createdAt" DESC').catch(() => ({ rows: [] }));
    if (res.rows.length > 0) return res.rows;
  }
  return [...memEnquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createEnquiry(e: Enquiry): Promise<Enquiry> {
  await initializeDatabase();
  const idx = memEnquiries.findIndex(item => item.id === e.id);
  if (idx >= 0) memEnquiries[idx] = e;
  else memEnquiries.unshift(e);

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('enquiries').upsert(e);
    if (error) console.warn('⚠️ Supabase createEnquiry warning:', error.message);
  } else if (usePgMode) {
    await getPool().query(
      `INSERT INTO enquiries (id, "fullName", "mobileNumber", email, "userType", city, "areaLocality", "interestedService", "preferredCourse", message, status, "assignedToDepartment", notes, "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       ON CONFLICT (id) DO UPDATE SET "fullName"=$2, "mobileNumber"=$3, email=$4, "userType"=$5, city=$6, "areaLocality"=$7, "interestedService"=$8, "preferredCourse"=$9, message=$10, status=$11, "assignedToDepartment"=$12, notes=$13`,
      [
        e.id, e.fullName, e.mobileNumber, e.email || null, e.userType, e.city, e.areaLocality,
        e.interestedService, e.preferredCourse || null, e.message || null, e.status,
        e.assignedToDepartment || null, e.notes || null, e.createdAt
      ]
    ).catch(e => console.warn('⚠️ pg createEnquiry error:', e));
  }
  return e;
}

export async function updateEnquiry(id: string, updates: Partial<Enquiry>): Promise<Enquiry | null> {
  await initializeDatabase();
  const idx = memEnquiries.findIndex(item => item.id === id);
  if (idx !== -1) {
    memEnquiries[idx] = { ...memEnquiries[idx], ...updates };
  }

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('enquiries').update(updates).eq('id', id);
    if (error) console.warn('⚠️ Supabase updateEnquiry warning:', error.message);
  } else if (usePgMode) {
    const res = await getPool().query('SELECT * FROM enquiries WHERE id = $1', [id]).catch(() => ({ rows: [] }));
    if (res.rows.length > 0) {
      const updated = { ...res.rows[0], ...updates };
      await getPool().query(
        `UPDATE enquiries SET "fullName" = $1, "mobileNumber" = $2, email = $3, "userType" = $4, city = $5, "areaLocality" = $6, "interestedService" = $7, "preferredCourse" = $8, message = $9, status = $10, "assignedToDepartment" = $11, notes = $12 WHERE id = $13`,
        [
          updated.fullName, updated.mobileNumber, updated.email || null, updated.userType, updated.city, updated.areaLocality,
          updated.interestedService, updated.preferredCourse || null, updated.message || null, updated.status,
          updated.assignedToDepartment || null, updated.notes || null, id
        ]
      ).catch(e => console.warn('⚠️ pg updateEnquiry error:', e));
    }
  }
  return idx !== -1 ? memEnquiries[idx] : null;
}

// AUDIT LOGS
export async function getAuditLogs(): Promise<AuditLog[]> {
  await initializeDatabase();
  if (useFallbackMode) return [...memAuditLogs].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  if (useSupabaseJsMode && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('audit_logs').select('*').order('timestamp', { ascending: false });
      if (!error && data && data.length > 0) return data as AuditLog[];
    } catch (e) {
      console.warn('Supabase audit_logs fetch error:', e);
    }
    return [...memAuditLogs].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }
  if (usePgMode) {
    const res = await getPool().query('SELECT * FROM audit_logs ORDER BY timestamp DESC').catch(() => ({ rows: [] }));
    if (res.rows.length > 0) return res.rows;
  }
  return [...memAuditLogs].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export async function createAuditLog(log: AuditLog): Promise<AuditLog> {
  await initializeDatabase();
  const idx = memAuditLogs.findIndex(a => a.id === log.id);
  if (idx >= 0) memAuditLogs[idx] = log;
  else memAuditLogs.unshift(log);

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('audit_logs').upsert(log);
    if (error) console.warn('⚠️ Supabase createAuditLog warning:', error.message);
  } else if (usePgMode) {
    await getPool().query(
      `INSERT INTO audit_logs (id, "userId", "userName", "userRole", action, details, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET "userId"=$2, "userName"=$3, "userRole"=$4, action=$5, details=$6, timestamp=$7`,
      [log.id, log.userId, log.userName, log.userRole, log.action, log.details, log.timestamp]
    ).catch(e => console.warn('⚠️ pg createAuditLog error:', e));
  }
  return log;
}

// NOTIFICATIONS
export async function getNotifications(): Promise<Notification[]> {
  await initializeDatabase();
  if (useFallbackMode) return [...memNotifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (useSupabaseJsMode && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('notifications').select('*').order('createdAt', { ascending: false });
      if (!error && data && data.length > 0) return data as Notification[];
    } catch (e) {
      console.warn('Supabase notifications fetch error:', e);
    }
    return [...memNotifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  if (usePgMode) {
    const res = await getPool().query('SELECT * FROM notifications ORDER BY "createdAt" DESC').catch(() => ({ rows: [] }));
    if (res.rows.length > 0) return res.rows;
  }
  return [...memNotifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createNotification(notify: Notification): Promise<Notification> {
  await initializeDatabase();
  const idx = memNotifications.findIndex(n => n.id === notify.id);
  if (idx >= 0) memNotifications[idx] = notify;
  else memNotifications.unshift(notify);

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('notifications').upsert(notify);
    if (error) console.warn('⚠️ Supabase createNotification warning:', error.message);
  } else if (usePgMode) {
    await getPool().query(
      `INSERT INTO notifications (id, "userId", "roleTarget", title, message, "isRead", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET "userId"=$2, "roleTarget"=$3, title=$4, message=$5, "isRead"=$6, "createdAt"=$7`,
      [notify.id, notify.userId || null, notify.roleTarget || null, notify.title, notify.message, notify.isRead, notify.createdAt]
    ).catch(e => console.warn('⚠️ pg createNotification error:', e));
  }
  return notify;
}

export async function markNotificationsAsRead(): Promise<boolean> {
  await initializeDatabase();
  memNotifications.forEach(n => { n.isRead = true; });

  if (useSupabaseJsMode && supabaseClient) {
    const { error } = await supabaseClient.from('notifications').update({ isRead: true }).eq('isRead', false);
    if (error) console.warn('⚠️ Supabase markNotificationsAsRead warning:', error.message);
    return true;
  } else if (usePgMode) {
    await getPool().query('UPDATE notifications SET "isRead" = TRUE WHERE "isRead" = FALSE').catch(e => console.warn('⚠️ pg markNotificationsAsRead error:', e));
    return true;
  }
  return true;
}
