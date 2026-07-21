import React, { useState, useEffect } from 'react';
import { CarouselSlide } from '../types';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroCarouselProps {
  slides: CarouselSlide[];
  onSearchClick: () => void;
}

export default function HeroCarousel({ slides, onSearchClick }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  const activeSlides = Array.isArray(slides) ? slides.filter(s => s && s.status === 'Published') : [];

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const handlePrev = () => {
    setCurrent(prev => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent(prev => (prev + 1) % activeSlides.length);
  };

  const slide = activeSlides[current];

  return (
    <div className="relative h-[480px] md:h-[580px] bg-slate-950 overflow-hidden w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background image */}
          <img 
            src={slide.image} 
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = slide.displayOrder === 2 ? '/assets/hero_student_hostel.jpg' : '/assets/hero_education_campus.jpg';
            }}
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/20" />
          
          {/* Slide Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl text-left">
                <motion.span 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block text-xs md:text-sm font-semibold tracking-widest text-emerald-400 font-mono uppercase bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-full mb-4"
                >
                  Patna, Bihar Education Ecosystem
                </motion.span>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight"
                >
                  {slide.title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 text-base md:text-lg text-slate-300 font-sans leading-relaxed"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 flex flex-wrap gap-4"
                >
                  <a
                    href={slide.buttonLink}
                    id={`carousel-btn-${slide.id}`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    {slide.buttonText}
                  </a>
                  {slide.videoUrl && (
                    <a
                      href={slide.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900/80 border border-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg transition-all"
                    >
                      <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                      <span>Watch Video Guide</span>
                    </a>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            id="carousel-prev-btn"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 hover:bg-emerald-500 hover:text-slate-950 text-slate-400 border border-slate-800 hover:border-emerald-400 transition-all z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            id="carousel-next-btn"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 hover:bg-emerald-500 hover:text-slate-950 text-slate-400 border border-slate-800 hover:border-emerald-400 transition-all z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === current ? 'bg-emerald-400 w-8' : 'bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
