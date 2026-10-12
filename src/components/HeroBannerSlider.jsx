import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Users, 
  Tag, 
  Sparkles, 
  Award,
  Globe,
  Share2,
  TreePine,
  Sun,
  ShieldCheck
} from 'lucide-react';

export default function HeroBannerSlider({ 
  onOpenQuickVisitor, 
  setActiveTab 
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const slides = [
    {
      id: 1,
      tagline: 'PERPUSTAKAAN HADIR DEMI MARTABAT BANGSA & UMMAH',
      headingLeft: 'SELAMAT DATANG DI',
      titleHighlight: 'TBM AL ISLAMIYAH',
      subHighlight: 'TAMAN BACA MASYARAKAT',
      quoteRight: 'Literasi untuk Santri, Generasi Qur\'ani, dan Kemakmuran Bangsa',
      description: 'Pusat pembelajaran komunitas yang menyediakan bahan bacaan agama, sains, ensiklopedi, dan ruang belajar terpadu untuk masyarakat.',
      theme: 'emerald',
      ctaText: 'Presensi Pengunjung',
      ctaAction: () => onOpenQuickVisitor(),
      ctaText2: 'Statistik Koleksi',
      ctaAction2: () => setActiveTab('statistics'),
      badge: 'TERBUKA UNTUK UMUM'
    },
    {
      id: 2,
      tagline: 'STANDARISASI PENGELOLAAN KOLEKSI DDC & OPAC',
      headingLeft: 'KLASIFIKASI DDC &',
      titleHighlight: 'PENATAAN RAK KOLEKSI',
      subHighlight: 'STANDAR PERPUSTAKAAN TBM AL ISLAMIYAH',
      quoteRight: 'Penataan Rak Buku yang Presisi dan Mudah Ditemukan Pemustaka',
      description: 'Klasifikasi sistematis dengan nomor panggil standar DDC, 3 huruf pengarang, dan penataan nomor rak agar memudahkan pencarian literasi.',
      theme: 'teal',
      ctaText: 'Isi Presensi Hadir',
      ctaAction: () => onOpenQuickVisitor(),
      ctaText2: 'Lihat Statistik Buku',
      ctaAction2: () => setActiveTab('statistics'),
      badge: 'KLASIFIKASI DDC RESMI'
    },
    {
      id: 3,
      tagline: 'GERAKAN LITERASI MASYARAKAT & SANTRI TERPADU',
      headingLeft: 'BUKU TAMU DIGITAL',
      titleHighlight: 'PRESENSI PEMUSTAKA',
      subHighlight: 'REKAPITULASI REAL-TIME',
      quoteRight: 'Mencatat Setiap Langkah Pembaca Menuju Cakrawala Ilmu',
      description: 'Form kehadiran interaktif dengan filter kategori santri, guru, mahasiswa, dan warga yang langsung terhubung ke Google Drive.',
      theme: 'cyan',
      ctaText: 'Catat Pengunjung Baru',
      ctaAction: () => onOpenQuickVisitor(),
      ctaText2: 'Statistik Pengunjung',
      ctaAction2: () => setActiveTab('statistics'),
      badge: 'SINKRON GOOGLE DRIVE'
    }
  ];

  // Auto slide timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <div 
      className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-300 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (diff > 50) handleNext();
        else if (diff < -50) handlePrev();
        touchStartX.current = null;
      }}
    >
      {/* BACKGROUND BANNER ILUSTRASI ALAM & POHON LITERASI (GAYA BANNER TBM AL ISLAMIYAH) */}
      <div className="relative min-h-[380px] sm:min-h-[420px] bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#022c22] text-white p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
        
        {/* Decorative Nature Landscape Vector SVG Layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
          {/* Mountains silhouette in background */}
          <svg className="absolute bottom-0 w-full h-64 text-emerald-950 fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path d="M0,224L60,197.3C120,171,240,117,360,128C480,139,600,213,720,218.7C840,224,960,160,1080,144C1200,128,1320,160,1380,176L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
          <svg className="absolute bottom-0 w-full h-48 text-emerald-800/80 fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path d="M0,64L80,90.7C160,117,320,171,480,181.3C640,192,800,160,960,133.3C1120,107,1280,85,1360,74.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>

        {/* Tree of Knowledge Silhouette in Center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-15 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full fill-emerald-100">
            <circle cx="100" cy="70" r="50" />
            <circle cx="70" cy="90" r="40" />
            <circle cx="130" cy="90" r="40" />
            <rect x="92" y="110" width="16" height="70" rx="4" />
          </svg>
        </div>

        {/* Top Header inside Banner (Logo Bintang & Slogan) */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded tracking-wider uppercase">
              {current.badge}
            </span>
            <span className="text-[11px] font-semibold text-emerald-200 hidden sm:inline">
              {current.tagline}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-emerald-200 border border-white/10">
            <span>Slide</span>
            <b className="text-white">{currentSlide + 1}</b>
            <span className="text-white/40">/</span>
            <span>{slides.length}</span>
          </div>
        </div>

        {/* Main Banner Content (Tipografi Besar TBM Al Islamiyah) */}
        <div className="relative z-10 my-auto py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column (Big Typography) */}
          <div className="lg:col-span-7 space-y-2">
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-emerald-200 drop-shadow">
              {current.headingLeft}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-md leading-none">
              {current.titleHighlight}
            </h1>
            <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-emerald-100 font-extrabold text-xs sm:text-sm tracking-wider uppercase border border-white/20">
              {current.subHighlight}
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl pt-2">
              {current.description}
            </p>

            {/* Call to Action Buttons */}
            <div className="pt-3 flex flex-wrap gap-3">
              <button
                onClick={current.ctaAction}
                className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xl transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{current.ctaText}</span>
              </button>
              <button
                onClick={current.ctaAction2}
                className="bg-[#0b2864]/80 hover:bg-[#0b2864] text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-white/30 backdrop-blur-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-emerald-300" />
                <span>{current.ctaText2}</span>
              </button>
            </div>
          </div>

          {/* Right Column (Quote & Kartu Misi TBM Al Islamiyah) */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-emerald-950/60 backdrop-blur-md p-6 rounded-2xl border border-emerald-400/30 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Misi Literasi Ummat</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug drop-shadow-sm font-sans">
                "{current.quoteRight}"
              </h3>
              <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between text-xs text-emerald-200">
                <span>📍 TBM Al Islamiyah</span>
                <span className="font-semibold text-amber-300">Ayo ke Taman Baca</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM SOCIAL & PORTAL STRIP (Baris Bawah TBM Al Islamiyah) */}
        <div className="relative z-10 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/90 font-medium">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="bg-white/15 px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1.5 font-mono">
              <Globe className="w-3 h-3 text-emerald-300" />
              <span>tbm.alislamiyah.id</span>
            </span>
            <span className="bg-white/15 px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1.5">
              <span>📷 @tbmalislamiyah</span>
            </span>
            <span className="hidden sm:inline-flex bg-white/15 px-2.5 py-1 rounded-md border border-white/20 items-center gap-1.5">
              <span>📖 #AyoMembaca</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-200 font-bold hidden md:inline">
              Komunitas Literasi Berkemajuan & Beradab
            </span>
            <span className="bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded text-[10px]">
              AKREDITASI A
            </span>
          </div>
        </div>

      </div>

      {/* LEFT ARROW BUTTON (Sesuai panah di gambar) */}
      <button
        onClick={handlePrev}
        aria-label="Slide Sebelumnya"
        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl transition-all duration-200 active:scale-90 hover:scale-110 cursor-pointer border-2 border-white/40"
      >
        <ChevronLeft className="w-7 h-7 stroke-[3]" />
      </button>

      {/* RIGHT ARROW BUTTON (Persis yang ditunjuk anak panah merah user) */}
      <button
        onClick={handleNext}
        aria-label="Slide Selanjutnya"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl transition-all duration-200 active:scale-90 hover:scale-110 cursor-pointer border-2 border-white/40"
      >
        <ChevronRight className="w-7 h-7 stroke-[3]" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentSlide
                ? 'w-8 h-2 bg-amber-400 shadow-sm'
                : 'w-2 h-2 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

    </div>
  );
}
