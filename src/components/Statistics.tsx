import React, { useEffect, useState } from 'react';
import { Users, Heart, GraduationCap, Home, BookOpen, Building, ShieldCheck } from 'lucide-react';

interface StatsProps {
  stats: {
    students: number;
    parents: number;
    coachings: number;
    hostels: number;
    libraries: number;
    flats: number;
    counsellors: number;
  };
}

export default function Statistics({ stats }: StatsProps) {
  const [counts, setCounts] = useState({
    students: 0,
    parents: 0,
    coachings: 0,
    hostels: 0,
    libraries: 0,
    flats: 0,
    counsellors: 0,
  });

  useEffect(() => {
    // Basic counter increment animation
    const duration = 1500; // ms
    const steps = 30;
    const stepTime = duration / steps;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      setCounts({
        students: Math.min(Math.round((stats.students / steps) * stepCount), stats.students),
        parents: Math.min(Math.round((stats.parents / steps) * stepCount), stats.parents),
        coachings: Math.min(Math.round((stats.coachings / steps) * stepCount), stats.coachings),
        hostels: Math.min(Math.round((stats.hostels / steps) * stepCount), stats.hostels),
        libraries: Math.min(Math.round((stats.libraries / steps) * stepCount), stats.libraries),
        flats: Math.min(Math.round((stats.flats / steps) * stepCount), stats.flats),
        counsellors: Math.min(Math.round((stats.counsellors / steps) * stepCount), stats.counsellors),
      });

      if (stepCount >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [stats]);

  const statsItems = [
    { label: 'Total Students', value: counts.students, icon: Users, suffix: '+', color: 'text-emerald-400' },
    { label: 'Total Parents', value: counts.parents, icon: Heart, suffix: '+', color: 'text-pink-400' },
    { label: 'Coaching Centers', value: counts.coachings, icon: GraduationCap, suffix: '', color: 'text-teal-400' },
    { label: 'Verified Hostels', value: counts.hostels, icon: Home, suffix: '', color: 'text-cyan-400' },
    { label: 'Silent Libraries', value: counts.libraries, icon: BookOpen, suffix: '', color: 'text-violet-400' },
    { label: 'Total Flats/PGs', value: counts.flats, icon: Building, suffix: '', color: 'text-amber-400' },
    { label: 'Advisors', value: counts.counsellors, icon: ShieldCheck, suffix: '+', color: 'text-rose-400' },
  ];

  return (
    <section className="py-16 bg-slate-950 border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ecosystem Growth & Impact
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Coparents.in is Patna’s largest verified network tracking resources dynamically.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {statsItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-900/60 p-5 rounded-2xl border border-slate-850 text-center flex flex-col items-center justify-center hover:bg-slate-900 transition-all shadow-md"
              >
                <div className="p-2.5 bg-slate-950/50 rounded-xl mb-3">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                  {item.value}
                  <span className={`${item.color} font-sans ml-0.5`}>{item.suffix}</span>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 mt-2">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
