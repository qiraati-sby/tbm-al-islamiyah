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
  ExternalLink,
  Lock,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenQuickVisitor, 
  stats,
  isAdminLoggedIn,
  onOpenLogin,
  onLogout
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

          {/* Quick Header Actions: Bahasa + Presensi + Admin/Database */}
          <div className="flex items-center gap-2">
            {/* Tombol Pilih Bahasa */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#143b82] hover:bg-[#1b489d] text-emerald-300 font-bold text-xs rounded-lg border border-[#214f9e] cursor-pointer transition-colors">
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

            {/* STATUS & LOGIN ADMIN */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-950/70 px-2.5 py-1.5 rounded-lg border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Google Drive Aktif</span>
                </span>

                {/* Tombol Logout Admin */}
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1.5 text-rose-300 hover:text-white bg-rose-950/50 hover:bg-rose-900 border border-rose-500/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
                  title="Keluar dari Akun Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              /* Tombol Login Admin (Saat Belum Login) */
              <button
                onClick={onOpenLogin}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-extrabold text-xs sm:text-sm rounded-lg flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                title="Masuk sebagai Pengelola / Admin TBM"
              >
                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Login Admin</span>
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-white hover:bg-white/10 rounded-lg cursor-pointer"
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

          {/* Katalog & Data Buku (Bisa dilihat publik, kelola oleh admin) */}
          <button
            onClick={() => setActiveTab('books')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'books'
                ? 'text-white bg-[#143b82] border-b-2 border-emerald-400'
                : 'text-slate-200 hover:text-white hover:bg-[#143b82]/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-300" />
            <span>Katalog Buku</span>
            <span className="text-[10px] text-white/60 font-mono">
              ({stats?.totalBooks || 0})
            </span>
          </button>

          {/* Data Pengunjung (Presensi) - Khusus Admin */}
          <button
            onClick={() => {
              if (!isAdminLoggedIn) onOpenLogin();
              else setActiveTab('visitors');
            }}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'visitors'
                ? 'text-white bg-[#143b82] border-b-2 border-emerald-400'
                : 'text-slate-200 hover:text-white hover:bg-[#143b82]/50'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-300" />
            <span>Data Pengunjung</span>
            {!isAdminLoggedIn ? (
              <Lock className="w-3 h-3 text-amber-300/80 ml-0.5" />
            ) : stats?.todayVisitors > 0 ? (
              <span className="bg-emerald-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full ml-1">
                {stats.todayVisitors}
              </span>
            ) : null}
          </button>

          {/* Label Buku & Barcode - Khusus Admin */}
          <button
            onClick={() => {
              if (!isAdminLoggedIn) onOpenLogin();
              else setActiveTab('labels');
            }}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'labels'
                ? 'text-white bg-[#143b82] border-b-2 border-emerald-400'
                : 'text-slate-200 hover:text-white hover:bg-[#143b82]/50'
            }`}
          >
            <Tag className="w-4 h-4 text-amber-300" />
            <span>Label & Barcode</span>
            {!isAdminLoggedIn ? (
              <Lock className="w-3 h-3 text-amber-300/80 ml-0.5" />
            ) : (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                Cetak
              </span>
            )}
          </button>

          {/* Sirkulasi Buku - Khusus Admin */}
          <button
            onClick={() => {
              if (!isAdminLoggedIn) onOpenLogin();
              else setActiveTab('circulation');
            }}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'circulation'
                ? 'text-white bg-[#143b82] border-b-2 border-emerald-400'
                : 'text-slate-200 hover:text-white hover:bg-[#143b82]/50'
            }`}
          >
            <Repeat className="w-4 h-4 text-emerald-300" />
            <span>Sirkulasi Pinjam</span>
            {!isAdminLoggedIn ? (
              <Lock className="w-3 h-3 text-amber-300/80 ml-0.5" />
            ) : stats?.activeLoans > 0 ? (
              <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                {stats.activeLoans}
              </span>
            ) : null}
          </button>

          {/* Pameran Virtual / Info Komunitas TBM Al Islamiyah */}
          <div className="relative group">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-2 text-slate-200 hover:text-white font-semibold flex items-center gap-1 hover:bg-[#143b82]/50 rounded-lg cursor-pointer"
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
          {/* Status Admin Mobile */}
          <div className="pb-2 mb-2 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-300">Status Akun:</span>
            {isAdminLoggedIn ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                <ShieldCheck className="w-3 h-3" /> Admin Masuk
              </span>
            ) : (
              <button 
                onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                className="text-xs font-bold text-amber-300 flex items-center gap-1 hover:underline"
              >
                <Lock className="w-3 h-3" /> Login Admin
              </button>
            )}
          </div>

          <button
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'dashboard' ? 'bg-[#143b82] text-white font-bold' : 'text-slate-300'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => { setActiveTab('books'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
              activeTab === 'books' ? 'bg-[#143b82] text-white font-bold' : 'text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" /> Katalog Koleksi Buku
            </span>
            <span className="text-xs text-slate-400">({stats?.totalBooks || 0})</span>
          </button>
          <button
            onClick={() => { 
              if (!isAdminLoggedIn) onOpenLogin();
              else setActiveTab('visitors'); 
              setMobileMenuOpen(false); 
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
              activeTab === 'visitors' ? 'bg-[#143b82] text-white font-bold' : 'text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> Data Pengunjung
              {!isAdminLoggedIn && <Lock className="w-3 h-3 text-amber-300/80" />}
            </span>
            {isAdminLoggedIn && stats?.todayVisitors > 0 && (
              <span className="bg-emerald-500 text-slate-950 text-xs px-2 py-0.5 rounded-full font-bold">
                {stats.todayVisitors}
              </span>
            )}
          </button>
          <button
            onClick={() => { 
              if (!isAdminLoggedIn) onOpenLogin();
              else setActiveTab('labels'); 
              setMobileMenuOpen(false); 
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
              activeTab === 'labels' ? 'bg-[#143b82] text-white font-bold' : 'text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" /> Label Buku & Barcode
              {!isAdminLoggedIn && <Lock className="w-3 h-3 text-amber-300/80" />}
            </span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded">
              Cetak
            </span>
          </button>
          <button
            onClick={() => { 
              if (!isAdminLoggedIn) onOpenLogin();
              else setActiveTab('circulation'); 
              setMobileMenuOpen(false); 
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
              activeTab === 'circulation' ? 'bg-[#143b82] text-white font-bold' : 'text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-emerald-400" /> Sirkulasi Pinjam
              {!isAdminLoggedIn && <Lock className="w-3 h-3 text-amber-300/80" />}
            </span>
            {isAdminLoggedIn && stats?.activeLoans > 0 && (
              <span className="text-xs text-amber-300 font-bold">{stats.activeLoans} aktif</span>
            )}
          </button>

          {/* Keluar di Mobile jika Admin */}
          {isAdminLoggedIn && (
            <div className="pt-2 mt-2 border-t border-white/10 space-y-1">
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-300 hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Keluar Akun Admin
              </button>
            </div>
          )}
        </div>
      )}

    </header>
  );
}
