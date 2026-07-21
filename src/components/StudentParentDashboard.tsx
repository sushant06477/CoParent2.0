import React, { useState, useEffect } from 'react';
import { User, Enquiry, EducationService, Testimonial } from '../types';
import { 
  User as UserIcon, BookMarked, ClipboardList, Bell, Download, Star, RefreshCw, Send, CheckCircle 
} from 'lucide-react';

interface StudentParentDashboardProps {
  currentUser: User;
  services: EducationService[];
}

export default function StudentParentDashboard({ currentUser, services }: StudentParentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'applications' | 'saved' | 'review' | 'downloads'>('profile');
  const [myEnquiries, setMyEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Review state
  const [targetService, setTargetService] = useState<string>('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Bookmarks saved in local storage simulated
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const enqRes = await fetch('/api/enquiries').then(r => r.json());
      // Filter enquiries filed by current user based on name or phone
      const filtered = enqRes.filter((e: any) => 
        e.mobileNumber === currentUser.mobile || e.fullName.toLowerCase() === currentUser.name.toLowerCase()
      );
      setMyEnquiries(filtered);

      // Load bookmarks
      const bms = localStorage.getItem(`coparents_saved_${currentUser.id}`);
      if (bms) {
        setSavedIds(JSON.parse(bms));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [currentUser]);

  const handleRemoveBookmark = (id: string) => {
    const updated = savedIds.filter(x => x !== id);
    setSavedIds(updated);
    localStorage.setItem(`coparents_saved_${currentUser.id}`, JSON.stringify(updated));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetService || !reviewText) return;

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentUser.name,
          role: `${currentUser.role}, ${currentUser.email || 'Patna Student'}`,
          content: reviewText,
          rating,
          image: '',
          status: 'Pending Approval' // Sent to Super Admin queue!
        })
      });

      if (response.ok) {
        setReviewSuccess(true);
        setReviewText('');
        setTargetService('');
        setTimeout(() => setReviewSuccess(false), 5000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const savedServices = services.filter(s => savedIds.includes(s.id));

  // Mock download materials for Patna competitive exams
  const downloadsList = [
    { title: 'Patna IIT Academy JEE Physics Formula Book', size: '2.4 MB', format: 'PDF' },
    { title: 'BPSC GK Notes Bihar General Studies 2026', size: '5.1 MB', format: 'PDF' },
    { title: 'Bihar Student Credit Card Process Document', size: '1.2 MB', format: 'PDF' },
    { title: 'Best Silent Libraries near Boring Road List', size: '840 KB', format: 'PDF' },
  ];

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400 text-sm font-mono flex flex-col items-center gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
        <span>Syncing student workspace...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header banner */}
        <div className="bg-slate-950 rounded-2xl border border-slate-850 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
              {currentUser.name[0]}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded uppercase">
                {currentUser.role} Account
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{currentUser.name}</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">📱 {currentUser.mobile} | Patna Workspace</p>
            </div>
          </div>
          
          <button 
            onClick={fetchUserData}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Connection state</span>
          </button>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-3 mb-6">
          {[
            { id: 'profile', label: 'My profile', icon: UserIcon },
            { id: 'applications', label: `My Applications (${myEnquiries.length})`, icon: ClipboardList },
            { id: 'saved', label: `Bookmarks (${savedServices.length})`, icon: BookMarked },
            { id: 'review', label: 'Rate / Write Review', icon: Star },
            { id: 'downloads', label: 'Study Downloads', icon: Download },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950 text-slate-400 border border-slate-850 hover:text-slate-200 hover:border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          
          {/* 1. PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-slate-950 rounded-2xl border border-slate-850 p-6 space-y-4 max-w-xl">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider border-b border-slate-900 pb-3">
                Account Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 block">Full Name</span>
                  <strong className="text-white font-semibold text-sm">{currentUser.name}</strong>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 block">Portal Username</span>
                  <strong className="text-emerald-400 font-mono text-sm">@{currentUser.username}</strong>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 block">Registered Phone</span>
                  <strong className="text-white font-mono text-sm">{currentUser.mobile}</strong>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 block">Email Address</span>
                  <strong className="text-white text-sm">{currentUser.email || 'N/A'}</strong>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 block">Role Permission</span>
                  <strong className="text-white text-sm">{currentUser.role}</strong>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 block">Locality City</span>
                  <strong className="text-white text-sm">Patna, Bihar</strong>
                </div>
              </div>
            </div>
          )}

          {/* 2. APPLICATIONS / ENQUIRIES HISTORY */}
          {activeTab === 'applications' && (
            <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl space-y-5">
              <div className="border-b border-slate-900 pb-3">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Enquiries filed on coparents.in
                </h3>
                <p className="text-xs text-slate-400 mt-1">Live status tracking of your connections with Patna coaching centers and lodgings.</p>
              </div>

              {myEnquiries.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  📝 You haven't registered any connection enquiries yet. Select a service and click "Connect".
                </div>
              ) : (
                <div className="space-y-4">
                  {myEnquiries.map((enq) => (
                    <div key={enq.id} className="bg-slate-900/40 border border-slate-850 p-5 rounded-xl space-y-3">
                      <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-900 pb-2.5">
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">{enq.interestedService} request</span>
                          <h4 className="text-base font-bold text-white mt-1">Campus Locality: {enq.areaLocality}</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Submitted: {new Date(enq.createdAt).toLocaleString()}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded font-mono text-[9px] font-bold ${
                          enq.status === 'New' ? 'bg-blue-950 text-blue-400' :
                          enq.status === 'Contacted' ? 'bg-amber-950 text-amber-400' :
                          enq.status === 'In Progress' ? 'bg-purple-950 text-purple-400' : 'bg-emerald-950 text-emerald-400'
                        }`}>
                          {enq.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300">
                        {enq.preferredCourse && <p><strong>Preferred Course:</strong> {enq.preferredCourse}</p>}
                        {enq.message && <p className="mt-2 text-slate-400 font-sans italic">"{enq.message}"</p>}
                      </div>

                      {/* Department Callbacks feedback notes */}
                      {enq.notes && (
                        <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg font-mono">
                          <strong>Desk Feedback:</strong> "{enq.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. BOOKMARKED ITEMS */}
          {activeTab === 'saved' && (
            <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider border-b border-slate-900 pb-3">
                Saved Classrooms & Accommodations
              </h3>

              {savedServices.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  🔖 Your bookmarks folder is currently empty. Explore listings and bookmark items to save.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedServices.map((svc) => (
                    <div key={svc.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs">
                      <div>
                        <span className="text-[9px] font-mono text-emerald-400 font-semibold uppercase">{svc.type}</span>
                        <h4 className="text-sm font-bold text-white mt-1">{svc.name}</h4>
                        <p className="text-slate-400 text-[11px] mt-0.5">📍 {svc.location} • {svc.priceFees}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveBookmark(svc.id)}
                        className="text-xs text-red-400 hover:underline font-mono"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. RATE & WRITE TESTIMONIALS */}
          {activeTab === 'review' && (
            <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl space-y-5 max-w-xl">
              <div className="border-b border-slate-900 pb-3">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Write verified Review / Rating
                </h3>
                <p className="text-xs text-slate-400 mt-1">Submit your rating and descriptions. Authentic reviews help parents make correct choices.</p>
              </div>

              {reviewSuccess ? (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Review submitted successfully! It is queued for Super Admin audit before publishing.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-mono uppercase">Select Partner Listing</label>
                    <select
                      value={targetService}
                      onChange={(e) => setTargetService(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    >
                      <option value="">-- Choose verified partner --</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1.5 font-mono uppercase">Rating Grade (out of 5 ★)</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold text-amber-400"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5/5 Stars (Outstanding)</option>
                      <option value={4}>⭐⭐⭐⭐ 4/5 Stars (Very Good)</option>
                      <option value={3}>⭐⭐⭐ 3/5 Stars (Satisfactory)</option>
                      <option value={2}>⭐⭐ 2/5 Stars (Poor)</option>
                      <option value={1}>⭐ 1/5 Star (Unacceptable)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1.5 font-mono uppercase">Your Honest Experience Description</label>
                    <textarea
                      rows={3}
                      placeholder="Share details on food hygiene, internet speed, classroom faculties or coaching behavior..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit to Admin Queue</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 5. STUDY DOWNLOADS */}
          {activeTab === 'downloads' && (
            <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider border-b border-slate-900 pb-3">
                Patna Exam Preparation Materials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {downloadsList.map((doc, idx) => (
                  <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs">
                    <div>
                      <h4 className="font-bold text-white">{doc.title}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{doc.size} • {doc.format}</p>
                    </div>
                    <button
                      onClick={() => alert(`Simulated Download started: ${doc.title}`)}
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-emerald-400 hover:text-emerald-300 font-bold rounded-lg border border-slate-800"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
