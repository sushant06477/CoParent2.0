import React, { useState, useEffect } from 'react';
import { User, EducationService, Enquiry, AuditLog } from '../types';
import { 
  Building, AlertTriangle, Eye, Edit, CheckCircle, RefreshCw, PhoneCall, Info, HelpCircle, ShieldAlert, ArrowRight, Save 
} from 'lucide-react';

interface DepartmentDashboardProps {
  currentUser: User;
  onRefreshData: () => void;
}

export default function DepartmentDashboard({ currentUser, onRefreshData }: DepartmentDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [myServices, setMyServices] = useState<EducationService[]>([]);
  const [assignedEnquiries, setAssignedEnquiries] = useState<Enquiry[]>([]);
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [priceFees, setPriceFees] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [facilities, setFacilities] = useState('');

  const [notesInput, setNotesInput] = useState<Record<string, string>>({});

  const fetchDeptData = async () => {
    try {
      setLoading(true);
      const [svcRes, enqRes] = await Promise.all([
        fetch(`/api/services?includePending=true&createdBy=${currentUser.id}`).then(r => r.json()),
        fetch('/api/enquiries').then(r => r.json())
      ]);

      setMyServices(svcRes);

      // Privacy Guard: Super Admin has complete control over student enquiries.
      // Department / Partner users ONLY see enquiries that Super Admin explicitly assigned/forwarded to them.
      const filteredEnq = enqRes.filter((e: any) => 
        e.assignedToDepartment && (
          e.assignedToDepartment === currentUser.role ||
          e.assignedToDepartment === currentUser.id ||
          e.assignedToDepartment === currentUser.username ||
          e.assignedToDepartment === currentUser.departmentId ||
          e.assignedToDepartment === currentUser.name
        )
      );
      setAssignedEnquiries(filteredEnq);

      // Initialize notes inputs
      const notes: Record<string, string> = {};
      filteredEnq.forEach((e: any) => {
        notes[e.id] = e.notes || '';
      });
      setNotesInput(notes);

      // Pre-fill form if there's a service
      if (svcRes.length > 0) {
        const service = svcRes[0];
        setName(service.name);
        setLocation(service.location);
        setPriceFees(service.priceFees);
        setShortDescription(service.shortDescription);
        setFullDescription(service.fullDescription);
        setPhone(service.contactInfo?.phone || '');
        setEmail(service.contactInfo?.email || '');
        setAddress(service.contactInfo?.address || '');
        setFacilities(service.facilities?.join(', ') || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeptData();
  }, [currentUser]);

  const handleUpdateNotes = async (enquiryId: string) => {
    try {
      const response = await fetch(`/api/enquiries/${enquiryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          notes: notesInput[enquiryId], 
          status: 'In Progress',
          assignedToDepartment: currentUser.role
        })
      });
      if (response.ok) {
        alert('Enquiry interaction notes updated and assigned successfully!');
        fetchDeptData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (enquiryId: string, status: string) => {
    try {
      const response = await fetch(`/api/enquiries/${enquiryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchDeptData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Listing Add/Edit (Sends to Pending Approval state)
  const handleSubmitChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      location,
      priceFees,
      shortDescription,
      fullDescription,
      facilities: facilities.split(',').map(f => f.trim()).filter(Boolean),
      contactInfo: { phone, email, address },
      userRole: currentUser.role,
      createdBy: currentUser.id
    };

    try {
      let url = '/api/services';
      let method = 'POST';
      
      // If we already have a service listing, edit it!
      if (myServices.length > 0) {
        url = `/api/services/${myServices[0].id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Your changes have been submitted to the Super Admin. It will become live immediately upon Super Admin authorization.');
        setIsEditing(false);
        fetchDeptData();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Soft delete request
  const handleDeleteRequest = async () => {
    if (!myServices[0]) return;
    if (!window.confirm('Request the Super Admin to delete your partner listing?')) return;
    try {
      const response = await fetch(`/api/services/${myServices[0].id}?userRole=${currentUser.role}&userId=${currentUser.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('Listing deletion request submitted for Admin Approval.');
        fetchDeptData();
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400 text-sm font-mono flex flex-col items-center gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
        <span>Syncing department records...</span>
      </div>
    );
  }

  const myService = myServices[0];

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded uppercase">
              {currentUser.role} Desk Partner
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
              Partner Hub Control panel
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Active Partner Account: <strong className="text-slate-300">{currentUser.name}</strong>
            </p>
          </div>
          
          <button 
            onClick={fetchDeptData}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-950 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Desk logs</span>
          </button>
        </div>

        {/* Warning Approval workflow reminder */}
        <div className="bg-slate-950 border border-amber-500/10 p-5 rounded-2xl flex items-start gap-4 mb-8">
          <div className="p-2 bg-amber-500/15 text-amber-400 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Ecosystem Approval Protocol</h4>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              No department can publish directly. Adds, modifications, fee restructuring, facilities updates, or gallery uploads enter a <strong>Pending Approval</strong> state. Changes appear on coparents.in immediately after the Super Admin authorizes them.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Manage Listing */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-950 rounded-2xl border border-slate-850 p-6 space-y-5">
              <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-400" />
                  <span>My Brand Listing</span>
                </h3>
                {myService && (
                  <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                    myService.status === 'Approved' ? 'bg-emerald-950 text-emerald-400' :
                    myService.status === 'Rejected' ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {myService.status}
                  </span>
                )}
              </div>

              {!myService && !isEditing ? (
                <div className="text-center py-6 space-y-4">
                  <p className="text-xs text-slate-400">You do not have a verified listing mapped to this account yet.</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold"
                  >
                    Setup My Brand Listing
                  </button>
                </div>
              ) : isEditing ? (
                <form onSubmit={handleSubmitChange} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Brand Name</label>
                    <input
                      type="text" required value={name} onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Area / Locality</label>
                    <input
                      type="text" required value={location} onChange={e => setLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Price Plan / Monthly Fees</label>
                    <input
                      type="text" required value={priceFees} onChange={e => setPriceFees(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">One Line Tagline</label>
                    <input
                      type="text" required value={shortDescription} onChange={e => setShortDescription(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Complete Overview Description</label>
                    <textarea
                      rows={4} value={fullDescription} onChange={e => setFullDescription(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Facilities (comma separated)</label>
                    <input
                      type="text" value={facilities} onChange={e => setFacilities(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Desk Contact Phone</label>
                    <input
                      type="text" value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Representative Email</label>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Campus Physical Address</label>
                    <input
                      type="text" value={address} onChange={e => setAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-900">
                    <button
                      type="button" onClick={() => setIsEditing(false)}
                      className="flex-1 py-2 bg-slate-900 hover:bg-slate-850 rounded-xl text-xs border border-slate-800 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Submit Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Rejection comments warning */}
                  {myService.status === 'Rejected' && myService.rejectionRemarks && (
                    <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs rounded-xl font-mono">
                      <strong>Rejection remarks:</strong> "{myService.rejectionRemarks}"
                    </div>
                  )}

                  {myService.status === 'Pending Approval' && myService.pendingChanges && (
                    <div className="p-3 bg-amber-950/40 border border-amber-500/10 text-amber-400 text-xs rounded-xl flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Updates pending Super Admin clearance. Current details below.</span>
                    </div>
                  )}

                  <div className="space-y-2.5 text-xs text-slate-300">
                    <p><strong>Name:</strong> <span className="text-white font-bold">{myService.name}</span></p>
                    <p><strong>Locality:</strong> {myService.location}</p>
                    <p><strong>Rate Structure:</strong> <span className="text-emerald-400 font-mono font-bold">{myService.priceFees}</span></p>
                    <p><strong>Tagline:</strong> {myService.shortDescription}</p>
                    <p><strong>Desk Contact:</strong> {myService.contactInfo.phone}</p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-900">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all"
                    >
                      Edit details
                    </button>
                    <button
                      onClick={handleDeleteRequest}
                      className="px-3.5 py-2 bg-red-950/20 text-red-400 border border-transparent hover:border-red-900/30 text-xs rounded-xl"
                      title="Request deletion"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Enquiries Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-950 rounded-2xl border border-slate-850 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider border-b border-slate-900 pb-3">
                Assigned Student Leads / Enquiries ({assignedEnquiries.length})
              </h3>

              {assignedEnquiries.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  📭 No student connections matching your service classification received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedEnquiries.map((enq) => (
                    <div key={enq.id} className="bg-slate-900/60 border border-slate-850 p-5 rounded-xl space-y-3 relative">
                      <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-900 pb-2.5">
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{enq.userType}</span>
                          <h4 className="text-sm font-bold text-white mt-1">{enq.fullName}</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">📱 {enq.mobileNumber}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                            enq.status === 'New' ? 'bg-blue-950 text-blue-400' :
                            enq.status === 'Contacted' ? 'bg-amber-950 text-amber-400' :
                            enq.status === 'In Progress' ? 'bg-purple-950 text-purple-400' : 'bg-emerald-950 text-emerald-400'
                          }`}>
                            {enq.status}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300">
                        <p><strong>Locality preference:</strong> {enq.areaLocality}</p>
                        {enq.preferredCourse && <p><strong>Preferred Course:</strong> {enq.preferredCourse}</p>}
                        {enq.message && <p className="mt-2 text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">{enq.message}</p>}
                      </div>

                      {/* Desk interactive notes */}
                      <div className="pt-3 border-t border-slate-900 space-y-2">
                        <label className="block text-[10px] font-mono text-slate-500 uppercase">Interaction Notes</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add phone callback notes, schedule visit..."
                            value={notesInput[enq.id] || ''}
                            onChange={(e) => setNotesInput({ ...notesInput, [enq.id]: e.target.value })}
                            className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                          />
                          <button
                            onClick={() => handleUpdateNotes(enq.id)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>
                        </div>
                      </div>

                      {/* Manual Quick State toggler */}
                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          onClick={() => handleUpdateStatus(enq.id, 'Contacted')}
                          className="px-2.5 py-1 text-[10px] font-mono bg-slate-950 border border-slate-800 hover:border-slate-700 text-amber-400 rounded-md"
                        >
                          Mark Contacted
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(enq.id, 'Closed')}
                          className="px-2.5 py-1 text-[10px] font-mono bg-slate-950 border border-slate-800 hover:border-slate-700 text-emerald-400 rounded-md"
                        >
                          Mark Completed
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
