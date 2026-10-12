import React, { useState } from 'react';
import { 
  Repeat, 
  Search, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  BookOpen, 
  Calendar,
  X
} from 'lucide-react';

export default function CirculationView({ 
  loans, 
  setLoans, 
  books, 
  setBooks 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ACTIVE, RETURNED
  const [showLoanModal, setShowLoanModal] = useState(false);

  // Form state
  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  const [newLoan, setNewLoan] = useState({
    bookId: '',
    borrowerName: '',
    borrowerCategory: 'Siswa / Santri',
    borrowDate: todayStr,
    dueDate: nextWeekStr,
    phone: ''
  });

  // Filtered loans
  const filteredLoans = loans.filter((l) => {
    const matchSearch = 
      l.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.bookCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (statusFilter === 'ACTIVE' && l.status !== 'Dipinjam') return false;
    if (statusFilter === 'RETURNED' && l.status !== 'Kembali') return false;

    return true;
  });

  // Handle return book
  const handleReturnBook = (loanId, bookId) => {
    const nowStr = new Date().toISOString().split('T')[0];
    
    // Update loan status
    setLoans(loans.map(l => l.id === loanId ? { ...l, status: 'Kembali', returnDate: nowStr } : l));

    // Update book stock
    setBooks(books.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          available: (b.available || 0) + 1,
          borrowed: Math.max(0, (b.borrowed || 1) - 1)
        };
      }
      return b;
    }));
  };

  // Handle new loan submit
  const handleCreateLoan = (e) => {
    e.preventDefault();
    const selectedBook = books.find(b => b.id === newLoan.bookId);
    if (!selectedBook || selectedBook.available <= 0) return;

    const loanItem = {
      id: 'L' + String(Date.now()).slice(-6),
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      bookCode: selectedBook.code,
      borrowerName: newLoan.borrowerName,
      borrowerCategory: newLoan.borrowerCategory,
      borrowDate: newLoan.borrowDate,
      dueDate: newLoan.dueDate,
      status: 'Dipinjam',
      returnDate: null
    };

    setLoans([loanItem, ...loans]);

    // Update book stock
    setBooks(books.map(b => {
      if (b.id === selectedBook.id) {
        return {
          ...b,
          available: Math.max(0, (b.available || 1) - 1),
          borrowed: (b.borrowed || 0) + 1
        };
      }
      return b;
    }));

    setShowLoanModal(false);
    setNewLoan({
      bookId: '',
      borrowerName: '',
      borrowerCategory: 'Siswa / Santri',
      borrowDate: todayStr,
      dueDate: nextWeekStr,
      phone: ''
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Layanan Sirkulasi Buku</h2>
            <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {loans.filter(l => l.status === 'Dipinjam').length} Buku Dipinjam
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan peminjaman dan pengembalian koleksi bacaan pemustaka Al Islamiyah
          </p>
        </div>

        <button
          onClick={() => setShowLoanModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold px-3.5 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Pinjamkan Buku</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama peminjam, judul buku, kode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm"
          >
            <option value="ALL">Semua Status Transaksi</option>
            <option value="ACTIVE">Sedang Dipinjam</option>
            <option value="RETURNED">Sudah Kembali</option>
          </select>
        </div>
      </div>

      {/* Loan Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Peminjam</th>
                <th className="py-3 px-4">Buku Dipinjam</th>
                <th className="py-3 px-4">Tgl Pinjam</th>
                <th className="py-3 px-4">Batas Kembali</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <Repeat className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-medium">Tidak ada riwayat sirkulasi yang sesuai</p>
                  </td>
                </tr>
              ) : (
                filteredLoans.map((l) => {
                  const isOverdue = l.status === 'Dipinjam' && l.dueDate < todayStr;
                  return (
                    <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{l.borrowerName}</div>
                        <div className="text-[11px] text-slate-500">{l.borrowerCategory}</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-slate-800 line-clamp-1">{l.bookTitle}</div>
                        <div className="text-[11px] font-mono text-slate-400">{l.bookCode}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                        {l.borrowDate}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                          {l.dueDate}
                        </span>
                        {isOverdue && (
                          <span className="block text-[10px] text-rose-600 font-semibold">
                            Terlambat!
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {l.status === 'Dipinjam' ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isOverdue ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            <Clock className="w-3 h-3" /> Dipinjam
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3 h-3" /> Kembali ({l.returnDate})
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {l.status === 'Dipinjam' && (
                          <button
                            onClick={() => handleReturnBook(l.id, l.bookId)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Kembalikan Buku
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Loan Book */}
      {showLoanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-base">Pinjamkan Koleksi Buku</h3>
              </div>
              <button onClick={() => setShowLoanModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLoan} className="p-6 space-y-4 text-xs sm:text-sm">
              {/* Select Book */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Buku <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={newLoan.bookId}
                  onChange={(e) => setNewLoan({ ...newLoan, bookId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value="">-- Pilih Buku yang Tersedia --</option>
                  {books.filter(b => b.available > 0).map(b => (
                    <option key={b.id} value={b.id}>
                      {b.code} - {b.title} (Sisa: {b.available} eks)
                    </option>
                  ))}
                </select>
              </div>

              {/* Borrower Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Peminjam <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama anggota / pemustaka"
                  value={newLoan.borrowerName}
                  onChange={(e) => setNewLoan({ ...newLoan, borrowerName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm"
                />
              </div>

              {/* Borrower Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Peminjam</label>
                <select
                  value={newLoan.borrowerCategory}
                  onChange={(e) => setNewLoan({ ...newLoan, borrowerCategory: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm"
                >
                  <option value="Siswa / Santri">Siswa / Santri</option>
                  <option value="Guru / Ustadz">Guru / Ustadz</option>
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Warga Umum">Warga Umum</option>
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Pinjam</label>
                  <input
                    type="date"
                    required
                    value={newLoan.borrowDate}
                    onChange={(e) => setNewLoan({ ...newLoan, borrowDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Batas Kembali</label>
                  <input
                    type="date"
                    required
                    value={newLoan.dueDate}
                    onChange={(e) => setNewLoan({ ...newLoan, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLoanModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!newLoan.bookId || !newLoan.borrowerName}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg"
                >
                  Konfirmasi Pinjam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
