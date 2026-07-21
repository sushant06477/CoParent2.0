import React, { useState } from 'react';
import { Image, Video, Film, Eye, Grid } from 'lucide-react';

export default function PhotoGallery() {
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [activeAlbum, setActiveAlbum] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<{ url: string; type: 'image' | 'video'; title: string } | null>(null);

  const albums = ['all', 'Classrooms', 'Libraries', 'Hostels', 'Student Life'];

  const galleryItems = [
    {
      id: 'g-1',
      type: 'image',
      album: 'Classrooms',
      title: 'Smart Classroom Lecture',
      url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'g-2',
      type: 'image',
      album: 'Libraries',
      title: 'Silent Study Desk Cabins',
      url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'g-3',
      type: 'image',
      album: 'Hostels',
      title: 'Double Sharing Hostel Bed Room',
      url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'g-4',
      type: 'image',
      album: 'Student Life',
      title: 'Doubt Solving Interactive Class',
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'g-5',
      type: 'video',
      album: 'Hostels',
      title: 'Hostel Dining Hall & Meal Hygiene Video',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4', // Free demo MP4
      thumbnail: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'g-6',
      type: 'video',
      album: 'Libraries',
      title: '360 Tour: Silent Library Setup',
      url: 'https://www.w3schools.com/html/movie.mp4', // Free demo MP4
      thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const filteredItems = galleryItems.filter(item => {
    const matchesMedia = filter === 'all' || item.type === filter;
    const matchesAlbum = activeAlbum === 'all' || item.album === activeAlbum;
    return matchesMedia && matchesAlbum;
  });

  return (
    <section className="py-16 bg-slate-900 border-b border-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Patna Education Photo & Video Gallery
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Browse through unlimited dynamic albums displaying real, verified on-site facility structures.
          </p>
        </div>

        {/* Filters and Album bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 border-b border-slate-800 pb-5">
          {/* Album Selector */}
          <div className="flex flex-wrap gap-2">
            {albums.map(album => (
              <button
                key={album}
                onClick={() => setActiveAlbum(album)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeAlbum === album 
                    ? 'bg-emerald-500 text-slate-950 font-bold' 
                    : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {album === 'all' ? 'All Albums' : album}
              </button>
            ))}
          </div>

          {/* Media Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setFilter('all')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                filter === 'all' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>All Media</span>
            </button>
            <button
              onClick={() => setFilter('image')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                filter === 'image' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              <span>Images</span>
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                filter === 'video' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Videos</span>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden relative group aspect-video cursor-pointer shadow-md"
              onClick={() => setLightboxItem({ url: item.url, type: item.type as any, title: item.title })}
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-3.5 bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 rounded-full shadow-lg scale-95 group-hover:scale-100 transition-transform">
                      <Film className="w-5 h-5 fill-current" />
                    </div>
                  </div>
                </div>
              )}

              {/* Hover Details Card */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded uppercase">
                    {item.album}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5">{item.title}</h4>
                </div>
                <div className="p-1.5 bg-slate-900 rounded-lg text-slate-400">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No dynamic media items loaded in this album category yet.
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-3 shadow-2xl">
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 text-white hover:text-emerald-400 font-bold text-lg p-1.5 bg-slate-950/80 rounded-full z-10"
            >
              ✕
            </button>

            {lightboxItem.type === 'image' ? (
              <img
                src={lightboxItem.url}
                alt={lightboxItem.title}
                className="w-full max-h-[70vh] object-contain rounded-lg bg-slate-950"
              />
            ) : (
              <video
                src={lightboxItem.url}
                controls
                autoPlay
                className="w-full max-h-[70vh] object-contain rounded-lg bg-slate-950"
              />
            )}

            <div className="p-3 text-center border-t border-slate-800 mt-2">
              <h4 className="text-base font-bold text-white">{lightboxItem.title}</h4>
              <p className="text-xs text-emerald-400 font-mono mt-0.5 uppercase tracking-widest">{lightboxItem.type} Preview</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
