import React, { useState } from 'react';
import { Search, BookOpen, Filter, ArrowRight, Tag } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../data/initialData';

export default function OpacSearchBar({ onSearch, setActiveTab }) {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('ALL');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword, category);
    setActiveTab('books');
  };

  return (
    <div className="bg-[#0b2864] text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-[#173e8a]">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Judul OPAC TBM Al Islamiyah */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>KATALOG OPAC TERPADU TBM AL ISLAMIYAH</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Pencarian Koleksi Bahan Pustaka
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            Cari buku pelajaran, sirah nabawiyah, kitab rujukan, komik anak, atau naskah ilmiah berdasarkan judul, pengarang, maupun nomor panggil.
          </p>
        </div>

        {/* Search Bar Input Container */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-xl shadow-inner text-slate-800">
          
          {/* Category Dropdown */}
          <div className="sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-slate-200">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-semibold bg-transparent border-0 focus:ring-0 text-slate-700 cursor-pointer"
            >
              <option value="ALL">Semua Kategori Koleksi</option>
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="flex-1 flex items-center px-2">
            <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Ketik judul buku, nama pengarang, atau nomor panggil (misal: Shahih Bukhari, Sayyid Sabiq, 297)..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full py-2 text-xs sm:text-sm bg-transparent border-0 focus:outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-6 py-2.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span>Cari Koleksi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-300 pt-1">
          <span className="text-emerald-300 font-semibold">Paling Banyak Dicari:</span>
          {['Sirah Nabawiyah', 'Fiqih Sunnah', 'Kisah 25 Nabi', 'Ensiklopedi Sains', 'Tajwid & Al-Qur\'an'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setKeyword(item);
                onSearch(item, 'ALL');
                setActiveTab('books');
              }}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
