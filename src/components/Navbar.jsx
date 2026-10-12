import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Tag, 
  LayoutDashboard, 
  Repeat, 
  PlusCircle, 
  Database, 
  Globe, 
  Menu, 
  X,
  Sparkles,
  ChevronDown,
  Search,
  ExternalLink
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenQuickVisitor, 
  onOpenBackup,
  stats 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header className="bg-[#0b2864] text-white sticky top-0 z-50 shadow-md border-b border-[#143782]">
      
      {/* 1. TOP OFFICIAL LOGO HEADER (Header Logo Resmi TBM Al Islamiyah) */}
      <div className="border-b border-[#13357c]/60 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Official Logo PKBM Al Islamiyah Surabaya */}
            <div className="relative flex items-center justify-center shrink-0">
              <img 
                src="./logo-tbm.png" 
                alt="Logo PKBM Al Islamiyah Surabaya" 
                className="w-11 h-11 rounded-full object-cover shadow-md ring-2 ring-amber-400/50 bg-white" 
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase text-white font-sans">
                  TBM AL ISLAMIYAH
                </span>
                <span className="bg-amber-400/90 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded uppercase">
                  SURABAYA
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm tracking-wide text-emerald-300">
                  PKBM AL ISLAMIYAH
                </span>
                <span className="hidden md:inline text-white/40">|</span>
                <span className="hidden md:inline text-[11px] text-emerald-100/80 italic font-serif">
                  Perpustakaan hadir demi martabat ummat
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions: Bahasa + Presensi */}
          <div className="flex items-center gap-2.5">
            {/* Tombol Pilih Bahasa */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#143b82] hover:bg-[#1b489d] text-emerald-300 font-bold text-xs rounded-lg border border-[#214f9e] cursor-pointer transition-colors">
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <span>ID</span>
            </div>

            {/* Tombol Presensi Pengunjung */}
            <button
              onClick={onOpenQuickVisitor}
              className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Presensi Pengunjung</span>
              <span className="sm:hidden">Presensi</span>
            </button>

            {/* Backup / DB */}
            <button
              onClick={onOpenBackup}
              className="p-1.5 text-slate-300 hover:text-white bg-[#143b82] hover:bg-[#1b489d] rounded-lg transition-colors"
              title="Backup & Restore Data"
            >
              <Database className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-white hover:bg-white/10 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* 2. NAVIGATION BAR (Menu Utama TBM Al Islamiyah: Beranda, Profil, Layanan, Aktivitas) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="hidden lg:flex items-center justify-center space-x-1 py-1.5 text-sm">
          
          {/* Beranda */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-white bg-[#143b82] border-b-2 border-emerald-400'
                : 'text-slate-200 hover:text-white hover:bg-[#143b82]/50'
            }`}
          >
            Beranda
          </button>

          {/* Data Pengunjung (Presensi) */}
          <button
            onClick={() => setActiveTab('visitors')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'visitors'
                ? 'text-white bg-[#143b82] border-b-2 border-emerald-400'
                : 'text-slate-200 hover:text-white hover:bg-[#143b82]/50'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-300" />
            <span>Data Pengunjung</span>
            {stats?.todayVisitors > 0 && (
              <span className="bg-emerald-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full ml-1">
                {stats.todayVisitors}
              </span>
            )}
          </button>

          {/* Katalog & Data Buku */}
          <button
            onClick={() => setActiveTab('books')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'books'
                ? 'text-white bg-[#143b82] border-b-2 border-emerald-400'
                : 'text-slate-200 hover:text-white hover:bg-[#143b82]/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-300" />
            <span>Data Buku</span>
            <span className="text-[10px] text-white/60 font-mono">
              ({stats?.totalBooks || 0})
            </span>
          </button>

          {/* Label Buku & Barcode */}
          <button
            onClick={() => setActiveTab('labels')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'labels'
                ? 'text-white bg-[#143b82] border-b-2 border-emerald-400'
                : 'text-slate-200 hover:text-white hover:bg-[#143b82]/50'
            }`}
          >
            <Tag className="w-4 h-4 text-amber-300" />
            <span>Label & Barcode</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase">
              Cetak
            </span>
          </button>

          {/* Sirkulasi Buku */}
          <button
            onClick={() => setActiveTab('circulation')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'circulation'
                ? 'text-white bg-[#143b82] border-b-2 border-emerald-400'
                : 'text-slate-200 hover:text-white hover:bg-[#143b82]/50'
            }`}
          >
            <Repeat className="w-4 h-4 text-emerald-300" />
            <span>Sirkulasi Pinjam</span>
            {stats?.activeLoans > 0 && (
              <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                {stats.activeLoans}
              </span>
            )}
          </button>

          {/* Pameran Virtual / Info Komunitas TBM Al Islamiyah */}
          <div className="relative group">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2 text-slate-200 hover:text-white font-semibold flex items-center gap-1 hover:bg-[#143b82]/50 rounded-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Pameran Virtual</span>
            </button>
          </div>

        </nav>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#071d49] border-t border-[#143782] px-4 py-3 space-y-1">
          <button
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'dashboard' ? 'bg-[#143b82] text-white font-bold' : 'text-slate-300'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => { setActiveTab('visitors'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
              activeTab === 'visitors' ? 'bg-[#143b82] text-white font-bold' : 'text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> Data Pengunjung
            </span>
            <span className="bg-emerald-500 text-slate-950 text-xs px-2 py-0.5 rounded-full font-bold">
              {stats?.todayVisitors || 0}
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('books'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
              activeTab === 'books' ? 'bg-[#143b82] text-white font-bold' : 'text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" /> Data Buku & Katalog
            </span>
            <span className="text-xs text-slate-400">({stats?.totalBooks || 0})</span>
          </button>
          <button
            onClick={() => { setActiveTab('labels'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
              activeTab === 'labels' ? 'bg-[#143b82] text-white font-bold' : 'text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" /> Label Buku & Barcode
            </span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded">
              Cetak
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('circulation'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
              activeTab === 'circulation' ? 'bg-[#143b82] text-white font-bold' : 'text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-emerald-400" /> Sirkulasi Pinjam
            </span>
            <span className="text-xs text-amber-300 font-bold">{stats?.activeLoans || 0} aktif</span>
          </button>
        </div>
      )}

    </header>
  );
}
