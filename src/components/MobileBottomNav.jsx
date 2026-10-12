import React from 'react';
import { 
  Home, 
  BarChart3, 
  PlusCircle, 
  Lock, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  Tag, 
  Repeat,
  Sparkles
} from 'lucide-react';

export default function MobileBottomNav({ 
  activeTab, 
  setActiveTab, 
  onOpenQuickVisitor, 
  isAdminLoggedIn, 
  onOpenLogin,
  stats
}) {
  return (
    <nav className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b2864]/95 backdrop-blur-md border-t border-[#143782] text-white px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center justify-around gap-1 text-[10px]">
        
        {/* 1. Beranda */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-emerald-300 font-extrabold bg-[#143b82]'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Beranda</span>
        </button>

        {/* 2. Statistik */}
        <button
          onClick={() => setActiveTab('statistics')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'statistics'
              ? 'text-amber-300 font-extrabold bg-[#143b82]'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span>Statistik</span>
        </button>

        {/* 3. Presensi Cepat (Floating Action Button style) */}
        <button
          onClick={onOpenQuickVisitor}
          className="flex flex-col items-center justify-center py-1 px-1 text-emerald-400 font-bold active:scale-95 transition-transform cursor-pointer"
        >
          <div className="w-9 h-9 -mt-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg ring-4 ring-[#0b2864]">
            <PlusCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="mt-0.5 text-emerald-300 font-extrabold">Presensi</span>
        </button>

        {/* 4. Admin / Menu Manajemen */}
        {isAdminLoggedIn ? (
          <button
            onClick={() => {
              // Jika admin dan sedang di dashboard/stat, arahkan ke katalog buku
              if (['dashboard', 'statistics'].includes(activeTab)) {
                setActiveTab('books');
              } else {
                setActiveTab('dashboard');
              }
            }}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors cursor-pointer ${
              ['books', 'visitors', 'labels', 'circulation'].includes(activeTab)
                ? 'text-emerald-300 font-extrabold bg-[#143b82]'
                : 'text-amber-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            <span>Admin</span>
          </button>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-amber-300 hover:text-white transition-colors cursor-pointer"
          >
            <Lock className="w-5 h-5 mb-0.5" />
            <span>Login</span>
          </button>
        )}

      </div>
    </nav>
  );
}
