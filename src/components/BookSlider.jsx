import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Tag, Sparkles, CheckCircle2 } from 'lucide-react';

export default function BookSlider({ books, onNavigateToLabels }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Color gradient palette for book cards
  const getThemeGradient = (ddc) => {
    if (ddc.startsWith('297') || ddc.startsWith('2')) {
      return 'from-emerald-700 via-teal-800 to-emerald-900';
    }
    if (ddc.startsWith('5')) {
      return 'from-sky-700 via-blue-800 to-indigo-900';
    }
    if (ddc.startsWith('8')) {
      return 'from-rose-700 via-pink-800 to-purple-900';
    }
    return 'from-slate-700 via-slate-800 to-slate-900';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs relative">
      
      {/* Slider Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Koleksi Buku Pilihan TBM
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geser ke kanan atau kiri untuk melihat rekomendasi bacaan & nomor panggil buku
          </p>
        </div>

        {/* Navigation Arrows for the Book Shelf */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Geser ke kiri"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Geser ke kanan"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {books.map((b) => {
          const gradient = getThemeGradient(b.ddc);
          return (
            <div
              key={b.id}
              className="min-w-[240px] sm:min-w-[270px] max-w-[270px] shrink-0 bg-slate-50 rounded-xl border border-slate-200 p-4 snap-start flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all duration-200 group"
            >
              <div>
                {/* Book Spine Simulation Graphic */}
                <div className={`h-36 rounded-lg bg-gradient-to-br ${gradient} text-white p-3.5 flex flex-col justify-between shadow-xs relative overflow-hidden mb-3 group-hover:scale-[1.02] transition-transform`}>
                  
                  {/* Spine Ribs Simulation */}
                  <div className="absolute left-2 top-0 bottom-0 w-1 bg-white/20 blur-[0.5px]"></div>

                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[9px] font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded text-white border border-white/30">
                      {b.code}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      b.available > 0 ? 'bg-emerald-400/90 text-slate-950 font-bold' : 'bg-rose-400 text-white'
                    }`}>
                      {b.available > 0 ? `${b.available} Tersedia` : 'Dipinjam'}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <div className="text-[10px] font-mono text-emerald-200 font-bold">
                      DDC {b.ddc}
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-2 leading-snug drop-shadow-sm">
                      {b.title}
                    </h4>
                  </div>

                  <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none">
                    <BookOpen className="w-20 h-20 text-white" />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px]">
                      {b.callNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">{b.year}</span>
                  </div>

                  <div className="text-xs font-semibold text-slate-800 truncate" title={b.author}>
                    {b.author}
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    📍 {b.rack}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {b.category}
                </span>
                <button
                  onClick={() => onNavigateToLabels(b)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Cetak label punggung buku ini"
                >
                  <Tag className="w-3 h-3" />
                  <span>Label</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
