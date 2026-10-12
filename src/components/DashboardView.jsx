import React from 'react';
import { 
  Users, 
  BookOpen, 
  Tag, 
  Repeat, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  Library,
  Layers,
  Calendar
} from 'lucide-react';
import HeroBannerSlider from './HeroBannerSlider';
import OpacSearchBar from './OpacSearchBar';
import TbmServices from './TbmServices';
import BookSlider from './BookSlider';

export default function DashboardView({ 
  books, 
  visitors, 
  loans, 
  setActiveTab, 
  onOpenQuickVisitor, 
  onOpenAddBook,
  onNavigateToLabels,
  onOpacSearch
}) {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayVisitors = visitors.filter(v => v.date === todayStr);
  const activeLoans = loans.filter(l => l.status === 'Dipinjam');
  const totalCopies = books.reduce((sum, b) => sum + (Number(b.stock) || 1), 0);
  const availableCopies = books.reduce((sum, b) => sum + (Number(b.available) || 0), 0);

  // Group visitors by category
  const visitorCategories = visitors.reduce((acc, v) => {
    acc[v.category] = (acc[v.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      
      {/* 1. HERO BANNER SLIDER */}
      <HeroBannerSlider 
        onOpenQuickVisitor={onOpenQuickVisitor} 
        setActiveTab={setActiveTab} 
      />

      {/* 2. PENCARIAN KATALOG OPAC */}
      <OpacSearchBar 
        onSearch={onOpacSearch || (() => {})} 
        setActiveTab={setActiveTab} 
      />

      {/* 3. LAYANAN UNGGULAN & FASILITAS */}
      <TbmServices 
        setActiveTab={setActiveTab} 
        onOpenQuickVisitor={onOpenQuickVisitor} 
      />

      {/* 4. METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pengunjung Hari Ini</span>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0b2864]">{todayVisitors.length}</span>
            <span className="text-xs text-slate-500">orang</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Total riwayat: <b>{visitors.length}</b> kunjungan</span>
            <button onClick={() => setActiveTab('visitors')} className="text-emerald-600 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer">
              Lihat <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Katalog Bahan Pustaka</span>
            <div className="p-2.5 rounded-lg bg-teal-50 text-teal-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0b2864]">{books.length}</span>
            <span className="text-xs text-slate-500">judul ({totalCopies} eks)</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Tersedia: <b className="text-emerald-600">{availableCopies}</b> eks</span>
            <button onClick={() => setActiveTab('books')} className="text-teal-600 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer">
              Katalog <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Buku Dipinjam</span>
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <Repeat className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0b2864]">{activeLoans.length}</span>
            <span className="text-xs text-slate-500">buku</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Sirkulasi pemustaka</span>
            <button onClick={() => setActiveTab('circulation')} className="text-amber-600 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer">
              Sirkulasi <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Label & Barcode</span>
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0b2864]">{books.length}</span>
            <span className="text-xs text-slate-500">siap cetak</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Format Tom & Jerry A4</span>
            <button onClick={() => setActiveTab('labels')} className="text-indigo-600 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer">
              Cetak <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. RAK BUKU PILIHAN HORIZONTAL SLIDER */}
      <BookSlider 
        books={books} 
        onNavigateToLabels={onNavigateToLabels || (() => setActiveTab('labels'))} 
      />

      {/* 6. LOG PRESENSI TERBARU & DEMOGRAFI PEMUSTAKA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Log Pengunjung Terkini */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Presensi Pengunjung Terkini
                </h3>
                <p className="text-xs text-slate-500">Log buku tamu pemustaka yang baru saja hadir di Taman Baca</p>
              </div>
              <button
                onClick={() => setActiveTab('visitors')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                Lihat Semua ({visitors.length}) <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="divide-y divide-slate-100 overflow-x-auto">
              {visitors.slice(0, 5).map((v) => (
                <div key={v.id} className="p-3 sm:p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-sm">
                      {v.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-slate-900 truncate">{v.name}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium shrink-0">
                          {v.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{v.institution} &bull; <span className="text-slate-600 italic">{v.purpose}</span></p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-medium text-slate-700">{v.date}</div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" /> {v.time} WIB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Demografi Kategori */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Demografi Kategori Pemustaka
            </h3>
            <p className="text-xs text-slate-500 mb-4">Sebaran pembaca menurut kategori keanggotaan</p>

            <div className="space-y-3">
              {Object.entries(visitorCategories).map(([cat, count]) => {
                const percentage = Math.round((count / visitors.length) * 100) || 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 font-medium truncate">{cat}</span>
                      <span className="text-slate-500 font-mono font-semibold">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
