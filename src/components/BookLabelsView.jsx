import React, { useState, useMemo } from 'react';
import { 
  Tag, 
  Printer, 
  Search, 
  CheckSquare, 
  Square, 
  Settings2, 
  Layers, 
  Sliders, 
  BookOpen, 
  Sparkles, 
  Eye, 
  Download,
  Filter,
  Check
} from 'lucide-react';
import Barcode from './Barcode';
import { DEFAULT_CATEGORIES, DEFAULT_RACKS } from '../data/initialData';

export default function BookLabelsView({ 
  books, 
  preselectedBook = null 
}) {
  // Selection state
  const [selectedBookIds, setSelectedBookIds] = useState(() => {
    if (preselectedBook) return [preselectedBook.id];
    // By default, select all books so user immediately sees full preview
    return books.map(b => b.id);
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRack, setFilterRack] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');

  // Label Configuration Options
  const [labelType, setLabelType] = useState('combo'); // 'spine', 'barcode', 'combo'
  const [institutionHeader, setInstitutionHeader] = useState('TBM AL ISLAMIYAH');
  const [gridColumns, setGridColumns] = useState('3'); // '2', '3', '4'
  const [showBorder, setShowBorder] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [showBookTitle, setShowBookTitle] = useState(true);
  const [colorTheme, setColorTheme] = useState('emerald'); // 'emerald', 'black', 'blue'

  // Filter books for selection table
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchSearch = 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.callNumber.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;
      if (filterRack !== 'ALL' && b.rack !== filterRack) return false;
      if (filterCategory !== 'ALL' && b.category !== filterCategory) return false;
      return true;
    });
  }, [books, searchQuery, filterRack, filterCategory]);

  // Selected books array
  const selectedBooks = useMemo(() => {
    return books.filter(b => selectedBookIds.includes(b.id));
  }, [books, selectedBookIds]);

  // Toggle selection
  const handleToggleSelect = (id) => {
    if (selectedBookIds.includes(id)) {
      setSelectedBookIds(selectedBookIds.filter(item => item !== id));
    } else {
      setSelectedBookIds([...selectedBookIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedBookIds.length === filteredBooks.length) {
      setSelectedBookIds([]);
    } else {
      setSelectedBookIds(filteredBooks.map(b => b.id));
    }
  };

  // Trigger Print
  const handlePrint = () => {
    window.print();
  };

  // Helper to parse Call Number into 3 library lines: DDC, Author 3 chars, Title 1 char
  const parseCallNumberParts = (book) => {
    const raw = book.callNumber || `${book.ddc || '200'} XYZ a`;
    const parts = raw.split(' ');
    return {
      ddc: parts[0] || book.ddc || '200',
      author: parts[1] || (book.authorShort || 'XYZ').toUpperCase(),
      titleChar: parts[2] || book.title.charAt(0).toLowerCase()
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner (Hidden in Print) */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Generator & Cetak Label Buku</h2>
            <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {selectedBooks.length} Label Dipilih
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Format resmi label punggung (spine label) dan stiker barcode siap cetak kertas stiker A4 / label Tom & Jerry
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            disabled={selectedBooks.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Cetak PDF ({selectedBooks.length})</span>
          </button>
        </div>
      </div>

      {/* Control Panel: Label Options & Selector (Hidden in Print) */}
      <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Configuration Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Pengaturan Format Label</span>
            </div>

            {/* Model Label Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Pilih Format Label</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setLabelType('combo')}
                  className={`p-2.5 rounded-lg text-xs font-semibold border flex flex-col items-center gap-1.5 transition-all ${
                    labelType === 'combo' 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Kombo 2-in-1</span>
                  <span className="text-[9px] text-slate-400 font-normal">Spine + Barcode</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLabelType('spine')}
                  className={`p-2.5 rounded-lg text-xs font-semibold border flex flex-col items-center gap-1.5 transition-all ${
                    labelType === 'spine' 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>Label Punggung</span>
                  <span className="text-[9px] text-slate-400 font-normal">Punggung Buku</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLabelType('barcode')}
                  className={`p-2.5 rounded-lg text-xs font-semibold border flex flex-col items-center gap-1.5 transition-all ${
                    labelType === 'barcode' 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Stiker Barcode</span>
                  <span className="text-[9px] text-slate-400 font-normal">Kantong / Belakang</span>
                </button>
              </div>
            </div>

            {/* Header Text */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lembaga (Header)</label>
              <input
                type="text"
                value={institutionHeader}
                onChange={(e) => setInstitutionHeader(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-bold"
              />
            </div>

            {/* Grid Columns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kolom per Baris</label>
                <select
                  value={gridColumns}
                  onChange={(e) => setGridColumns(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="2">2 Kolom (Lebar)</option>
                  <option value="3">3 Kolom (Standar A4)</option>
                  <option value="4">4 Kolom (Kompak)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tema Desain</label>
                <select
                  value={colorTheme}
                  onChange={(e) => setColorTheme(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="emerald">Hijau Al Islamiyah</option>
                  <option value="black">Hitam Putih Klasik</option>
                  <option value="blue">Biru Perpustakaan</option>
                </select>
              </div>
            </div>

            {/* Toggle Checklist Options */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={showBorder}
                  onChange={(e) => setShowBorder(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Tampilkan Garis Tepi Pemotong (Cut border)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={showLogo}
                  onChange={(e) => setShowLogo(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Tampilkan Logo / Lambang TBM</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={showBookTitle}
                  onChange={(e) => setShowBookTitle(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Tampilkan Judul Buku Ringkas di Label</span>
              </label>
            </div>

            {/* Printing Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-800 space-y-1">
              <div className="font-bold flex items-center gap-1 text-amber-900">
                💡 Panduan Cetak Kertas Stiker:
              </div>
              <p>
                Gunakan kertas HVS Stiker A4 atau Stiker Label Tom & Jerry. Pada dialog cetak browser, atur <b>Margin: None / Minimum</b> dan pastikan centang <b>Background graphics</b> agar warna header label tercetak sempurna.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Book Checklist Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            
            {/* Table Header & Selection Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200"
                >
                  {selectedBookIds.length === filteredBooks.length ? (
                    <>
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                      <span>Hapus Semua Pilihan</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 text-slate-400" />
                      <span>Pilih Semua ({filteredBooks.length})</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Terpilih: <b className="text-slate-800">{selectedBookIds.length}</b> dari {books.length} buku
              </div>
            </div>

            {/* Quick Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari buku..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <select
                  value={filterRack}
                  onChange={(e) => setFilterRack(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="ALL">Semua Rak</option>
                  {DEFAULT_RACKS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Book List with Scrollbar */}
            <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
              {filteredBooks.map((b) => {
                const isSelected = selectedBookIds.includes(b.id);
                return (
                  <div
                    key={b.id}
                    onClick={() => handleToggleSelect(b.id)}
                    className={`p-2.5 flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-50/70 hover:bg-emerald-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by parent div
                        className="rounded text-emerald-600 focus:ring-emerald-500 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{b.title}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-700">{b.callNumber}</span>
                          <span>&bull;</span>
                          <span>{b.rack}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right font-mono text-[11px] text-slate-500">
                      {b.code}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

      {/* Printable Area: The Actual Labels Sheet */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
        
        {/* Screen-only Preview Header */}
        <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900">
              Pratinjau Lembar Cetak Label ({selectedBooks.length} Buku)
            </h3>
          </div>
          <button
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak Sekarang
          </button>
        </div>

        {/* Printable Canvas Element */}
        <div id="printable-area">
          
          {selectedBooks.length === 0 ? (
            <div className="py-16 text-center text-slate-400 no-print">
              <Tag className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="font-semibold text-base">Belum ada buku yang dipilih untuk dicetak</p>
              <p className="text-xs text-slate-400 mt-1">Silakan centang satu atau lebih buku pada daftar di atas.</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${
              gridColumns === '2' ? 'grid-cols-2' :
              gridColumns === '3' ? 'grid-cols-3' : 'grid-cols-4'
            }`}>
              {selectedBooks.map((book) => {
                const callParts = parseCallNumberParts(book);
                
                // Color Theme styling
                const headerBg = 
                  colorTheme === 'emerald' ? 'bg-emerald-700 text-white' :
                  colorTheme === 'blue' ? 'bg-blue-700 text-white' :
                  'bg-slate-900 text-white';

                const borderStyle = showBorder ? 'border border-slate-400' : 'border border-transparent';

                return (
                  <div
                    key={book.id}
                    className={`bg-white rounded p-2 ${borderStyle} flex flex-col justify-between break-inside-avoid shadow-xs print:shadow-none print:m-1`}
                    style={{ minHeight: '140px' }}
                  >
                    {/* FORMAT 1: COMBO (Spine Label + Barcode Sticker) */}
                    {labelType === 'combo' && (
                      <div className="grid grid-cols-5 gap-2 h-full">
                        
                        {/* Left: Spine Call Number Label (2 cols) */}
                        <div className="col-span-2 border-r border-dashed border-slate-300 pr-2 flex flex-col justify-between text-center">
                          <div className={`${headerBg} rounded-t px-1 py-0.5 text-[8.5px] font-bold tracking-tight uppercase truncate flex items-center justify-center gap-1`}>
                            {showLogo && (
                              <img src="./logo-tbm.png" alt="logo" className="w-3 h-3 rounded-full object-cover shrink-0 bg-white" />
                            )}
                            <span className="truncate">{institutionHeader}</span>
                          </div>

                          <div className="my-auto py-1 space-y-0.5 font-mono">
                            <div className="text-xs font-black text-slate-900 leading-tight">
                              {callParts.ddc}
                            </div>
                            <div className="text-xs font-black text-slate-900 leading-tight tracking-wider">
                              {callParts.author}
                            </div>
                            <div className="text-xs font-black text-slate-900 leading-tight">
                              {callParts.titleChar}
                            </div>
                          </div>

                          <div className="border-t border-slate-200 pt-0.5 text-[8px] font-mono text-slate-600 truncate">
                            {book.code}
                          </div>
                        </div>

                        {/* Right: Barcode & Title Label (3 cols) */}
                        <div className="col-span-3 flex flex-col justify-between pl-1 text-center">
                          <div className="text-[9px] font-bold text-slate-800 tracking-tight uppercase truncate">
                            {institutionHeader}
                          </div>

                          {showBookTitle && (
                            <div className="text-[9px] font-semibold text-slate-700 line-clamp-2 leading-tight my-0.5">
                              {book.title}
                            </div>
                          )}

                          <div className="my-auto">
                            <Barcode 
                              value={book.code} 
                              width={1.1} 
                              height={28} 
                              fontSize={9} 
                              displayValue={true} 
                            />
                          </div>

                          <div className="text-[8px] text-slate-500 truncate">
                            {book.rack}
                          </div>
                        </div>

                      </div>
                    )}

                    {/* FORMAT 2: SPINE LABEL ONLY (Punggung Buku Saja) */}
                    {labelType === 'spine' && (
                      <div className="flex flex-col justify-between text-center h-full py-1">
                        <div className={`${headerBg} rounded-t px-1 py-1 text-[10px] font-bold tracking-tight uppercase truncate flex items-center justify-center gap-1`}>
                          {showLogo && (
                            <img src="./logo-tbm.png" alt="logo" className="w-3.5 h-3.5 rounded-full object-cover shrink-0 bg-white" />
                          )}
                          <span className="truncate">{institutionHeader}</span>
                        </div>

                        <div className="my-auto py-2 space-y-1 font-mono">
                          <div className="text-sm font-black text-slate-900 leading-tight">
                            {callParts.ddc}
                          </div>
                          <div className="text-sm font-black text-slate-900 leading-tight tracking-wider">
                            {callParts.author}
                          </div>
                          <div className="text-sm font-black text-slate-900 leading-tight">
                            {callParts.titleChar}
                          </div>
                        </div>

                        <div className="border-t border-slate-300 pt-1 text-[9px] font-mono font-bold text-slate-700">
                          {book.code}
                        </div>
                      </div>
                    )}

                    {/* FORMAT 3: BARCODE STICKER ONLY (Stiker Barcode Saja) */}
                    {labelType === 'barcode' && (
                      <div className="flex flex-col justify-between text-center h-full py-1">
                        <div className="text-[10px] font-bold text-slate-800 tracking-tight uppercase truncate border-b border-slate-200 pb-1">
                          {institutionHeader}
                        </div>

                        {showBookTitle && (
                          <div className="text-[10px] font-semibold text-slate-900 line-clamp-2 leading-tight my-1">
                            {book.title}
                          </div>
                        )}

                        <div className="my-auto py-1">
                          <Barcode 
                            value={book.code} 
                            width={1.2} 
                            height={32} 
                            fontSize={10} 
                            displayValue={true} 
                          />
                        </div>

                        <div className="flex items-center justify-between text-[8px] text-slate-500 border-t border-slate-100 pt-1">
                          <span className="font-mono font-bold">{book.callNumber}</span>
                          <span>{book.rack}</span>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
