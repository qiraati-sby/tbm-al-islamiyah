import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Tag, 
  Edit3, 
  Trash2, 
  Printer, 
  FileSpreadsheet, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  LayoutGrid,
  List,
  Sparkles,
  X
} from 'lucide-react';
import { DEFAULT_CATEGORIES, DEFAULT_RACKS } from '../data/initialData';

export default function BooksView({ 
  books, 
  setBooks, 
  onNavigateToLabels 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedRack, setSelectedRack] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const emptyForm = {
    code: '',
    title: '',
    author: '',
    authorShort: '',
    publisher: '',
    year: new Date().getFullYear().toString(),
    isbn: '',
    category: 'Agama Islam',
    ddc: '297',
    callNumber: '',
    rack: DEFAULT_RACKS[0],
    stock: 1,
    available: 1,
    borrowed: 0,
    synopsis: '',
    donor: 'Infaq / Wakaf Warga'
  };

  const [formData, setFormData] = useState(emptyForm);

  // Auto-generate call number helper
  const handleAutoCallNumber = (title, author, ddc) => {
    let shortAuth = '';
    if (author && author.trim()) {
      const parts = author.trim().split(' ');
      const mainWord = parts[parts.length - 1].replace(/[^a-zA-Z]/g, '');
      shortAuth = mainWord.slice(0, 3).toUpperCase();
    }
    
    let firstTitleChar = '';
    if (title && title.trim()) {
      firstTitleChar = title.trim().charAt(0).toLowerCase();
    }

    const calculatedCall = `${ddc || '200'} ${shortAuth || 'XYZ'} ${firstTitleChar || 'a'}`.trim();
    return { shortAuth, calculatedCall };
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    const nextNumber = books.length + 1;
    const nextCode = `TBM-ISL-${String(nextNumber).padStart(3, '0')}`;
    setEditingBookId(null);
    setFormData({
      ...emptyForm,
      code: nextCode,
      callNumber: `297 XYZ a`
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (book) => {
    setEditingBookId(book.id);
    setFormData({ ...book });
    setIsModalOpen(true);
  };

  // Form fields change
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    // If title, author, or ddc changes, automatically suggest Call Number
    if (name === 'title' || name === 'author' || name === 'ddc') {
      const { shortAuth, calculatedCall } = handleAutoCallNumber(
        name === 'title' ? value : formData.title,
        name === 'author' ? value : formData.author,
        name === 'ddc' ? value : formData.ddc
      );
      updated.authorShort = shortAuth;
      updated.callNumber = calculatedCall;
    }

    setFormData(updated);
  };

  // Save book
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingBookId) {
      // Update
      setBooks(books.map(b => b.id === editingBookId ? { ...formData, id: editingBookId } : b));
    } else {
      // Create new
      const newBook = {
        ...formData,
        id: 'B' + String(Date.now()).slice(-6)
      };
      setBooks([newBook, ...books]);
    }
    setIsModalOpen(false);
  };

  // Delete book
  const handleDelete = (id) => {
    setBooks(books.filter(b => b.id !== id));
    setDeleteConfirmId(null);
  };

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchSearch = 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.callNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.isbn && b.isbn.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      if (selectedCategory !== 'ALL' && b.category !== selectedCategory) {
        return false;
      }

      if (selectedRack !== 'ALL' && b.rack !== selectedRack) {
        return false;
      }

      return true;
    });
  }, [books, searchQuery, selectedCategory, selectedRack]);

  // Export Books to CSV
  const handleExportCSV = () => {
    const headers = ['No', 'Nomor Induk', 'Nomor Panggil (Call Number)', 'Judul Buku', 'Pengarang', 'Penerbit', 'Tahun', 'Kategori', 'DDC', 'Lokasi Rak', 'Stok', 'Tersedia', 'Dipinjam', 'ISBN', 'Donatur'];
    const rows = filteredBooks.map((b, i) => [
      i + 1,
      b.code,
      `"${b.callNumber}"`,
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.author.replace(/"/g, '""')}"`,
      `"${(b.publisher || '').replace(/"/g, '""')}"`,
      b.year || '',
      `"${b.category}"`,
      b.ddc || '',
      `"${b.rack}"`,
      b.stock,
      b.available,
      b.borrowed || 0,
      `"${b.isbn || ''}"`,
      `"${(b.donor || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Katalog_Buku_TBM_Al_Islamiyah_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Katalog & Data Koleksi Buku</h2>
            <span className="bg-teal-100 text-teal-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {filteredBooks.length} Judul
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Inventarisasi koleksi bacaan lengkap dengan klasifikasi DDC, nomor panggil, dan lokasi rak
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold px-3.5 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Buku Baru</span>
          </button>

          <button
            onClick={() => onNavigateToLabels(null)}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-medium px-3 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Buka menu cetak label buku"
          >
            <Tag className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak Label Buku</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
            title="Download file CSV Katalog Buku"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Ekspor Excel</span>
          </button>

          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-100 p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
              title="Tampilan Tabel"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
              title="Tampilan Grid Kartu"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul buku, penulis, kode, nomor panggil, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="ALL">Semua Kategori ({DEFAULT_CATEGORIES.length})</option>
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>{c.name} ({c.ddc})</option>
              ))}
            </select>
          </div>

          {/* Rack Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedRack}
              onChange={(e) => setSelectedRack(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="ALL">Semua Lokasi Rak</option>
              {DEFAULT_RACKS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">No. Panggil / Induk</th>
                  <th className="py-3 px-4">Judul Buku & Pengarang</th>
                  <th className="py-3 px-4">Kategori & DDC</th>
                  <th className="py-3 px-4">Lokasi Rak</th>
                  <th className="py-3 px-4 text-center">Stok / Status</th>
                  <th className="py-3 px-4 text-center">Aksi & Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-medium">Tidak ada buku yang cocok dengan kriteria pencarian</p>
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((b, index) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-400 font-mono text-xs">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded inline-block border border-slate-200">
                          {b.callNumber}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {b.code}
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 line-clamp-1">{b.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          <span className="text-slate-700">{b.author}</span> {b.year && `(${b.year})`}
                        </div>
                        {b.publisher && (
                          <div className="text-[11px] text-slate-400">Penerbit: {b.publisher}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {b.category}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">DDC: {b.ddc}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-xs">
                        {b.rack}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          b.available > 0 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {b.available} / {b.stock} Eks
                        </span>
                        {b.borrowed > 0 && (
                          <div className="text-[10px] text-amber-600 mt-0.5 font-medium">
                            {b.borrowed} Dipinjam
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onNavigateToLabels(b)}
                            className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Cetak Label Punggung & Barcode Buku Ini"
                          >
                            <Tag className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(b)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit data buku"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(b.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus buku"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Total koleksi ditampilkan: <b>{filteredBooks.length}</b> judul</span>
            <span className="font-semibold text-emerald-700">TBM Al Islamiyah</span>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {b.callNumber}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    b.available > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {b.available > 0 ? `${b.available} Tersedia` : 'Habis Dipinjam'}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug mb-1">
                  {b.title}
                </h4>
                <p className="text-xs text-slate-600 mb-2">
                  {b.author} &bull; <span className="text-slate-400">{b.publisher || 'Tanpa Penerbit'} ({b.year})</span>
                </p>

                {b.synopsis && (
                  <p className="text-xs text-slate-500 line-clamp-2 italic mb-3 bg-slate-50 p-2 rounded">
                    "{b.synopsis}"
                  </p>
                )}

                <div className="text-[11px] text-slate-500 space-y-1 mb-3">
                  <div>📂 <b>Kategori:</b> {b.category} (DDC: {b.ddc})</div>
                  <div>📍 <b>Rak:</b> {b.rack}</div>
                  <div>🏷️ <b>Kode:</b> {b.code}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigateToLabels(b)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Tag className="w-3.5 h-3.5" /> Cetak Label
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(b.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Book */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            <div className="sticky top-0 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-base">
                  {editingBookId ? 'Edit Data Buku' : 'Tambah Buku Baru ke Katalog'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              
              {/* Row 1: Code and Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Induk / Kode <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Buku <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="title"
                    placeholder="Contoh: Ringkasan Shahih Bukhari"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Row 2: Author and Call Number (Smart Library Generator) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Penulis / Pengarang <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="author"
                    placeholder="Contoh: Imam Az-Zabidi"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                {/* Call Number with auto-generate indicator */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Nomor Panggil (Call Number)
                    </label>
                    <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> Auto-Generated
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    name="callNumber"
                    placeholder="e.g. 297.12 ZAB r"
                    value={formData.callNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-300 font-mono font-bold text-slate-800 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Row 3: Category, DDC, and Rack */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Buku</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) => {
                      const catObj = DEFAULT_CATEGORIES.find(c => c.name === e.target.value);
                      const newDdc = catObj ? catObj.id : formData.ddc;
                      const { shortAuth, calculatedCall } = handleAutoCallNumber(formData.title, formData.author, newDdc);
                      setFormData({ 
                        ...formData, 
                        category: e.target.value,
                        ddc: newDdc,
                        callNumber: calculatedCall
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    {DEFAULT_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kode DDC Klasifikasi</label>
                  <input
                    type="text"
                    name="ddc"
                    value={formData.ddc}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi Rak Buku</label>
                  <select
                    name="rack"
                    value={formData.rack}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    {DEFAULT_RACKS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Publisher, Year, and ISBN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Penerbit</label>
                  <input
                    type="text"
                    name="publisher"
                    placeholder="Contoh: Pustaka As-Sunnah"
                    value={formData.publisher}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Terbit</label>
                  <input
                    type="text"
                    name="year"
                    placeholder="2024"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ISBN / Barcode Asli</label>
                  <input
                    type="text"
                    name="isbn"
                    placeholder="978-..."
                    value={formData.isbn}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Row 5: Stock and Donor */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Stok (Eksemplar)</label>
                  <input
                    type="number"
                    min="1"
                    name="stock"
                    value={formData.stock}
                    onChange={(e) => {
                      const s = parseInt(e.target.value) || 1;
                      setFormData({ 
                        ...formData, 
                        stock: s, 
                        available: Math.max(0, s - (formData.borrowed || 0)) 
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sumber Koleksi / Donatur</label>
                  <input
                    type="text"
                    name="donor"
                    placeholder="Contoh: Wakaf Pengurus, Donasi Warga, Hibah Perpusda"
                    value={formData.donor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Row 6: Synopsis */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sinopsis Ringkas / Deskripsi Buku</label>
                <textarea
                  rows="2"
                  name="synopsis"
                  placeholder="Ringkasan isi buku atau catatan khusus..."
                  value={formData.synopsis}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                ></textarea>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Label punggung & barcode akan otomatis tersedia untuk dicetak.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm"
                  >
                    {editingBookId ? 'Simpan Perubahan' : 'Tambahkan Buku'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-base mb-2">Hapus Koleksi Buku?</h4>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Buku ini akan dihapus dari katalog. Label buku terkait juga tidak akan muncul lagi di daftar cetak.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
