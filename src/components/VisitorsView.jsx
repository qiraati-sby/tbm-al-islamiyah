import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Download, 
  Printer, 
  Filter, 
  Trash2, 
  Calendar, 
  Clock, 
  UserPlus, 
  CheckCircle,
  FileSpreadsheet,
  X
} from 'lucide-react';

export default function VisitorsView({ 
  visitors, 
  setVisitors, 
  onAddVisitor 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL'); // ALL, TODAY, WEEK, MONTH
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form state
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    gender: 'L',
    category: 'Siswa / Santri',
    institution: '',
    purpose: 'Membaca di Tempat',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5)
  });

  const categories = [
    'Siswa / Santri',
    'Mahasiswa',
    'Guru / Ustadz',
    'Warga Umum',
    'Anak-anak (PAUD/TK)'
  ];

  const purposes = [
    'Membaca di Tempat',
    'Meminjam Buku',
    'Mengembalikan Buku',
    'Mengerjakan Tugas / Belajar',
    'Referensi Mengajar / Kajian',
    'Akses Internet / Komputer',
    'Mendampingi Anak Belajar'
  ];

  // Filtering visitors
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      // Search
      const matchSearch = 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.purpose.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      // Category filter
      if (categoryFilter !== 'ALL' && v.category !== categoryFilter) {
        return false;
      }

      // Date filter
      if (dateFilter === 'TODAY' && v.date !== todayStr) {
        return false;
      }
      if (dateFilter === 'WEEK') {
        const vDate = new Date(v.date);
        const diffDays = (new Date() - vDate) / (1000 * 60 * 60 * 24);
        if (diffDays > 7) return false;
      }
      if (dateFilter === 'MONTH') {
        const currentMonth = todayStr.slice(0, 7);
        if (!v.date.startsWith(currentMonth)) return false;
      }

      return true;
    });
  }, [visitors, searchQuery, categoryFilter, dateFilter, todayStr]);

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newVisitor.name.trim()) return;

    const visitorItem = {
      ...newVisitor,
      id: 'V' + String(Date.now()).slice(-6)
    };

    onAddVisitor(visitorItem);
    setShowAddModal(false);
    setNewVisitor({
      name: '',
      gender: 'L',
      category: 'Siswa / Santri',
      institution: '',
      purpose: 'Membaca di Tempat',
      notes: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5)
    });
  };

  const handleDelete = (id) => {
    setVisitors(visitors.filter(v => v.id !== id));
    setDeleteConfirmId(null);
  };

  // Export to CSV function (with BOM for Excel compatibility)
  const handleExportCSV = () => {
    const headers = ['No', 'ID', 'Tanggal', 'Jam', 'Nama Pengunjung', 'L/P', 'Kategori', 'Asal Instansi/Sekolah', 'Keperluan', 'Catatan'];
    const rows = filteredVisitors.map((v, i) => [
      i + 1,
      v.id,
      v.date,
      v.time,
      `"${v.name.replace(/"/g, '""')}"`,
      v.gender,
      `"${v.category}"`,
      `"${v.institution.replace(/"/g, '""')}"`,
      `"${v.purpose.replace(/"/g, '""')}"`,
      `"${(v.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Buku_Pengunjung_TBM_Al_Islamiyah_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Buku Tamu & Presensi Pengunjung</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {filteredVisitors.length} Data
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan data kehadiran pembaca dan anggota Taman Baca Masyarakat Al Islamiyah
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold px-3.5 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pengunjung</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
            title="Download file CSV / Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Ekspor Excel/CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
            title="Cetak Laporan Presensi"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Cetak</span>
          </button>
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
              placeholder="Cari nama pengunjung, asal instansi, keperluan..."
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="ALL">Semua Kategori Pengunjung</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="md:col-span-3">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="ALL">Semua Waktu</option>
              <option value="TODAY">Hari Ini ({todayStr})</option>
              <option value="WEEK">7 Hari Terakhir</option>
              <option value="MONTH">Bulan Ini</option>
            </select>
          </div>

        </div>
      </div>

      {/* Visitors Data Table */}
      <div id="printable-area" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Printable Header (Visible only when printed) */}
        <div className="hidden print:block p-4 border-b border-slate-300 text-center">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
            TAMAN BACA MASYARAKAT AL ISLAMIYAH
          </h2>
          <p className="text-xs text-slate-600">
            LAPORAN REKAPITULASI BUKU PENGUNJUNG PERPUSTAKAAN &bull; Tanggal Cetak: {todayStr}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Nama Pengunjung</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Asal Instansi / Sekolah</th>
                <th className="py-3 px-4">Keperluan</th>
                <th className="py-3 px-4 text-center no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-medium">Tidak ada data pengunjung yang sesuai filter</p>
                    <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci pencarian atau reset filter</p>
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((v, index) => {
                  return (
                    <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-400 font-mono text-xs">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{v.date}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{v.time} WIB</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                            v.gender === 'L' ? 'bg-sky-100 text-sky-700' : 'bg-pink-100 text-pink-700'
                          }`}>
                            {v.gender}
                          </span>
                          <span className="font-semibold text-slate-900">{v.name}</span>
                        </div>
                        {v.notes && (
                          <div className="text-[11px] text-slate-500 mt-0.5 italic">
                            Catatan: {v.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          v.category === 'Siswa / Santri' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          v.category === 'Guru / Ustadz' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          v.category === 'Mahasiswa' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                          v.category.includes('Anak-anak') ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {v.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {v.institution || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {v.purpose}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center no-print">
                        <button
                          onClick={() => setDeleteConfirmId(v.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus data kunjungan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <span>Menampilkan <b>{filteredVisitors.length}</b> dari <b>{visitors.length}</b> total kunjungan</span>
          <span className="mt-1 sm:mt-0 font-medium text-emerald-700">Taman Baca Masyarakat Al Islamiyah</span>
        </div>
      </div>

      {/* Modal Add Visitor */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-base">Presensi Pengunjung Baru</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Row: Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Kunjungan</label>
                  <input
                    type="date"
                    required
                    value={newVisitor.date}
                    onChange={(e) => setNewVisitor({ ...newVisitor, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Kedatangan</label>
                  <input
                    type="time"
                    required
                    value={newVisitor.time}
                    onChange={(e) => setNewVisitor({ ...newVisitor, time: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pengunjung <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Farhan"
                  value={newVisitor.name}
                  onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  autoFocus
                />
              </div>

              {/* Gender and Category */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={newVisitor.gender}
                    onChange={(e) => setNewVisitor({ ...newVisitor, gender: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Pemustaka</label>
                  <select
                    value={newVisitor.category}
                    onChange={(e) => setNewVisitor({ ...newVisitor, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Institution / School */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asal Sekolah / Instansi / Lingkungan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: MTs Al Islamiyah / Warga RT 02 RW 04"
                  value={newVisitor.institution}
                  onChange={(e) => setNewVisitor({ ...newVisitor, institution: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Keperluan Kunjungan</label>
                <select
                  value={newVisitor.purpose}
                  onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  {purposes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Judul buku yang dicari atau keperluan khusus..."
                  value={newVisitor.notes}
                  onChange={(e) => setNewVisitor({ ...newVisitor, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm"
                >
                  Simpan Presensi
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-base mb-2">Hapus Data Pengunjung?</h4>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Data pengunjung ini akan dihapus dari riwayat kunjungan. Tindakan ini tidak dapat dibatalkan.
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
