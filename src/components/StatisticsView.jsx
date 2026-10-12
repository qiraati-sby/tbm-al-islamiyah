import React, { useMemo } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Users, 
  Tag, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Bookmark, 
  PieChart, 
  Library, 
  Printer, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { DEFAULT_CATEGORIES, DEFAULT_RACKS } from '../data/initialData';

export default function StatisticsView({ books = [], visitors = [], loans = [] }) {
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Perhitungan Statistik Buku
  const bookStats = useMemo(() => {
    const totalTitles = books.length;
    const totalCopies = books.reduce((acc, b) => acc + (Number(b.stock) || 1), 0);
    const totalAvailable = books.reduce((acc, b) => acc + (Number(b.available) || 0), 0);
    const totalBorrowed = books.reduce((acc, b) => acc + (Number(b.borrowed) || 0), 0);

    // Hitung per kategori
    const categoryCounts = DEFAULT_CATEGORIES.map((cat) => {
      const catBooks = books.filter((b) => b.category === cat.name);
      const titles = catBooks.length;
      const copies = catBooks.reduce((acc, b) => acc + (Number(b.stock) || 1), 0);
      const percentage = totalTitles > 0 ? Math.round((titles / totalTitles) * 100) : 0;
      return {
        ...cat,
        titles,
        copies,
        percentage
      };
    }).sort((a, b) => b.titles - a.titles);

    // Hitung per rak
    const rackCounts = DEFAULT_RACKS.map((rack) => {
      const rackBooks = books.filter((b) => b.rack === rack);
      const titles = rackBooks.length;
      const copies = rackBooks.reduce((acc, b) => acc + (Number(b.stock) || 1), 0);
      return { rack, titles, copies };
    }).filter((r) => r.titles > 0);

    return { totalTitles, totalCopies, totalAvailable, totalBorrowed, categoryCounts, rackCounts };
  }, [books]);

  // 2. Perhitungan Statistik Pengunjung
  const visitorStats = useMemo(() => {
    const totalVisitors = visitors.length;
    const todayVisitors = visitors.filter((v) => v.date === todayStr).length;

    // Kategori pemustaka
    const categoriesList = [
      'Siswa / Santri',
      'Guru / Ustadz',
      'Mahasiswa',
      'Warga Umum',
      'Anak-anak (PAUD/TK)'
    ];

    const categoryBreakdown = categoriesList.map((catName) => {
      const count = visitors.filter((v) => v.category === catName).length;
      const percentage = totalVisitors > 0 ? Math.round((count / totalVisitors) * 100) : 0;
      return { name: catName, count, percentage };
    }).sort((a, b) => b.count - a.count);

    // Gender breakdown
    const maleCount = visitors.filter((v) => v.gender === 'L').length;
    const femaleCount = visitors.filter((v) => v.gender === 'P').length;
    const malePercent = totalVisitors > 0 ? Math.round((maleCount / totalVisitors) * 100) : 0;
    const femalePercent = totalVisitors > 0 ? Math.round((femaleCount / totalVisitors) * 100) : 0;

    return { totalVisitors, todayVisitors, categoryBreakdown, maleCount, femaleCount, malePercent, femalePercent };
  }, [visitors, todayStr]);

  // 3. Perhitungan Statistik Sirkulasi
  const loanStats = useMemo(() => {
    const totalLoans = loans.length;
    const activeLoans = loans.filter((l) => l.status === 'Dipinjam').length;
    const returnedLoans = loans.filter((l) => l.status === 'Kembali').length;
    return { totalLoans, activeLoans, returnedLoans };
  }, [loans]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner Halaman Statistik */}
      <div className="bg-gradient-to-r from-[#0b2864] via-[#0f3480] to-[#047857] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>STATISTIK & TRANSPARANSI DATA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
            Statistik Koleksi & Pemustaka
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mt-1 leading-relaxed">
            Data rekapitulasi jumlah koleksi buku, sebaran kategori DDC, lokasi rak, serta demografi pengunjung Taman Baca Masyarakat Al Islamiyah Surabaya.
          </p>
        </div>

        <div className="no-print flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold text-xs sm:text-sm border border-white/30 backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4 text-emerald-300" />
            <span>Cetak Rekap Statistik</span>
          </button>
        </div>
      </div>

      {/* 4 Kartu Metrik Utama (KPI Summary) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Judul Buku */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Judul Buku</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            {bookStats.totalTitles} <span className="text-xs text-slate-500 font-normal">Judul</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">{bookStats.totalCopies}</span> eksemplar fisik
          </div>
        </div>

        {/* Ketersediaan Buku */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Buku di Rak</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Library className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            {bookStats.totalAvailable} <span className="text-xs text-slate-500 font-normal">Tersedia</span>
          </div>
          <div className="text-xs text-amber-600 mt-1 font-medium">
            {bookStats.totalBorrowed} buku sedang dipinjam
          </div>
        </div>

        {/* Total Pengunjung */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pemustaka</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            {visitorStats.totalVisitors} <span className="text-xs text-slate-500 font-normal">Orang</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Tercatat di buku tamu digital
          </div>
        </div>

        {/* Pengunjung Hari Ini */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hari Ini</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            {visitorStats.todayVisitors} <span className="text-xs text-slate-500 font-normal">Kehadiran</span>
          </div>
          <div className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Presensi aktif hari ini</span>
          </div>
        </div>

      </div>

      {/* Grid: Statistik Kategori Buku (Kiri) & Statistik Pengunjung (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Sebaran Buku per Kategori (7 Kolom) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Sebaran Koleksi per Kategori (DDC)</h3>
                <p className="text-xs text-slate-500">Persentase jumlah buku berdasarkan klasifikasi keilmuan</p>
              </div>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {DEFAULT_CATEGORIES.length} Kategori
            </span>
          </div>

          {bookStats.totalTitles === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">Belum ada data buku yang terdaftar</p>
              <p className="text-xs text-slate-400 mt-0.5">Data buku akan muncul otomatis setelah ditambahkan</p>
            </div>
          ) : (
            <div className="space-y-3.5 pt-1">
              {bookStats.categoryCounts.map((cat) => (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                        {cat.ddc}
                      </span>
                      <span className="font-semibold text-slate-800">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-slate-900">{cat.titles} Judul</span>
                      <span className="text-slate-400">({cat.copies} eks)</span>
                      <span className="font-bold text-emerald-600 min-w-8 text-right">{cat.percentage}%</span>
                    </div>
                  </div>
                  {/* Progress Bar Visual */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(cat.percentage, cat.titles > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Demografi Pengunjung (5 Kolom) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Kategori Pengunjung */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Kategori Pemustaka</h3>
                  <p className="text-xs text-slate-500">Profil pengunjung Taman Baca</p>
                </div>
              </div>
            </div>

            {visitorStats.totalVisitors === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-medium">Belum ada data presensi pengunjung</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visitorStats.categoryBreakdown.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.name}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-slate-900">{item.count} orang</span>
                        <span className="text-blue-600 font-bold min-w-8 text-right">{item.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(item.percentage, item.count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}

                {/* Rasio Jenis Kelamin */}
                <div className="pt-3 border-t border-slate-100 mt-4">
                  <span className="text-xs font-bold text-slate-600 block mb-2">Sebaran Gender Pemustaka</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">👨 Laki-laki:</span>
                      <b className="text-slate-900 font-mono">{visitorStats.maleCount} ({visitorStats.malePercent}%)</b>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">🧕 Perempuan:</span>
                      <b className="text-slate-900 font-mono">{visitorStats.femaleCount} ({visitorStats.femalePercent}%)</b>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sebaran Lokasi Rak Buku */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Penataan Rak Koleksi</h3>
                <p className="text-xs text-slate-500">Distribusi buku di lemari & rak baca</p>
              </div>
            </div>

            {bookStats.rackCounts.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">Belum ada penataan rak terdaftar</p>
            ) : (
              <div className="space-y-2 pt-1 max-h-56 overflow-y-auto pr-1">
                {bookStats.rackCounts.map((r) => (
                  <div key={r.rack} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-700 truncate max-w-xs">{r.rack}</span>
                    <span className="font-mono font-bold text-emerald-700 shrink-0 ml-2">
                      {r.titles} Judul ({r.copies} eks)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
