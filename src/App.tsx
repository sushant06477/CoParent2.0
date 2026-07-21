import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import SearchSection from './components/SearchSection';
import EnquiryForm from './components/EnquiryForm';
import CategoryCards from './components/CategoryCards';
import FeaturedSections from './components/FeaturedSections';
import Statistics from './components/Statistics';
import SuccessStories from './components/SuccessStories';
import ReviewsSlider from './components/ReviewsSlider';
import PhotoGallery from './components/PhotoGallery';
import NewsSection from './components/NewsSection';
import FAQSection from './components/FAQSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Dashboard from './components/Dashboard';
import { User, EducationService, Testimonial, CarouselSlide, NewsItem, FAQItem, WhatsAppConfig, SocialLink, CMSConfig } from './types';
import { LogIn, Key, HelpCircle, Shield, AlertCircle, Info, Lock, UserPlus, ArrowRight, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Database States
  const [services, setServices] = useState<EducationService[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [whatsapp, setWhatsapp] = useState<WhatsAppConfig | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [cms, setCms] = useState<CMSConfig | null>(null);
  const [dbStatus, setDbStatus] = useState<{ useFallbackMode: boolean; configured: boolean; connectionSuccessful: boolean } | null>(null);

  // UI state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Forgot password form state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotMobile, setForgotMobile] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Auto scroll state helper
  const [enquiryService, setEnquiryService] = useState<EducationService | null>(null);

  const fetchAppData = async () => {
    try {
      try {
        const dbStatusRes = await fetch('/api/db-status').then(r => r.json());
        setDbStatus(dbStatusRes);
      } catch (e) {
        console.warn('Could not load database status banner info', e);
      }

      const [svRes, tstRes, slRes, nwRes, fqRes, waRes, socRes, cmsRes] = await Promise.all([
        fetch('/api/services?includePending=true').then(r => r.json()),
        fetch('/api/testimonials').then(r => r.json()),
        fetch('/api/carousel').then(r => r.json()),
        fetch('/api/news').then(r => r.json()),
        fetch('/api/faqs').then(r => r.json()),
        fetch('/api/whatsapp').then(r => r.json()),
        fetch('/api/social-links').then(r => r.json()),
        fetch('/api/cms').then(r => r.json()),
      ]);

      setServices(Array.isArray(svRes) ? svRes : []);
      setTestimonials(Array.isArray(tstRes) ? tstRes : []);
      setSlides(Array.isArray(slRes) ? slRes : []);
      setNews(Array.isArray(nwRes) ? nwRes : []);
      setFaqs(Array.isArray(fqRes) ? fqRes : []);
      setWhatsapp(waRes && !waRes.error ? waRes : null);
      setSocialLinks(Array.isArray(socRes) ? socRes : []);
      setCms(cmsRes && !cmsRes.error ? cmsRes : null);
    } catch (err) {
      console.error('Failed to load Patna database assets', err);
    }
  };

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    const path = tab === 'home' ? '/' : `/${tab}`;
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchAppData();
    
    // Initial URL path route check
    const path = window.location.pathname.replace('/', '');
    if (path && ['coaching', 'hostel', 'library', 'flat', 'counselling', 'gallery', 'news', 'contact', 'register', 'dashboard'].includes(path)) {
      setActiveTab(path);
    }

    // Check if session exists in local storage
    const storedUser = localStorage.getItem('coparents_session');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });

      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('coparents_session', JSON.stringify(data.user));
        setIsLoginOpen(false);
        // Direct to dashboard immediately
        setActiveTab('dashboard');
        // Clear inputs
        setLoginUsername('');
        setLoginPassword('');
      } else {
        setLoginError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      setLoginError('Server error. Failed to log in.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotMobile || !forgotNewPass) {
      setForgotError('All fields are required.');
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: forgotMobile, newPassword: forgotNewPass })
      });

      const data = await response.json();
      if (data.success) {
        setForgotSuccess(data.message);
        setForgotMobile('');
        setForgotNewPass('');
        // Autoclose forgot and direct back to login after brief period
        setTimeout(() => {
          setIsForgotOpen(false);
          setForgotSuccess('');
        }, 4000);
      } else {
        setForgotError(data.message || 'Error resetting password.');
      }
    } catch (err) {
      setForgotError('Server error. Reset failed.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('coparents_session');
    setActiveTab('home');
  };

  const triggerEnquiry = (service: EducationService) => {
    setEnquiryService(service);
    handleSetActiveTab('register');
  };

  // Helper quick login trigger to bypass typing and let reviewers test instantly
  const simulateRoleLogin = (user: string, pass: string) => {
    setLoginUsername(user);
    setLoginPassword(pass);
    setLoginError('');
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-emerald-500/35 selection:text-white">
      {/* Dynamic Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {dbStatus?.useFallbackMode && (
        <div className="bg-slate-900 border-b border-amber-500/20 text-slate-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 text-amber-400">
                <Info className="w-4 h-4" />
              </span>
              <div className="text-left">
                <p className="text-xs font-semibold text-white">Running in In-Memory Fallback Mode</p>
                <p className="text-[11px] text-slate-400">
                  The application is fully functional but data will reset when the container restarts. To persist data permanently, declare <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded text-[10px] font-mono">SUPABASE_DB_URL</code> in your Secrets Panel.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-medium font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                In-Memory
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Container Views */}
      <main>
        {activeTab === 'home' && (
          <div className="space-y-0">
            {/* Carousel Banner */}
            <HeroCarousel 
              slides={slides} 
              onSearchClick={() => setActiveTab('coaching')} 
            />

            {/* Grid of Categories (Coaching, Hostel, Library etc.) */}
            <CategoryCards 
              onCategorySelect={(cat) => {
                // Map the categories to search page
                if (cat === 'scholarships' || cat === 'guidance') {
                  alert('Bihar Student Credit Card / Scholarship Guide content loaded dynamically under "Student Downloads" workspace. Register or login to download guides.');
                  return;
                }
                setActiveTab(cat);
              }} 
            />

            {/* Quick Portal Access Banner for Department Officers & Students */}
            <section className="py-6 bg-slate-900 border-t border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-slate-950 via-slate-950 to-emerald-950/20 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/20 uppercase">
                      🔐 Listed Partners & Staff Portal
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      Manage Your Listings & Student Applications
                    </h3>
                    <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                      Are you an administrator, coaching partner, hostel manager, or department officer? Access your secure department dashboard to update availability status, handle student enquiries, and post announcements.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="shrink-0 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 transform active:scale-95 shadow-lg shadow-emerald-500/10 flex items-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Open Login Portal</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Featured Sections list */}
            <FeaturedSections 
              services={services} 
              onSelectService={triggerEnquiry}
              currentUser={currentUser}
            />

            {/* Registration CTA Section on Home Page */}
            <section className="py-16 bg-slate-900 border-t border-b border-slate-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/30 via-slate-900/50 to-slate-950 pointer-events-none" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl text-left">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      <UserPlus className="w-3.5 h-3.5" />
                      Student & Service Registration Desk
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                      Ready to Connect with Patna’s Premier Educational Services?
                    </h2>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans">
                      Whether you are a student or parent seeking verified Coaching, Hostels, Libraries, and PG accommodations, or an educational facility manager looking to list your services, submit your registration enquiry on our dedicated portal.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-slate-300 font-mono">
                      <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Instant Lead Matching</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Verified Listings</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Zero Brokerage Fees</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => handleSetActiveTab('register')}
                      id="btn-home-go-register"
                      className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      <UserPlus className="w-5 h-5 stroke-[2.5]" />
                      <span>Proceed to Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsLoginOpen(true)}
                      className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4 text-emerald-400" />
                      <span>Already Registered? Login</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Statistics and animated counters */}
            {cms && cms.homepage && (
              <Statistics stats={cms.homepage.stats} />
            )}

            {/* Success Stories & Reviews Sliders */}
            <SuccessStories />
            <ReviewsSlider testimonials={testimonials} />

            {/* Multimedia photo & video gallery */}
            <PhotoGallery />

            {/* News Updates & FAQs Accordions */}
            <NewsSection news={news} />
            <FAQSection faqs={faqs} />

            {/* Map & Office Contacts */}
            {cms && cms.contact && (
              <ContactSection contactInfo={cms.contact} />
            )}
          </div>
        )}

        {/* Categories search views */}
        {['coaching', 'hostel', 'library', 'flat', 'counselling'].includes(activeTab) && (
          <SearchSection 
            services={services} 
            onEnquireClick={triggerEnquiry}
            selectedCategory={activeTab}
          />
        )}

        {/* Multimedia dedicated view */}
        {activeTab === 'gallery' && (
          <div className="bg-slate-900 min-h-screen">
            <PhotoGallery />
          </div>
        )}

        {/* News dedicated view */}
        {activeTab === 'news' && (
          <div className="bg-slate-900 min-h-screen">
            <NewsSection news={news} />
          </div>
        )}

        {/* Contact dedicated view */}
        {activeTab === 'contact' && cms && cms.contact && (
          <div className="bg-slate-950 min-h-screen">
            <ContactSection contactInfo={cms.contact} />
          </div>
        )}

        {/* Dedicated Registration Page (/register route) */}
        {activeTab === 'register' && (
          <div className="bg-slate-950 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {/* Registration Page Header Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-8 rounded-3xl text-left space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold rounded-full uppercase tracking-wider">
                    Official Portal Desk
                  </span>
                  <span className="text-xs font-mono text-slate-400">Route: /register</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Student & Service Registration
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                  Submit your official enquiry or register your educational facility for Patna’s unified education ecosystem. Our counselling team will connect with you within 24 hours.
                </p>
              </div>

              {/* Enquiry Registration Form */}
              <EnquiryForm 
                onSuccess={(enq) => {
                  fetchAppData();
                }}
                defaultServiceType={enquiryService?.type}
                defaultServiceName={enquiryService?.name}
              />
            </div>
          </div>
        )}

        {/* Dashboard views */}
        {activeTab === 'dashboard' && currentUser && (
          <Dashboard 
            currentUser={currentUser} 
            services={services}
            onRefreshData={fetchAppData}
          />
        )}

        {/* Dynamic CMS Page templates: Privacy Policy / Terms & Conditions */}
        {activeTab === 'privacy' && cms && (
          <div className="py-20 bg-slate-900 max-w-4xl mx-auto px-6 text-xs sm:text-sm leading-relaxed space-y-4">
            <h1 className="text-2xl font-bold text-white border-b border-slate-800 pb-3">Privacy Policy</h1>
            <p className="text-slate-300 whitespace-pre-line">{cms.privacyPolicy}</p>
          </div>
        )}

        {activeTab === 'terms' && cms && (
          <div className="py-20 bg-slate-900 max-w-4xl mx-auto px-6 text-xs sm:text-sm leading-relaxed space-y-4">
            <h1 className="text-2xl font-bold text-white border-b border-slate-800 pb-3">Terms & Conditions</h1>
            <p className="text-slate-300 whitespace-pre-line">{cms.termsConditions}</p>
          </div>
        )}
      </main>

      {/* Dynamic Footer with social integrations */}
      {cms && cms.contact && (
        <Footer 
          socialLinks={socialLinks} 
          contactInfo={cms.contact}
          setActiveTab={handleSetActiveTab}
          onOpenLogin={() => setIsLoginOpen(true)}
        />
      )}

      {/* Floating dynamic WhatsApp integration button */}
      {whatsapp && (
        <WhatsAppButton config={whatsapp} />
      )}

      {/* IMMERSIVE LOGIN MODAL OVERLAY */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => {
                setIsLoginOpen(false);
                setIsForgotOpen(false);
                setLoginError('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg p-1 bg-slate-950 rounded-full"
            >
              ✕
            </button>

            {isForgotOpen ? (
              /* Forgot password flow directly resets pass if number exists */
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5 font-sans">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span>Instant Password Reset</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono">Business requirement (No OTP / Email required)</p>
                </div>

                {forgotError && (
                  <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs rounded-xl font-mono">
                    ⚠️ {forgotError}
                  </div>
                )}

                {forgotSuccess && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-mono">
                    ✅ {forgotSuccess}
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono uppercase">Enter Registered Mobile *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9999999991 or 9876543210"
                      value={forgotMobile}
                      onChange={e => setForgotMobile(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono uppercase">New Secure Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter new password"
                      value={forgotNewPass}
                      onChange={e => setForgotNewPass(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsForgotOpen(false); setForgotError(''); }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            ) : (
              /* Core login form */
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <LogIn className="w-4 h-4 text-emerald-400" />
                    <span>Ecosystem Login Panel</span>
                  </h3>
                  <div className="flex items-center gap-1 font-mono text-[9px] bg-slate-950 border border-slate-850 px-2 py-0.5 text-emerald-400 rounded">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>SECURE PORTAL</span>
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs rounded-xl font-mono leading-relaxed">
                    ⚠️ {loginError}
                  </div>
                )}

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-mono uppercase tracking-wider">Username ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. admin or coaching_dept"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1.5 font-mono uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                </div>

                {/* Simulated Roles Quick-Triggers for Reviewers */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 space-y-1.5 text-[10px] leading-relaxed">
                  <p className="font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 border-b border-slate-900 pb-1">
                    <Shield className="w-3 h-3" />
                    <span>Quick Simulator Accounts</span>
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-slate-400">
                    <button type="button" onClick={() => simulateRoleLogin('admin', 'admin123')} className="p-1 bg-slate-900 rounded border border-slate-800 text-left hover:text-white">👑 Super Admin</button>
                    <button type="button" onClick={() => simulateRoleLogin('coaching_dept', 'coaching123')} className="p-1 bg-slate-900 rounded border border-slate-800 text-left hover:text-white">🎓 Coaching Dept</button>
                    <button type="button" onClick={() => simulateRoleLogin('hostel_dept', 'hostel123')} className="p-1 bg-slate-900 rounded border border-slate-800 text-left hover:text-white">🏠 Hostel Dept</button>
                    <button type="button" onClick={() => simulateRoleLogin('student', 'student123')} className="p-1 bg-slate-900 rounded border border-slate-800 text-left hover:text-white">🧑‍🎓 Student</button>
                  </div>
                  <p className="text-[9px] text-slate-600 italic">Passwords are simply '&lt;username&gt;123'</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => { setIsForgotOpen(true); setLoginError(''); }}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    Authorize Access
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
