import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, User } from 'lucide-react';
import { Testimonial } from '../types';

interface ReviewsSliderProps {
  testimonials: Testimonial[];
}

export default function ReviewsSlider({ testimonials }: ReviewsSliderProps) {
  const [current, setCurrent] = useState(0);

  const approvedTestimonials = testimonials.filter(t => t.status === 'Approved');

  if (approvedTestimonials.length === 0) return null;

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % approvedTestimonials.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? approvedTestimonials.length - 1 : prev - 1));
  };

  const review = approvedTestimonials[current];

  return (
    <section className="py-16 bg-slate-950 border-b border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Student & Parent Reviews
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Hear directly from families who successfully planned their stay and coaching in Patna.
          </p>
        </div>

        {/* Review card */}
        <div className="bg-slate-900/40 border border-slate-850 p-6 sm:p-8 rounded-2xl relative shadow-lg">
          <div className="absolute top-4 right-6 text-emerald-400/10">
            <Quote className="w-16 h-16" />
          </div>

          <div className="flex flex-col sm:flex-row gap-5 items-center">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-750 overflow-hidden shrink-0 shadow flex items-center justify-center">
              {review.image ? (
                <img 
                  src={review.image} 
                  alt={review.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-slate-400" />
              )}
            </div>

            {/* Body */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              {/* Rating */}
              <div className="flex justify-center sm:justify-start gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star 
                    key={idx}
                    className={`w-4 h-4 ${idx < review.rating ? 'text-amber-400 fill-current' : 'text-slate-600'}`}
                  />
                ))}
              </div>

              <p className="text-slate-300 text-sm leading-relaxed italic">
                "{review.content}"
              </p>

              <div>
                <h4 className="text-sm font-bold text-white">{review.name}</h4>
                <p className="text-xs text-emerald-400 font-mono">{review.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          {approvedTestimonials.length > 1 && (
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                <span>{current + 1}</span>
                <span>/</span>
                <span>{approvedTestimonials.length}</span>
              </div>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
