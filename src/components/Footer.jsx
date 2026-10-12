import React from 'react';
import { 
  BookOpen, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  ExternalLink,
  ShieldCheck,
  Heart
} from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="no-print bg-[#071d49] text-white border-t-4 border-emerald-500 mt-12">
      
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img 
                src="./logo-tbm.png" 
                alt="Logo PKBM Al Islamiyah Surabaya" 
                className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-amber-400/50 bg-white" 
              />
              <div>
                <h4 className="font-extrabold text-sm uppercase tracking-wider text-white">
                  TBM AL ISLAMIYAH
                </h4>
                <p className="text-[11px] text-emerald-300 font-semibold uppercase">
                  PKBM Al Islamiyah Surabaya
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Mewujudkan masyarakat yang berilmu, berkarakter mulia, dan gemar membaca melalui penyediaan bahan pustaka berkualitas, bimbingan literasi, dan pemberdayaan santri serta warga.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold">Pusat Literasi Masyarakat & Santri</span>
            </div>
          </div>

          {/* Col 2: Menu Layanan */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider border-b border-[#143782] pb-2">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => setActiveTab('visitors')} className="hover:text-emerald-300 transition-colors text-left cursor-pointer">
                  &rsaquo; Buku Tamu & Presensi Pengunjung
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('books')} className="hover:text-emerald-300 transition-colors text-left cursor-pointer">
                  &rsaquo; Katalog Bahan Pustaka & DDC
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('labels')} className="hover:text-emerald-300 transition-colors text-left cursor-pointer">
                  &rsaquo; Generator Label Punggung & Barcode
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('circulation')} className="hover:text-emerald-300 transition-colors text-left cursor-pointer">
                  &rsaquo; Sirkulasi & Peminjaman Buku
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-emerald-300 transition-colors text-left cursor-pointer">
                  &rsaquo; Statistik Pengunjung & Koleksi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Jam Layanan & Kontak */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider border-b border-[#143782] pb-2">
              Jam Layanan & Kontak
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Senin - Ahad:</div>
                  <div className="text-slate-300">08.00 - 17.00 WIB</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>PKBM & TBM Al Islamiyah, Kota Surabaya</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>tbm.alislamiyah.surabaya@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Col 4: Jejaring Program TBM */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider border-b border-[#143782] pb-2">
              Program Literasi
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <span className="text-emerald-300 font-medium">&bull; PKBM Al Islamiyah Surabaya</span>
              </li>
              <li>
                <span className="text-slate-300">&bull; Gerakan Santri & Anak Gemar Membaca</span>
              </li>
              <li>
                <span className="text-slate-300">&bull; Layanan Pojok Baca Komunitas</span>
              </li>
              <li>
                <span className="text-slate-300">&bull; Program Sedekah & Wakaf Bahan Pustaka</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar Strip */}
      <div className="bg-[#051433] border-t border-[#0b2864] py-3.5 pb-20 lg:pb-3.5 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; {new Date().getFullYear()} <b>TBM & PKBM Al Islamiyah Surabaya</b>. Seluruh Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Menebar ilmu dan literasi untuk generasi Qur'ani</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>

    </footer>
  );
}
