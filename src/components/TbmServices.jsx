import React from 'react';
import { 
  Users, 
  BookOpen, 
  Tag, 
  Repeat, 
  Sparkles, 
  HeartHandshake, 
  ArrowRight
} from 'lucide-react';

export default function TbmServices({ 
  setActiveTab, 
  onOpenQuickVisitor 
}) {
  const services = [
    {
      id: 'visitors',
      title: 'Buku Tamu & Presensi Pemustaka',
      desc: 'Pencatatan kehadiran harian santri, pelajar, ustadz, dan warga secara real-time tersinkron ke Google Drive.',
      icon: Users,
      badge: 'Buku Tamu Digital',
      color: 'emerald',
      action: () => setActiveTab('visitors')
    },
    {
      id: 'books',
      title: 'Katalog Koleksi Bahan Pustaka',
      desc: 'Inventarisasi buku agama Islam, sains, komik anak, dan referensi dengan klasifikasi DDC serta penataan rak rapi.',
      icon: BookOpen,
      badge: 'Katalog & DDC',
      color: 'teal',
      action: () => setActiveTab('books')
    },
    {
      id: 'labels',
      title: 'Label Punggung & Barcode Buku',
      desc: 'Pembuatan label nomor panggil dan barcode Code 128 berlogo resmi TBM Al Islamiyah Surabaya format siap cetak.',
      icon: Tag,
      badge: 'Cetak Stiker Buku',
      color: 'amber',
      action: () => setActiveTab('labels')
    },
    {
      id: 'circulation',
      title: 'Sirkulasi & Peminjaman Koleksi',
      desc: 'Pencatatan peminjaman buku santri dan anggota masyarakat dengan pemantauan tenggat waktu pengembalian.',
      icon: Repeat,
      badge: 'Layanan Pinjam',
      color: 'sky',
      action: () => setActiveTab('circulation')
    },
    {
      id: 'read',
      title: 'Pojok Baca Santri & Anak',
      desc: 'Koleksi khusus kisah 25 nabi, fabel edukatif, ensiklopedi sains anak, serta bimbingan membaca Al-Qur\'an.',
      icon: Sparkles,
      badge: 'Literasi Anak',
      color: 'rose',
      action: () => setActiveTab('books')
    },
    {
      id: 'wakaf',
      title: 'Program Wakaf & Infaq Bahan Pustaka',
      desc: 'Penerimaan sumbangan buku bacaan dari jamaah, majelis taklim, dan masyarakat sebagai amal jariyah ilmu.',
      icon: HeartHandshake,
      badge: 'Sedekah Jariyah',
      color: 'indigo',
      action: () => onOpenQuickVisitor()
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <span className="text-[11px] font-bold text-emerald-700 tracking-wider uppercase">
            LAYANAN UTAMA
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Fasilitas & Layanan TBM Al Islamiyah Surabaya
          </h2>
        </div>
        <p className="text-xs text-slate-500 max-w-md">
          Akses mudah ke seluruh fasilitas literasi dan manajemen operasional taman baca masyarakat
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              onClick={s.action}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    s.color === 'emerald' ? 'bg-emerald-50 text-emerald-800' :
                    s.color === 'amber' ? 'bg-amber-50 text-amber-800' :
                    s.color === 'sky' ? 'bg-sky-50 text-sky-800' :
                    s.color === 'rose' ? 'bg-rose-50 text-rose-800' :
                    s.color === 'indigo' ? 'bg-indigo-50 text-indigo-800' :
                    'bg-teal-50 text-teal-800'
                  }`}>
                    {s.badge}
                  </span>
                  
                  <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-[#0b2864] text-slate-700 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-[#0b2864] transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>Buka Layanan</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
