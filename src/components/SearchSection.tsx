import React, { useState } from 'react';
import { EducationService } from '../types';
import { Search, MapPin, Tag, Star, ArrowRight, ShieldCheck, FileVideo, PhoneCall, Info } from 'lucide-react';

interface SearchSectionProps {
  services: EducationService[];
  onEnquireClick: (service: EducationService) => void;
  selectedCategory: string;
}

export default function SearchSection({ services, onEnquireClick, selectedCategory }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(selectedCategory || 'all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [selectedService, setSelectedService] = useState<EducationService | null>(null);

  // Derive unique Patna areas from existing services
  const patnaAreas = ['Boring Road', 'Kankarbagh', 'Rajendra Nagar', 'Mahendru', 'Bailey Road', 'Ashok Rajpath', 'Saguna More'];

  // Apply filters
  const filteredServices = services.filter((service) => {
    // 1. Category search
    const matchesCategory = categoryFilter === 'all' || service.type === categoryFilter.toLowerCase();
    
    // 2. Text Search (Name, courses, description, location)
    const normalizedQuery = searchQuery.toLowerCase();
    const matchesText = 
      service.name.toLowerCase().includes(normalizedQuery) ||
      service.location.toLowerCase().includes(normalizedQuery) ||
      service.shortDescription.toLowerCase().includes(normalizedQuery) ||
      (service.courses && service.courses.some(c => c.toLowerCase().includes(normalizedQuery)));

    // 3. Area filter
    const matchesArea = areaFilter === 'all' || service.location.toLowerCase().includes(areaFilter.toLowerCase());

    // 4. Price filter
    let matchesPrice = true;
    if (priceFilter !== 'all') {
      const priceText = service.priceFees.toLowerCase();
      if (priceFilter === 'budget') {
        matchesPrice = priceText.includes('800') || priceText.includes('1,500') || priceText.includes('6,500') || (priceText.includes('/ month') && !priceText.includes('12,000'));
      } else if (priceFilter === 'premium') {
        matchesPrice = priceText.includes('85,000') || priceText.includes('12,000');
      }
    }

    return matchesCategory && matchesText && matchesArea && matchesPrice;
  });

  return (
    <section className="py-12 bg-slate-900 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Explore Verified Educational Services in Patna
          </h2>
          <p className="mt-3 text-slate-400">
            Search, compare, and connect with transparently vetted coaching centers, study libraries, secure hostels, and student rooms across Patna, Bihar.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Text Search */}
            <div className="relative">
              <label className="block text-xs font-mono uppercase text-emerald-400 mb-2 font-medium">Search Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Enter course, coaching name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-white text-sm"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400 mb-2 font-medium">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:border-emerald-500 focus:outline-none text-white text-sm"
              >
                <option value="all">All Services</option>
                <option value="coaching">Coaching Institutes</option>
                <option value="hostel">Boys/Girls Hostels</option>
                <option value="library">Silent Libraries</option>
                <option value="flat">PG / Flats for Rent</option>
                <option value="counselling">Career Counselling</option>
              </select>
            </div>

            {/* Area / Locality */}
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400 mb-2 font-medium">Locality in Patna</label>
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:border-emerald-500 focus:outline-none text-white text-sm"
              >
                <option value="all">All Areas</option>
                {patnaAreas.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            {/* Price Plan Filter */}
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400 mb-2 font-medium">Fees / Budget Plan</label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:border-emerald-500 focus:outline-none text-white text-sm"
              >
                <option value="all">Any Price</option>
                <option value="budget">Budget / Standard (Under ₹8k/mo)</option>
                <option value="premium">Premium / Full Courses</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-slate-400">
            Found <strong className="text-emerald-400">{filteredServices.length}</strong> matching educational listings
          </span>
          {searchQuery || categoryFilter !== 'all' || areaFilter !== 'all' || priceFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setAreaFilter('all');
                setPriceFilter('all');
              }}
              className="text-xs text-emerald-400 hover:underline font-mono"
            >
              Clear All Filters
            </button>
          ) : null}
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-slate-950 rounded-2xl border border-slate-800/80 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden flex flex-col group shadow-lg shadow-black/30"
            >
              {/* Image Banner */}
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={service.images[0] || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=60'}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-mono tracking-wider font-semibold uppercase rounded-full bg-slate-950/80 text-emerald-400 border border-emerald-500/30">
                  {service.type}
                </div>
                {service.isFeatured && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-semibold rounded-full bg-emerald-500 text-slate-950">
                    FEATURED
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{service.rating.toFixed(1)}</span>
                    <span className="text-slate-500">({service.reviewsCount} reviews)</span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-400 font-mono">
                    {service.priceFees}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {service.name}
                </h3>

                <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  <span>{service.location}</span>
                </p>

                <p className="mt-3 text-sm text-slate-300 line-clamp-2 flex-1">
                  {service.shortDescription}
                </p>

                {/* Facilities tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {service.facilities.slice(0, 3).map((facility) => (
                    <span
                      key={facility}
                      className="text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-md text-slate-400"
                    >
                      {facility}
                    </span>
                  ))}
                  {service.facilities.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 bg-slate-900 text-slate-500">
                      +{service.facilities.length - 3} more
                    </span>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="mt-6 pt-4 border-t border-slate-900 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="flex-1 px-3 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onEnquireClick(service)}
                    className="px-3.5 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Connect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-slate-950 rounded-2xl border border-slate-800">
            <Info className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-lg">No verified educational services match your filters.</p>
            <p className="text-slate-600 text-sm mt-1">Try resetting the Patna localities or searching a broader topic.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg p-1 bg-slate-800 rounded-full"
            >
              ✕
            </button>

            {/* Modal Content */}
            <div className="relative h-60 rounded-xl overflow-hidden mb-6 bg-slate-950">
              <img
                src={selectedService.images[0]}
                alt={selectedService.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-[10px] font-mono bg-emerald-500 text-slate-950 px-2 py-1 rounded font-bold uppercase">
                  {selectedService.type}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">{selectedService.name}</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-mono">Location & Address</p>
                  <p className="text-sm font-semibold flex items-center gap-1 text-slate-200">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>{selectedService.contactInfo.address || selectedService.location}</span>
                  </p>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <p className="text-xs text-slate-400 uppercase font-mono">Charges / Fees</p>
                  <p className="text-lg font-bold text-emerald-400 font-mono">{selectedService.priceFees}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{selectedService.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  ({selectedService.reviewsCount} verified reviews) • Certified by coparents.in
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Full Overview</h4>
                <p className="text-slate-300 text-sm leading-relaxed mt-2">{selectedService.fullDescription}</p>
              </div>

              {selectedService.courses && (
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Available Batches / Courses</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedService.courses.map(course => (
                      <span key={course} className="text-xs px-3 py-1 bg-slate-950 border border-slate-800 text-emerald-400 rounded-lg">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Standard Facilities</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {selectedService.facilities.map(facility => (
                    <div key={facility} className="text-xs text-slate-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Representative Desk</p>
                  <p className="text-sm font-bold text-white">{selectedService.contactInfo.phone}</p>
                </div>
                <div className="flex gap-2">
                  {selectedService.videoUrl && (
                    <a
                      href={selectedService.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                    >
                      <FileVideo className="w-4 h-4 text-emerald-400" />
                      <span>Watch Tour</span>
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setSelectedService(null);
                      onEnquireClick(selectedService);
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Register Enquiry</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
