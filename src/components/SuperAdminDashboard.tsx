import React, { useState, useEffect, useRef } from 'react';
import { User, EducationService, Enquiry, CarouselSlide, Testimonial, NewsItem, FAQItem, WhatsAppConfig, SocialLink, AuditLog, CMSConfig } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  TrendingUp, Users, FileText, CheckCircle, XCircle, AlertCircle, Edit, Trash, Plus, Download, RefreshCw, Settings, ShieldAlert, Check, X, Eye, Phone, MapPin, Sliders, Image 
} from 'lucide-react';

interface SuperAdminDashboardProps {
  currentUser: User;
  onRefreshData: () => void;
}

export default function SuperAdminDashboard({ currentUser, onRefreshData }: SuperAdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'approvals' | 'listings' | 'enquiries' | 'users' | 'cms' | 'reports' | 'logs'>('analytics');
  
  // Dashboard Ref for Smooth Scroll
  const slideFormRef = useRef<HTMLDivElement>(null);
  const serviceFormRef = useRef<HTMLDivElement>(null);

  // Analytics State
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Entities State
  const [services, setServices] = useState<EducationService[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [whatsapp, setWhatsapp] = useState<WhatsAppConfig | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [cms, setCms] = useState<CMSConfig | null>(null);

  // Editing state
  const [editingService, setEditingService] = useState<EducationService | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [rejectionId, setRejectionId] = useState<string | null>(null);
  const [rejectionRemarks, setRejectionRemarks] = useState('');

  // Form states for adding/editing services
  const [svcName, setSvcName] = useState('');
  const [svcType, setSvcType] = useState<'coaching' | 'hostel' | 'library' | 'flat' | 'counselling'>('coaching');
  const [svcLocation, setSvcLocation] = useState('');
  const [svcPrice, setSvcPrice] = useState('');
  const [svcShortDesc, setSvcShortDesc] = useState('');
  const [svcFullDesc, setSvcFullDesc] = useState('');
  const [svcPhone, setSvcPhone] = useState('');
  const [svcEmail, setSvcEmail] = useState('');
  const [svcAddress, setSvcAddress] = useState('');
  const [svcFacilities, setSvcFacilities] = useState('');

  // CMS state form
  const [cmsHeroTitle, setCmsHeroTitle] = useState('');
  const [cmsHeroSubtitle, setCmsHeroSubtitle] = useState('');
  const [cmsAboutTitle, setCmsAboutTitle] = useState('');
  const [cmsAboutContent, setCmsAboutContent] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [waMsg, setWaMsg] = useState('');
  const [waEnabled, setWaEnabled] = useState(true);

  // Carousel Slides State & Form states
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  const [cmsSection, setCmsSection] = useState<'copy' | 'carousel'>('copy');

  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideImage, setSlideImage] = useState('');
  const [slideBtnText, setSlideBtnText] = useState('');
  const [slideBtnLink, setSlideBtnLink] = useState('');
  const [slideStatus, setSlideStatus] = useState<'Published' | 'Hidden'>('Published');
  const [slideOrder, setSlideOrder] = useState<number>(1);
  const [slideVideoUrl, setSlideVideoUrl] = useState('');

  // Fetch all administrative data
  const fetchData = async () => {
    try {
      setLoadingAnalytics(true);
      
      const [anRes, svRes, enRes, usRes, logRes, waRes, socRes, cmsRes, carRes] = await Promise.all([
        fetch('/api/analytics').then(r => r.json()),
        fetch('/api/services?includePending=true').then(r => r.json()),
        fetch('/api/enquiries').then(r => r.json()),
        fetch('/api/users').then(r => r.json()),
        fetch('/api/audit-logs').then(r => r.json()),
        fetch('/api/whatsapp').then(r => r.json()),
        fetch('/api/social-links').then(r => r.json()),
        fetch('/api/cms').then(r => r.json()),
        fetch('/api/carousel').then(r => r.json()),
      ]);

      setAnalytics(anRes);
      setServices(svRes);
      setEnquiries(enRes);
      setUsers(usRes);
      setAuditLogs(logRes);
      setWhatsapp(waRes);
      setSocials(socRes);
      setCms(cmsRes);
      setCarouselSlides(carRes || []);

      // Populate CMS forms
      if (cmsRes) {
        setCmsHeroTitle(cmsRes.homepage?.heroTitle || '');
        setCmsHeroSubtitle(cmsRes.homepage?.heroSubtitle || '');
        setCmsAboutTitle(cmsRes.homepage?.aboutTitle || '');
        setCmsAboutContent(cmsRes.homepage?.aboutContent || '');
      }
      if (waRes) {
        setWaPhone(waRes.phoneNumber || '');
        setWaMsg(waRes.defaultMessage || '');
        setWaEnabled(waRes.isEnabled);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard metrics', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSubTab]);

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/approvals/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: currentUser.id, adminName: currentUser.name })
      });
      if (response.ok) {
        alert('Listing & Partner account approved! Published to the live website grid.');
        fetchData();
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: 'Active' | 'Pending' | 'Suspended') => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        alert('Partner account status updated successfully!');
        fetchData();
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionRemarks) return;
    try {
      const response = await fetch(`/api/approvals/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          adminId: currentUser.id, 
          adminName: currentUser.name,
          rejectionRemarks
        })
      });
      if (response.ok) {
        setRejectionId(null);
        setRejectionRemarks('');
        fetchData();
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create or Update Listing
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: svcName,
      type: svcType,
      location: svcLocation,
      priceFees: svcPrice,
      shortDescription: svcShortDesc,
      fullDescription: svcFullDesc,
      facilities: svcFacilities.split(',').map(f => f.trim()).filter(Boolean),
      contactInfo: {
        phone: svcPhone,
        email: svcEmail,
        address: svcAddress
      },
      images: editingService ? editingService.images : ['https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=60'],
      userRole: currentUser.role,
      createdBy: currentUser.id
    };

    try {
      let url = '/api/services';
      let method = 'POST';
      if (editingService) {
        url = `/api/services/${editingService.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsAddingService(false);
        setEditingService(null);
        // Reset form
        setSvcName('');
        setSvcLocation('');
        setSvcPrice('');
        setSvcShortDesc('');
        setSvcFullDesc('');
        setSvcPhone('');
        setSvcEmail('');
        setSvcAddress('');
        setSvcFacilities('');
        
        fetchData();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Listing directly
  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to remove this verified listing?')) return;
    try {
      const response = await fetch(`/api/services/${id}?userRole=${currentUser.role}&userId=${currentUser.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchData();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Enquiry Status
  const handleUpdateEnquiryStatus = async (id: string, newStatus: string, notes?: string) => {
    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Assign Student Enquiry Lead to Specific Partner / Department
  const handleAssignEnquiry = async (id: string, assignedToDepartment: string) => {
    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          assignedToDepartment: assignedToDepartment || null, 
          status: assignedToDepartment ? 'In Progress' : 'New' 
        })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update CMS Home content
  const handleSaveCMS = async () => {
    try {
      const payload = {
        homepage: {
          ...cms?.homepage,
          heroTitle: cmsHeroTitle,
          heroSubtitle: cmsHeroSubtitle,
          aboutTitle: cmsAboutTitle,
          aboutContent: cmsAboutContent
        }
      };
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      // Also save WhatsApp config
      await fetch('/api/whatsapp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: waPhone,
          defaultMessage: waMsg,
          isEnabled: waEnabled
        })
      });

      if (res.ok) {
        alert('Website CMS configurations updated and published successfully!');
        fetchData();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger Excel/PDF Exports
  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideTitle || !slideImage) {
      alert('Title and Image URL are required!');
      return;
    }

    const payload = {
      title: slideTitle,
      subtitle: slideSubtitle,
      image: slideImage,
      buttonText: slideBtnText || 'Explore More',
      buttonLink: slideBtnLink || '/',
      status: slideStatus,
      displayOrder: Number(slideOrder) || 1,
      videoUrl: slideVideoUrl || undefined
    };

    try {
      let url = '/api/carousel';
      let method = 'POST';
      if (editingSlide) {
        url = `/api/carousel/${editingSlide.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsAddingSlide(false);
        setEditingSlide(null);
        // Reset form
        setSlideTitle('');
        setSlideSubtitle('');
        setSlideImage('');
        setSlideBtnText('');
        setSlideBtnLink('');
        setSlideStatus('Published');
        setSlideOrder(1);
        setSlideVideoUrl('');
        
        fetchData();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this carousel slide?')) return;
    try {
      const response = await fetch(`/api/carousel/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchData();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEditSlide = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setSlideTitle(slide.title);
    setSlideSubtitle(slide.subtitle);
    setSlideImage(slide.image);
    setSlideBtnText(slide.buttonText);
    setSlideBtnLink(slide.buttonLink);
    setSlideStatus(slide.status);
    setSlideOrder(slide.displayOrder);
    setSlideVideoUrl(slide.videoUrl || '');
    setIsAddingSlide(true);
    setTimeout(() => {
      slideFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const handleTriggerReport = (type: string, format: 'excel' | 'pdf') => {
    const url = `/api/reports/export?type=${type}&format=${format}`;
    window.open(url, '_blank');
  };

  const editServiceForm = (service: EducationService) => {
    setEditingService(service);
    setSvcName(service.name);
    setSvcType(service.type);
    setSvcLocation(service.location);
    setSvcPrice(service.priceFees);
    setSvcShortDesc(service.shortDescription);
    setSvcFullDesc(service.fullDescription);
    setSvcPhone(service.contactInfo.phone);
    setSvcEmail(service.contactInfo.email);
    setSvcAddress(service.contactInfo.address);
    setSvcFacilities(service.facilities.join(', '));
    setIsAddingService(true);
    setTimeout(() => {
      serviceFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'];

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Title Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                {currentUser.role} Control
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
              Ecosystem Management Console
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Logged in as <span className="text-slate-200">{currentUser.name}</span> | Patna Admin Command
            </p>
          </div>

          <button 
            onClick={fetchData}
            className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Live Database</span>
          </button>
        </div>

        {/* Dashboard Nav Tab-Bar */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-4 mb-6">
          {[
            { id: 'analytics', label: 'Overview Analytics' },
            { id: 'approvals', label: `Pending Approvals (${services.filter(s => s.status === 'Pending Approval').length})` },
            { id: 'listings', label: 'Manage Listings' },
            { id: 'enquiries', label: 'Student Enquiries' },
            { id: 'users', label: 'Users & Departments' },
            { id: 'cms', label: 'Portal CMS' },
            { id: 'reports', label: 'Report Desk' },
            { id: 'logs', label: 'Security Audit Logs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950 text-slate-400 border border-slate-850 hover:text-slate-200 hover:border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading Indicator */}
        {loadingAnalytics && !analytics ? (
          <div className="text-center py-20 text-slate-400 text-sm font-mono flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
            <span>Compiling portal metrics... Please wait</span>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 1. ANALYTICS VIEW */}
            {activeSubTab === 'analytics' && analytics && (
              <div className="space-y-6">
                {/* Stats cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Dynamic Enquiries', val: analytics.counts.enquiries, icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    { label: 'Pending Approvals', val: analytics.counts.pendingApprovals, icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                    { label: 'Verified Partners', val: services.length, icon: CheckCircle, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                    { label: 'Audit Safe Sessions', val: analytics.counts.users, icon: Users, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
                  ].map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <div key={idx} className={`p-6 rounded-2xl border ${card.color} flex items-center justify-between shadow-md`}>
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">{card.label}</span>
                          <h3 className="text-3xl font-black text-white mt-1">{card.val}</h3>
                        </div>
                        <div className="p-3 bg-slate-950/40 rounded-xl">
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Graph Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Service type Distribution */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-6">Service Category Mix</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.serviceDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {analytics.serviceDistribution.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b' }} />
                          <Legend verticalAlign="bottom" height={36} formatter={(value, entry: any) => <span className="text-xs text-slate-300">{value} ({entry.payload.value})</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Enquiry Trend */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-6">Student Connection Lead Trends</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.enquiryTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                          <YAxis stroke="#94a3b8" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b' }} />
                          <Legend verticalAlign="bottom" height={36} />
                          <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} name="Leads Submitted" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Recent connections */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4">Recent Core Operations Log</h3>
                  <div className="space-y-3">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="text-xs p-3 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-between gap-4 font-sans">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-semibold rounded">
                            {log.action}
                          </span>
                          <span className="text-slate-300">{log.details}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. APPROVALS FLOW */}
            {activeSubTab === 'approvals' && (
              <div className="space-y-6">
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-1">Ecosystem Changes Queue</h3>
                  <p className="text-xs text-slate-400">Department listings awaiting review. Only Super Admin can authorize publications.</p>
                </div>

                {services.filter(s => s.status === 'Pending Approval').length === 0 ? (
                  <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-850 text-slate-500 text-sm">
                    ✨ Clear desk! No listings or modifications are awaiting Super Admin approval.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {services.filter(s => s.status === 'Pending Approval').map((service) => {
                      const isNewListing = !service.pendingChanges;
                      const hasDeleteRequest = service.pendingChanges && (service.pendingChanges as any)._deleted;

                      return (
                        <div key={service.id} className="bg-slate-950 rounded-2xl border border-slate-850 p-6 space-y-4 shadow-xl">
                          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900 pb-4">
                            <div>
                              <span className="text-[9px] font-mono font-black bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-0.5 rounded uppercase mr-2">
                                {hasDeleteRequest ? 'DELETE REQUEST' : isNewListing ? 'NEW LISTING REQUEST' : 'EDIT CHANGES REQUEST'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">Category: {service.type}</span>
                              <h4 className="text-lg font-bold text-white mt-1.5">{service.name}</h4>
                            </div>

                            <div className="flex gap-2">
                              {rejectionId === service.id ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Enter rejection remarks..."
                                    value={rejectionRemarks}
                                    onChange={(e) => setRejectionRemarks(e.target.value)}
                                    className="px-3 py-1.5 text-xs bg-slate-900 border border-red-500/40 rounded-xl focus:outline-none focus:border-red-500 text-white"
                                  />
                                  <button
                                    onClick={() => handleReject(service.id)}
                                    className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs"
                                  >
                                    Submit
                                  </button>
                                  <button
                                    onClick={() => { setRejectionId(null); setRejectionRemarks(''); }}
                                    className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleApprove(service.id)}
                                    className="flex items-center gap-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Approve & Publish</span>
                                  </button>
                                  <button
                                    onClick={() => setRejectionId(service.id)}
                                    className="flex items-center gap-1 px-4 py-2 bg-slate-900 border border-red-900 text-red-400 hover:bg-red-950 hover:text-white rounded-xl text-xs transition-colors cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Reject Request</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Visual Diff comparisons for edit edits */}
                          {service.pendingChanges && !hasDeleteRequest && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850">
                                <h5 className="font-bold text-slate-400 font-mono mb-2 uppercase tracking-wider text-[10px]">Current Published Data</h5>
                                <div className="space-y-1 text-slate-300">
                                  <p><strong>Fees:</strong> {service.priceFees}</p>
                                  <p><strong>Location:</strong> {service.location}</p>
                                  <p><strong>Short Desc:</strong> {service.shortDescription}</p>
                                  <p><strong>Facilities:</strong> {service.facilities.join(', ')}</p>
                                </div>
                              </div>
                              <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/20">
                                <h5 className="font-bold text-emerald-400 font-mono mb-2 uppercase tracking-wider text-[10px]">Proposed New Changes</h5>
                                <div className="space-y-1 text-slate-200">
                                  {Object.entries(service.pendingChanges).map(([key, val]) => (
                                    <p key={key}>
                                      <strong className="capitalize">{key}:</strong>{' '}
                                      {Array.isArray(val) ? val.join(', ') : val?.toString() || 'N/A'}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {isNewListing && (
                            <div className="bg-slate-900/50 p-4 rounded-xl text-xs space-y-2">
                              <p className="text-slate-400">Representative applied for brand-new directory insertion:</p>
                              <p><strong>Name:</strong> <span className="text-white font-bold">{service.name}</span></p>
                              <p><strong>Address:</strong> {service.contactInfo.address}</p>
                              <p><strong>Short Description:</strong> {service.shortDescription}</p>
                              <p><strong>Facilities:</strong> {service.facilities.join(', ')}</p>
                            </div>
                          )}

                          {hasDeleteRequest && (
                            <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-xs text-red-400">
                              ⚠️ Warning: Department representative requested permanent removal of this listing. Approving will delete this record.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. MANAGE LISTINGS */}
            {activeSubTab === 'listings' && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-1">Ecosystem Listing Directory</h3>
                    <p className="text-xs text-slate-400">Create, edit or delete verified coaching classes, libraries and accommodation centers directly.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingService(null);
                      setIsAddingService(true);
                    }}
                    className="flex items-center gap-1 px-4 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create verified Listing</span>
                  </button>
                </div>

                {/* Listing form overlay */}
                {isAddingService && (
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-4">
                    <div className="flex justify-between border-b border-slate-900 pb-3">
                      <h4 className="text-base font-bold text-white">
                        {editingService ? `Edit Verified Listing: ${editingService.name}` : 'Create Brand New Verified Listing'}
                      </h4>
                      <button 
                        onClick={() => setIsAddingService(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    <form onSubmit={handleSaveService} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-emerald-400 mb-1">Brand Name *</label>
                        <input
                          type="text" required value={svcName} onChange={e => setSvcName(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-emerald-400 mb-1">Service Type *</label>
                        <select
                          value={svcType} onChange={e => setSvcType(e.target.value as any)}
                          className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                        >
                          <option value="coaching">Coaching Class</option>
                          <option value="hostel">Boys / Girls Hostel</option>
                          <option value="library">Silent Library</option>
                          <option value="flat">PG / Flat Rental</option>
                          <option value="counselling">Career Counselling</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-emerald-400 mb-1">Locality (e.g. Boring Road) *</label>
                        <input
                          type="text" required value={svcLocation} onChange={e => setSvcLocation(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-emerald-400 mb-1">Fees Plan Structure *</label>
                        <input
                          type="text" required value={svcPrice} onChange={e => setSvcPrice(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono text-emerald-400 mb-1">One Line Short Description *</label>
                        <input
                          type="text" required value={svcShortDesc} onChange={e => setSvcShortDesc(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono text-emerald-400 mb-1">Complete Comprehensive Description</label>
                        <textarea
                          rows={3} value={svcFullDesc} onChange={e => setSvcFullDesc(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-emerald-400 mb-1">Facilities (comma separated)</label>
                        <input
                          type="text" placeholder="Wi-Fi, Power Backup, Library" value={svcFacilities} onChange={e => setSvcFacilities(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-emerald-400 mb-1">Representative Desk Phone</label>
                        <input
                          type="text" value={svcPhone} onChange={e => setSvcPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-emerald-400 mb-1">Desk Email</label>
                        <input
                          type="email" value={svcEmail} onChange={e => setSvcEmail(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-emerald-400 mb-1">HQ Campus Address</label>
                        <input
                          type="text" value={svcAddress} onChange={e => setSvcAddress(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                        />
                      </div>

                      <div className="sm:col-span-2 flex justify-end gap-2 pt-4">
                        <button
                          type="button" onClick={() => setIsAddingService(false)}
                          className="px-4 py-2 text-xs bg-slate-900 hover:bg-slate-850 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs bg-emerald-500 text-slate-950 font-bold rounded-lg"
                        >
                          Save & Publish Listing
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Listings Directory Table */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-slate-900 text-slate-400 font-mono uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Listing Name</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Locality</th>
                          <th className="p-4">Fees plan</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {services.map((service) => (
                          <tr key={service.id} className="hover:bg-slate-900/50">
                            <td className="p-4 font-bold text-white">{service.name}</td>
                            <td className="p-4 font-mono capitalize">{service.type}</td>
                            <td className="p-4">{service.location}</td>
                            <td className="p-4 text-emerald-400 font-mono font-semibold">{service.priceFees}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                                service.status === 'Approved' ? 'bg-emerald-950 text-emerald-400' :
                                service.status === 'Rejected' ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'
                              }`}>
                                {service.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => editServiceForm(service)}
                                className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 rounded-md"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(service.id)}
                                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-md"
                                title="Delete"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4. STUDENT ENQUIRIES */}
            {activeSubTab === 'enquiries' && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-1">Dynamic Enquiries Ledger</h3>
                  <p className="text-xs text-slate-400">Leads submitted via homepage form. Assign to department specialists or update interaction notes.</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-slate-900 text-slate-400 font-mono uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Student Info</th>
                          <th className="p-4">Service</th>
                          <th className="p-4">Area Requested</th>
                          <th className="p-4">Assigned Department / Lead Control</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Update Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {enquiries.map((enq) => (
                          <tr key={enq.id} className="hover:bg-slate-900/50">
                            <td className="p-4 space-y-1">
                              <p className="font-bold text-white">{enq.fullName} <span className="text-[10px] text-slate-400">({enq.userType})</span></p>
                              <p className="text-[10px] text-slate-500 font-mono">📱 {enq.mobileNumber}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-semibold text-slate-300">{enq.interestedService}</p>
                              {enq.preferredCourse && <p className="text-[10px] text-emerald-400 font-mono">{enq.preferredCourse}</p>}
                            </td>
                            <td className="p-4">{enq.areaLocality}</td>
                            <td className="p-4">
                              <select
                                value={enq.assignedToDepartment || ''}
                                onChange={(e) => handleAssignEnquiry(enq.id, e.target.value)}
                                className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 font-mono font-semibold"
                              >
                                <option value="">🔒 Private (Super Admin Only)</option>
                                <option value="Coaching">Forward to Coaching Dept</option>
                                <option value="Hostel">Forward to Hostel Dept</option>
                                <option value="Library">Forward to Library Dept</option>
                                <option value="Flat / PG">Forward to Flat / PG Dept</option>
                                <option value="Career Counselling">Forward to Counselling Dept</option>
                              </select>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                                enq.status === 'New' ? 'bg-blue-950 text-blue-400' :
                                enq.status === 'Contacted' ? 'bg-amber-950 text-amber-400' :
                                enq.status === 'In Progress' ? 'bg-purple-950 text-purple-400' : 'bg-emerald-950 text-emerald-400'
                              }`}>
                                {enq.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1">
                              <select
                                value={enq.status}
                                onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value, enq.notes)}
                                className="px-2 py-1 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. USERS & DEPARTMENTS */}
            {activeSubTab === 'users' && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-1">Active Accounts & Departments</h3>
                  <p className="text-xs text-slate-400">View registered students, parents, and authorized departmental reviewers for Patna’s education grid.</p>
                </div>

                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-slate-900 text-slate-400 font-mono uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Name</th>
                          <th className="p-4">Username ID</th>
                          <th className="p-4">Ecosystem Role</th>
                          <th className="p-4">Contact Phone</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Account status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-900/50">
                            <td className="p-4 font-bold text-white">{user.name}</td>
                            <td className="p-4 font-mono text-emerald-400">@{user.username}</td>
                            <td className="p-4 font-semibold text-slate-300">{user.role}</td>
                            <td className="p-4 font-mono">{user.mobile}</td>
                            <td className="p-4">{user.email}</td>
                            <td className="p-4 flex items-center justify-between gap-2">
                              <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${
                                user.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                                user.status === 'Pending' ? 'bg-amber-950 text-amber-400 border border-amber-500/30 animate-pulse' : 'bg-red-950 text-red-400 border border-red-500/30'
                              }`}>
                                {user.status}
                              </span>
                              {user.status !== 'Active' && user.role !== 'Super Admin' && (
                                <button
                                  onClick={() => handleUpdateUserStatus(user.id, 'Active')}
                                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                                >
                                  Approve & Activate
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 6. PORTAL CMS */}
            {activeSubTab === 'cms' && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-1">Dynamic Homepage CMS</h3>
                  <p className="text-xs text-slate-400">Modify landing text copy, support hotlines, and Floating WhatsApp configs or hero slides without touching code.</p>
                </div>

                {/* Secondary CMS Sub Tabs */}
                <div className="flex gap-2 border-b border-slate-800 pb-3">
                  <button
                    onClick={() => setCmsSection('copy')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      cmsSection === 'copy'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 border border-slate-850 hover:text-slate-200'
                    }`}
                  >
                    📄 Site Text & WhatsApp config
                  </button>
                  <button
                    onClick={() => setCmsSection('carousel')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      cmsSection === 'carousel'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 border border-slate-850 hover:text-slate-200'
                    }`}
                  >
                    🎠 Hero Carousel Manager (coparents.in)
                  </button>
                </div>

                {cmsSection === 'copy' ? (
                  <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6">
                    {/* Hero Copy */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">Homepage Hero Title</label>
                        <input
                          type="text" value={cmsHeroTitle} onChange={e => setCmsHeroTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">Homepage Hero Subtitle</label>
                        <input
                          type="text" value={cmsHeroSubtitle} onChange={e => setCmsHeroSubtitle(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* About Block */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">Homepage About Title</label>
                        <input
                          type="text" value={cmsAboutTitle} onChange={e => setCmsAboutTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">About Section Content Copy</label>
                        <textarea
                          rows={4} value={cmsAboutContent} onChange={e => setCmsAboutContent(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Floating WhatsApp Config */}
                    <div className="border-t border-slate-900 pt-6 space-y-4">
                      <h4 className="text-xs font-bold text-white font-mono uppercase tracking-widest border-l-2 border-emerald-500 pl-2">Floating WhatsApp Configuration</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                        <div>
                          <label className="block text-xs font-mono text-emerald-400 mb-2">WhatsApp Support Number</label>
                          <input
                            type="text" value={waPhone} onChange={e => setWaPhone(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-emerald-400 mb-2">Default Pre-filled Message</label>
                          <input
                            type="text" value={waMsg} onChange={e => setWaMsg(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center h-12">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox" checked={waEnabled} onChange={e => setWaEnabled(e.target.checked)}
                              className="rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-0"
                            />
                            <span className="text-xs text-slate-300 font-semibold uppercase font-mono">Enable Floating Widget</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-slate-900 flex justify-end">
                      <button
                        onClick={handleSaveCMS}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow"
                      >
                        <Check className="w-4 h-4" />
                        <span>Publish CMS Copy updates</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Carousel Slides List card */}
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-1">Live Home Slider Manager</h4>
                        <p className="text-xs text-slate-400">Add, edit, or disable large banner slides on the coparents.in homepage carousel.</p>
                      </div>
                      {!isAddingSlide && (
                        <button
                          onClick={() => {
                            setEditingSlide(null);
                            setSlideTitle('');
                            setSlideSubtitle('');
                            setSlideImage('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80');
                            setSlideBtnText('Explore Coaching');
                            setSlideBtnLink('/search?category=Coaching');
                            setSlideStatus('Published');
                            setSlideOrder(carouselSlides.length + 1);
                            setSlideVideoUrl('');
                            setIsAddingSlide(true);
                          }}
                          className="flex items-center gap-1 px-4 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs shadow cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Carousel Slide</span>
                        </button>
                      )}
                    </div>

                    {/* Add/Edit Slide form overlay */}
                    {isAddingSlide && (
                      <div ref={slideFormRef} className="bg-slate-950 rounded-2xl border-2 border-emerald-500/60 p-6 shadow-2xl space-y-4 transition-all">
                        <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-white">
                              {editingSlide ? `Edit Carousel Slide: "${editingSlide.title}"` : 'Add New Carousel Slide'}
                            </h4>
                            {editingSlide && (
                              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded uppercase font-bold">
                                Editing ID: {editingSlide.id}
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => {
                              setIsAddingSlide(false);
                              setEditingSlide(null);
                            }}
                            className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>

                        <form onSubmit={handleSaveSlide} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-emerald-400 mb-1">Slide Title *</label>
                            <input
                              type="text" required value={slideTitle} onChange={e => setSlideTitle(e.target.value)}
                              placeholder="e.g. Premium Coaching Institutes in Patna"
                              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-xs font-mono text-emerald-400">Image URL *</label>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => setSlideImage('/assets/hero_education_campus.jpg')}
                                  className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 px-2 py-0.5 rounded"
                                >
                                  Use Campus Asset
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSlideImage('/assets/hero_student_hostel.jpg')}
                                  className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 px-2 py-0.5 rounded"
                                >
                                  Use Hostel Asset
                                </button>
                              </div>
                            </div>
                            <input
                              type="text" required value={slideImage} onChange={e => setSlideImage(e.target.value)}
                              placeholder="/assets/hero_education_campus.jpg or https://..."
                              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                            />
                          </div>

                          {/* Live Image Preview Box */}
                          {slideImage && (
                            <div className="sm:col-span-2 relative h-32 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                              <img 
                                src={slideImage} 
                                alt="Slide Preview" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/assets/hero_education_campus.jpg';
                                }}
                              />
                              <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-slate-800">
                                Live Preview
                              </div>
                            </div>
                          )}

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-mono text-emerald-400 mb-1">Slide Subtitle / Description *</label>
                            <textarea
                              rows={2} required value={slideSubtitle} onChange={e => setSlideSubtitle(e.target.value)}
                              placeholder="Describe the highlight of this slide for parent/student visitors."
                              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-emerald-400 mb-1">Button Call-to-Action Text</label>
                            <input
                              type="text" value={slideBtnText} onChange={e => setSlideBtnText(e.target.value)}
                              placeholder="e.g. Find Classes"
                              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-emerald-400 mb-1">Button Redirect Link</label>
                            <input
                              type="text" value={slideBtnLink} onChange={e => setSlideBtnLink(e.target.value)}
                              placeholder="e.g. /search?category=Coaching"
                              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-emerald-400 mb-1">Optional YouTube/Video Guide URL</label>
                            <input
                              type="text" value={slideVideoUrl} onChange={e => setSlideVideoUrl(e.target.value)}
                              placeholder="https://youtube.com/..."
                              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                            />
                          </div>
                          <div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-mono text-emerald-400 mb-1">Display Order</label>
                                <input
                                  type="number" value={slideOrder} onChange={e => setSlideOrder(Number(e.target.value))}
                                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-mono text-emerald-400 mb-1">Visibility Status</label>
                                <select
                                  value={slideStatus} onChange={e => setSlideStatus(e.target.value as any)}
                                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                                >
                                  <option value="Published">Published (Live)</option>
                                  <option value="Hidden">Hidden (Draft)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="sm:col-span-2 flex justify-end gap-2 pt-4">
                            <button
                              type="button" onClick={() => setIsAddingSlide(false)}
                              className="px-4 py-2 text-xs bg-slate-900 hover:bg-slate-850 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 text-xs bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-all"
                            >
                              Save Carousel Slide
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Carousel slides Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {carouselSlides.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-slate-950 rounded-2xl border border-slate-850 text-slate-500 text-sm">
                          No slider slides found. Create one above!
                        </div>
                      ) : (
                        carouselSlides
                          .sort((a, b) => a.displayOrder - b.displayOrder)
                          .map((slide) => (
                            <div key={slide.id} className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/20 transition-all">
                              <div>
                                {/* Slide Image preview */}
                                <div className="h-40 relative overflow-hidden bg-slate-900">
                                  <img 
                                    src={slide.image} 
                                    alt={slide.title} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/assets/hero_education_campus.jpg';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                                  <div className="absolute top-3 left-3 flex gap-1.5">
                                    <span className="px-2 py-0.5 bg-slate-900/90 text-emerald-400 border border-slate-800 rounded text-[10px] font-mono">
                                      Order: {slide.displayOrder}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                      slide.status === 'Published' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' : 'bg-amber-950 text-amber-400 border border-amber-500/20'
                                    }`}>
                                      {slide.status}
                                    </span>
                                  </div>
                                </div>

                                <div className="p-5 space-y-2">
                                  <h4 className="text-sm font-bold text-white leading-snug">{slide.title}</h4>
                                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{slide.subtitle}</p>
                                  
                                  <div className="pt-3 border-t border-slate-900 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                                    <div>
                                      <span className="text-slate-500 block text-[9px] uppercase">Button Action</span>
                                      <span className="text-slate-300 font-semibold">{slide.buttonText}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500 block text-[9px] uppercase">Button Target</span>
                                      <span className="text-emerald-400 truncate block" title={slide.buttonLink}>{slide.buttonLink}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="p-5 pt-0 flex justify-end gap-2 border-t border-slate-900/50 mt-4">
                                <button
                                  onClick={() => startEditSlide(slide)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>Edit Slide</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteSlide(slide.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-red-400 rounded-lg text-xs font-semibold"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 7. REPORT DESK */}
            {activeSubTab === 'reports' && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-1">Ecosystem Report Generator</h3>
                  <p className="text-xs text-slate-400">Generate, compile, and download formal CSV Excel tables or Plain-Text PDFs representing partner and student metrics in Patna.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: 'Enquiries & Lead Sheet', type: 'enquiries', desc: 'Summary list of students and parents connecting with educational facilities.' },
                    { title: 'Coaching Class partners', type: 'coaching', desc: 'Comprehensive list of verified JEE/NEET classes, addresses, and admission charges.' },
                    { title: 'Verified Hostels & PG', type: 'hostel', desc: 'Secure accommodations details, fees plans, and representative contacts.' },
                    { title: 'Registered Students list', type: 'students', desc: 'Full active student user roster, usernames, verified phone logs.' },
                    { title: 'Study Libraries network', type: 'library', desc: 'Listing details, locations, and monthly desk rates of study libraries.' },
                    { title: 'Ecosystem Accounts ledger', type: 'users', desc: 'All database logins, roles (admins, coadmins, departments) and logs.' },
                  ].map((rep, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all">
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-white font-sans">{rep.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{rep.desc}</p>
                      </div>
                      <div className="flex gap-2 pt-6 border-t border-slate-900 mt-4">
                        <button
                          onClick={() => handleTriggerReport(rep.type, 'excel')}
                          className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Excel CSV</span>
                        </button>
                        <button
                          onClick={() => handleTriggerReport(rep.type, 'pdf')}
                          className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold"
                        >
                          <Download className="w-3.5 h-3.5 text-red-400" />
                          <span>PDF Text</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. SECURITY AUDIT LOGS */}
            {activeSubTab === 'logs' && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-1">Portal Action Audit Logs</h3>
                  <p className="text-xs text-slate-400">Strict regulatory log recording all staff logins, database insertions, listings deletions, and approval triggers.</p>
                </div>

                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-slate-900 text-slate-400 font-mono uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Action ID</th>
                          <th className="p-4">User</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Operation Trigger</th>
                          <th className="p-4">Time stamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-900/50">
                            <td className="p-4 font-mono text-slate-500">{log.id}</td>
                            <td className="p-4 font-bold text-white">{log.userName}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 bg-slate-900 rounded font-mono text-[9px] text-slate-300">
                                {log.userRole}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 bg-emerald-950/20 text-emerald-400 font-mono text-[10px] rounded mr-2 font-semibold">
                                {log.action}
                              </span>
                              <span className="text-slate-300 font-sans">{log.details}</span>
                            </td>
                            <td className="p-4 font-mono text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
