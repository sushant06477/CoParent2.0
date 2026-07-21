import React from 'react';
import { 
  GraduationCap, 
  Home, 
  BookOpen, 
  Building, 
  Sparkles, 
  Award, 
   Compass 
} from 'lucide-react';

interface CategoryCardsProps {
  onCategorySelect: (category: string) => void;
}

export default function CategoryCards({ onCategorySelect }: CategoryCardsProps) {
  const categories = [
    {
      id: 'coaching',
      title: 'Coaching Institutes',
      description: 'JEE, NEET, BPSC, UPSC & general competitive studies centers.',
      icon: GraduationCap,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/20 text-emerald-400',
      count: '124+ Active'
    },
    {
      id: 'hostel',
      title: 'Boys & Girls Hostels',
      description: 'Safe lodgings with hygiene food, Wi-Fi & tight safety in Patna.',
      icon: Home,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/20 text-cyan-400',
      count: '210+ Verified'
    },
    {
      id: 'library',
      title: 'Silent Study Libraries',
      description: '24/7 personalized silent cabins, high-speed fiber internet.',
      icon: BookOpen,
      color: 'from-violet-500/20 to-purple-500/10 border-violet-500/20 text-violet-400',
      count: '95+ Available'
    },
    {
      id: 'flat',
      title: 'Flats & PG Rentals',
      description: 'Student-friendly sharing apartments near major coaching lanes.',
      icon: Building,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/20 text-amber-400',
      count: '340+ Units'
    },
    {
      id: 'counselling',
      title: 'Career Counselling',
      description: 'One-on-one psychometric profiling & admissions counselling.',
      icon: Compass,
      color: 'from-pink-500/20 to-rose-500/10 border-pink-500/20 text-pink-400',
      count: '45+ Advisors'
    },
    {
      id: 'scholarships',
      title: 'Bihar Scholarships',
      description: 'Find government student credit cards & scholarship details.',
      icon: Award,
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/20 text-blue-400',
      count: 'Updated Live'
    },
    {
      id: 'guidance',
      title: 'Career Guidance',
      description: 'Free articles, batch planners & competitive exam strategies.',
      icon: Sparkles,
      color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/20 text-teal-300',
      count: 'Expert Curated'
    }
  ];

  return (
    <section className="py-12 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Browse Patna’s Educational Categories
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Discover verified resources. Select any category to launch dynamic filters instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                id={`cat-card-${cat.id}`}
                onClick={() => onCategorySelect(cat.id)}
                className={`p-6 rounded-2xl border bg-gradient-to-br ${cat.color} hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group`}
              >
                <div>
                  <div className="p-3 bg-slate-950/40 rounded-xl inline-block mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 font-sans group-hover:text-white/90">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono tracking-wider text-white/50 uppercase font-semibold">
                  <span>Capacity</span>
                  <span className="text-white/80">{cat.count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
