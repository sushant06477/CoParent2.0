import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Trophy } from 'lucide-react';

export default function SuccessStories() {
  const [current, setCurrent] = useState(0);

  const stories = [
    {
      id: 1,
      name: 'Aditya Raj',
      rank: 'JEE Advanced Rank 142 (2025)',
      origin: 'Originally from Gaya, prepped at Boring Road, Patna',
      story: 'Moving to Patna was intimidating. Coparents directory helped my father locate a library that was peaceful and a hostel near my classes with proper hygienic food. That mental peace was a huge contributor to my preparation!',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      name: 'Shreya Kumari',
      rank: 'NEET Score 695 / 720 (2025)',
      origin: 'Originally from Muzaffarpur, prepped at Kankarbagh, Patna',
      story: 'I spent weeks searching for a safe girls hostel in Patna. The verified list here with actual images and fee transparency saved us from local brokerage. I could focus 100% on biology and chemistry.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      name: 'Pankaj Kumar Yadav',
      rank: 'BPSC 69th Rank 18 (2025)',
      origin: 'Originally from Saharsa, prepped at Ashok Rajpath, Patna',
      story: 'For civil services, self-study is everything. Finding Chanakya Silent Library on this platform was a blessing. Fully air-conditioned, personal cabin, and perfect study environment. Highly recommend coparents.in!',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const currentStory = stories[current];

  return (
    <section className="py-16 bg-slate-900 border-b border-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex p-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl mb-3">
            <Trophy className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Success Stories from Patna
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Inspiring academic triumphs of Bihar’s outstanding students guided by verified local centers.
          </p>
        </div>

        {/* Carousel Box */}
        <div className="bg-slate-950 rounded-3xl border border-slate-850 p-6 sm:p-10 relative shadow-2xl flex flex-col md:flex-row items-center gap-6 sm:gap-10">
          <div className="absolute top-6 left-6 text-emerald-400/20">
            <Quote className="w-20 h-20 rotate-180" />
          </div>

          {/* Student Profile */}
          <div className="w-24 sm:w-32 h-24 sm:32 rounded-2xl overflow-hidden border border-emerald-500/20 shrink-0 shadow-lg relative">
            <img 
              src={currentStory.avatar} 
              alt={currentStory.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Story Body */}
          <div className="flex-1 text-center md:text-left z-10 space-y-4">
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed italic">
              "{currentStory.story}"
            </p>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">{currentStory.name}</h4>
              <p className="text-xs sm:text-sm font-semibold text-emerald-400 font-mono">{currentStory.rank}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{currentStory.origin}</p>
            </div>
          </div>

          {/* Manual Controller Navigation */}
          <div className="flex md:flex-col gap-2 shrink-0">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
