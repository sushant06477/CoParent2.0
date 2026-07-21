import React from 'react';
import { EducationService } from '../types';
import { Star, MapPin, Tag, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface FeaturedSectionsProps {
  services: EducationService[];
  onSelectService: (service: EducationService) => void;
  currentUser: any;
}

export default function FeaturedSections({ services, onSelectService, currentUser }: FeaturedSectionsProps) {
  // Get approved and featured listings
  const approvedServices = services.filter(s => s.status === 'Approved');
  
  // Group by service type
  const coachings = approvedServices.filter(s => s.type === 'coaching');
  const hostels = approvedServices.filter(s => s.type === 'hostel');
  const libraries = approvedServices.filter(s => s.type === 'library');
  const flats = approvedServices.filter(s => s.type === 'flat');
  const counsellors = approvedServices.filter(s => s.type === 'counselling');

  const handleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!currentUser) {
      alert('Please log in as a student or parent to bookmark Patna listings.');
      return;
    }
    const storageKey = `coparents_saved_${currentUser.id}`;
    const saved = localStorage.getItem(storageKey);
    let list: string[] = saved ? JSON.parse(saved) : [];
    if (list.includes(id)) {
      list = list.filter(x => x !== id);
      alert('Removed bookmark.');
    } else {
      list.push(id);
      alert('Listing bookmarked successfully! View it in your workspace dashboard.');
    }
    localStorage.setItem(storageKey, JSON.stringify(list));
  };

  const renderSection = (title: string, list: EducationService[], catId: string) => {
    if (list.length === 0) return null;

    return (
      <div className="space-y-6" id={`featured-section-${catId}`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          <span className="text-xs text-emerald-400 font-mono">Patna Verified</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.slice(0, 3).map((svc) => (
            <div
              key={svc.id}
              onClick={() => onSelectService(svc)}
              className="bg-slate-950 rounded-2xl border border-slate-850 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer shadow-lg relative"
            >
              {/* Image box */}
              <div className="relative h-44 bg-slate-900">
                <img
                  src={svc.images[0] || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=60'}
                  alt={svc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Bookmark trigger */}
                <button
                  onClick={(e) => handleBookmark(e, svc.id)}
                  title="Bookmark this partner"
                  className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-red-500 transition-colors z-10"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              {/* Card Contents */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      <strong className="text-slate-300">{svc.rating.toFixed(1)}</strong>
                      <span>({svc.reviewsCount} reviews)</span>
                    </span>
                    <span className="text-emerald-400 font-semibold">{svc.priceFees}</span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {svc.name}
                  </h4>

                  <p className="text-[10px] text-slate-500 flex items-center gap-0.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{svc.location}</span>
                  </p>

                  <p className="text-xs text-slate-400 mt-2.5 line-clamp-2">
                    {svc.shortDescription}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {svc.facilities.slice(0, 2).map((fac) => (
                      <span key={fac} className="text-[9px] px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded">
                        {fac}
                      </span>
                    ))}
                  </div>

                  <button className="text-[10px] font-mono tracking-wider font-bold text-emerald-400 uppercase flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>View Listing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-slate-900 text-slate-100 border-b border-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Main section title */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full uppercase tracking-widest">
            Directly Verified listings
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-3 tracking-tight">
            Featured Ecosystem Listings
          </h2>
          <p className="mt-2 text-slate-400 text-sm leading-relaxed">
            All partner details, on-site campus galleries, and price cards are rigorously audited by Patna verification officers.
          </p>
        </div>

        {/* Display categories in separate sliders/grids */}
        {renderSection('Verified Coaching Centers', coachings, 'coaching')}
        {renderSection('Featured Hostels & PGs', hostels, 'hostel')}
        {renderSection('Silent Study Zone Libraries', libraries, 'library')}
        {renderSection('Economic Student Flat Rentals', flats, 'flat')}
        {renderSection('Advisors & Career Counselling Desk', counsellors, 'counselling')}

      </div>
    </section>
  );
}
