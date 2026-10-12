import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import VisitorsView from './components/VisitorsView';
import BooksView from './components/BooksView';
import BookLabelsView from './components/BookLabelsView';
import CirculationView from './components/CirculationView';
import DataBackupModal from './components/DataBackupModal';
import Footer from './components/Footer';
import { INITIAL_BOOKS, INITIAL_VISITORS, INITIAL_LOANS, DEFAULT_GDRIVE_SCRIPT_URL } from './data/initialData';
import { syncVisitorToGoogleDrive } from './utils/googleSync';
import { 
  CheckCircle2, 
  UserPlus, 
  X, 
  MessageCircle, 
  HelpCircle, 
  Phone, 
  Clock, 
  BookOpen, 
  Users 
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Selected book for label printing redirect
  const [labelPreselectedBook, setLabelPreselectedBook] = useState(null);

  // Search filter passed from OPAC search bar
  const [initialBookSearch, setInitialBookSearch] = useState('');

  // Persistent States
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem('tbm_books_data');
      return saved ? JSON.parse(saved) : INITIAL_BOOKS;
    } catch {
      return INITIAL_BOOKS;
    }
  });

  const [visitors, setVisitors] = useState(() => {
    try {
      const saved = localStorage.getItem('tbm_visitors_data');
      return saved ? JSON.parse(saved) : INITIAL_VISITORS;
    } catch {
      return INITIAL_VISITORS;
    }
  });

  const [loans, setLoans] = useState(() => {
    try {
      const saved = localStorage.getItem('tbm_loans_data');
      return saved ? JSON.parse(saved) : INITIAL_LOANS;
    } catch {
      return INITIAL_LOANS;
    }
  });

  // Modal states
  const [isQuickVisitorOpen, setIsQuickVisitorOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isHelpChatOpen, setIsHelpChatOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('tbm_books_data', JSON.stringify(books));
    } catch (e) {
      console.error(e);
    }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem('tbm_visitors_data', JSON.stringify(visitors));
    } catch (e) {
      console.error(e);
    }
  }, [visitors]);

  useEffect(() => {
    try {
      localStorage.setItem('tbm_loans_data', JSON.stringify(loans));
    } catch (e) {
      console.error(e);
    }
  }, [loans]);

  // Handler: Add Visitor
  const handleAddVisitor = (visitor) => {
    setVisitors([visitor, ...visitors]);
    showToast(`Presensi "${visitor.name}" berhasil dicatat!`);

    // Otomatis kirim ke Google Drive secara real-time
    const gdriveUrl = localStorage.getItem('tbm_gdrive_script_url') || DEFAULT_GDRIVE_SCRIPT_URL;
    if (gdriveUrl) {
      syncVisitorToGoogleDrive(gdriveUrl, visitor).then((ok) => {
        if (ok) {
          showToast(`Presensi "${visitor.name}" tercatat & tersinkron ke Google Drive!`);
        }
      });
    }
  };

  // Handler: Navigate to Labels from Book Catalog
  const handleNavigateToLabels = (book) => {
    setLabelPreselectedBook(book);
    setActiveTab('labels');
  };

  // Handler: OPAC Search from Hero Section
  const handleOpacSearch = (query, category) => {
    setInitialBookSearch(query);
  };

  // Handler: Restore Data
  const handleRestoreData = (imported) => {
    if (imported.books) setBooks(imported.books);
    if (imported.visitors) setVisitors(imported.visitors);
    if (imported.loans) setLoans(imported.loans);
    showToast('Data berhasil dipulihkan dari cadangan!');
  };

  // Handler: Reset Data
  const handleResetData = () => {
    setBooks(INITIAL_BOOKS);
    setVisitors(INITIAL_VISITORS);
    setLoans(INITIAL_LOANS);
    showToast('Data direset kembali ke contoh awal.');
  };

  // Quick Visitor Form state
  const [quickVisitor, setQuickVisitor] = useState({
    name: '',
    gender: 'L',
    category: 'Siswa / Santri',
    institution: '',
    purpose: 'Membaca di Tempat'
  });

  const handleQuickVisitorSubmit = (e) => {
    e.preventDefault();
    if (!quickVisitor.name.trim()) return;

    const newEntry = {
      ...quickVisitor,
      id: 'V' + String(Date.now()).slice(-6),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      notes: ''
    };

    handleAddVisitor(newEntry);
    setIsQuickVisitorOpen(false);
    setQuickVisitor({
      name: '',
      gender: 'L',
      category: 'Siswa / Santri',
      institution: '',
      purpose: 'Membaca di Tempat'
    });
  };

  // Overall Stats
  const todayStr = new Date().toISOString().split('T')[0];
  const stats = {
    todayVisitors: visitors.filter(v => v.date === todayStr).length,
    totalBooks: books.length,
    activeLoans: loans.filter(l => l.status === 'Dipinjam').length
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm animate-in slide-in-from-bottom duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navbar Resmi TBM Al Islamiyah */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'labels') setLabelPreselectedBook(null);
        }} 
        onOpenQuickVisitor={() => setIsQuickVisitorOpen(true)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        stats={stats}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView 
            books={books} 
            visitors={visitors} 
            loans={loans} 
            setActiveTab={setActiveTab}
            onOpenQuickVisitor={() => setIsQuickVisitorOpen(true)}
            onOpenAddBook={() => setActiveTab('books')}
            onNavigateToLabels={handleNavigateToLabels}
            onOpacSearch={handleOpacSearch}
          />
        )}

        {activeTab === 'visitors' && (
          <VisitorsView 
            visitors={visitors} 
            setVisitors={setVisitors} 
            onAddVisitor={handleAddVisitor} 
          />
        )}

        {activeTab === 'books' && (
          <BooksView 
            books={books} 
            setBooks={setBooks} 
            onNavigateToLabels={handleNavigateToLabels} 
          />
        )}

        {activeTab === 'labels' && (
          <BookLabelsView 
            books={books} 
            preselectedBook={labelPreselectedBook} 
          />
        )}

        {activeTab === 'circulation' && (
          <CirculationView 
            loans={loans} 
            setLoans={setLoans} 
            books={books} 
            setBooks={setBooks} 
          />
        )}
      </main>

      {/* FLOATING LIVE CHAT / BANTUAN BUTTON (Tombol Bantuan Pojok Kanan Bawah) */}
      <div className="no-print fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsHelpChatOpen(!isHelpChatOpen)}
          aria-label="Layanan Bantuan & Tanya Pustakawan"
          className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-emerald-500/30"
          title="Tanya Pustakawan / Bantuan"
        >
          <MessageCircle className="w-7 h-7 stroke-[2.2]" />
        </button>

        {/* Live Chat / FAQ Popup Widget */}
        {isHelpChatOpen && (
          <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-200 text-slate-800">
            <div className="bg-[#0b2864] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xs">
                  TBM
                </div>
                <div>
                  <h4 className="font-bold text-sm">Layanan Bantuan Pemustaka</h4>
                  <p className="text-[11px] text-emerald-300">Taman Baca Masyarakat Al Islamiyah</p>
                </div>
              </div>
              <button onClick={() => setIsHelpChatOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-950">
                <p className="font-semibold mb-1">Assalamu'alaikum! Ada yang bisa kami bantu?</p>
                <p className="text-[11px] text-emerald-800">
                  Pusat informasi layanan perpustakaan, pencarian buku, pencetakan label, dan keanggotaan.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                  Menu Bantuan Cepat:
                </div>
                <button
                  onClick={() => { setIsHelpChatOpen(false); setIsQuickVisitorOpen(true); }}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Isi Presensi / Buku Tamu Pengunjung</span>
                </button>
                <button
                  onClick={() => { setIsHelpChatOpen(false); setActiveTab('books'); }}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <BookOpen className="w-4 h-4 text-[#0b2864]" />
                  <span>Cari Letak Rak & Stok Buku</span>
                </button>
                <button
                  onClick={() => { setIsHelpChatOpen(false); setActiveTab('labels'); }}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Panduan Cetak Label Punggung Buku</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" /> Buka: 08.00 - 17.00 WIB
                </span>
                <span className="font-semibold text-emerald-700">TBM Al Islamiyah</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Attendance Modal */}
      {isQuickVisitorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#0b2864] text-white flex items-center justify-between border-b border-[#143782]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base">Presensi Buku Tamu Pengunjung</h3>
              </div>
              <button onClick={() => setIsQuickVisitorOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickVisitorSubmit} className="p-6 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Pemustaka <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ketik nama pengunjung..."
                  value={quickVisitor.name}
                  onChange={(e) => setQuickVisitor({ ...quickVisitor, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={quickVisitor.gender}
                    onChange={(e) => setQuickVisitor({ ...quickVisitor, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Pemustaka</label>
                  <select
                    value={quickVisitor.category}
                    onChange={(e) => setQuickVisitor({ ...quickVisitor, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm"
                  >
                    <option value="Siswa / Santri">Siswa / Santri</option>
                    <option value="Mahasiswa">Mahasiswa</option>
                    <option value="Guru / Ustadz">Guru / Ustadz</option>
                    <option value="Warga Umum">Warga Umum</option>
                    <option value="Anak-anak (PAUD/TK)">Anak-anak (PAUD/TK)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Asal Sekolah / Instansi / RT</label>
                <input
                  type="text"
                  placeholder="Contoh: MTs Al Islamiyah / Warga RT 02"
                  value={quickVisitor.institution}
                  onChange={(e) => setQuickVisitor({ ...quickVisitor, institution: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Keperluan Kunjungan</label>
                <select
                  value={quickVisitor.purpose}
                  onChange={(e) => setQuickVisitor({ ...quickVisitor, purpose: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm"
                >
                  <option value="Membaca di Tempat">Membaca di Tempat</option>
                  <option value="Meminjam Buku">Meminjam Buku</option>
                  <option value="Mengembalikan Buku">Mengembalikan Buku</option>
                  <option value="Mengerjakan Tugas / Belajar">Mengerjakan Tugas / Belajar</option>
                  <option value="Referensi Mengajar / Kajian">Referensi Mengajar / Kajian</option>
                  <option value="Akses Internet / Komputer">Akses Internet / Komputer</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickVisitorOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm"
                >
                  Simpan Presensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Backup and Restore Modal */}
      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        allData={{ books, visitors, loans }}
        onRestoreData={handleRestoreData}
        onResetData={handleResetData}
      />

      {/* Footer Resmi TBM Al Islamiyah */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
