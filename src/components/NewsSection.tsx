import React from 'react';
import { NewsItem } from '../types';
import { Calendar, ArrowUpRight, Newspaper } from 'lucide-react';

interface NewsProps {
  news: NewsItem[];
}

export default function NewsSection({ news }: NewsProps) {
  const publishedNews = news.filter(n => n.status === 'Published');

  return (
    <section className="py-16 bg-slate-950 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono tracking-widest uppercase font-semibold mb-2">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Patna Education Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Latest News & Portal Updates
            </h2>
          </div>
          <p className="mt-2 sm:mt-0 text-slate-400 text-sm max-w-md">
            Stay updated with exam schedules, notifications, coaching admissions, and hostel vacancies in Patna.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publishedNews.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-900/40 rounded-2xl border border-slate-850 p-6 flex flex-col sm:flex-row gap-5 hover:border-emerald-500/30 hover:bg-slate-900/60 transition-all group"
            >
              {item.image && (
                <div className="w-full sm:w-40 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-950 border border-slate-800">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {item.content}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono tracking-wider text-emerald-400 font-bold group-hover:underline cursor-pointer">
                  <span>Read Full Article</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
