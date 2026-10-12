import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Cek apakah sudah terinstal / dalam mode standalone
    const isApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isApp) {
      setIsStandalone(true);
      return;
    }

    // Deteksi iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Tangkap event install PWA di Android / Chrome
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Tampilkan banner setelah jeda 2 detik agar tidak mengganggu
      setTimeout(() => {
        const dismissed = sessionStorage.getItem('pwa_prompt_dismissed');
        if (!dismissed) {
          setIsVisible(true);
        }
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Jika iOS dan belum standalone dan belum pernah di-dismiss
    if (isIosDevice && !isApp) {
      setTimeout(() => {
        const dismissed = sessionStorage.getItem('pwa_prompt_dismissed');
        if (!dismissed) {
          setIsVisible(true);
        }
      }, 3500);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
        setDeferredPrompt(null);
      }
    } else if (isIos) {
      // Pada iOS, beri alert panduan
      alert('Cara Pasang di iPhone/iPad:\n1. Ketuk tombol Bagikan (Share) di menu bawah Safari 📤\n2. Gulir ke bawah dan pilih "Tambahkan ke Layar Utama" (Add to Home Screen) ➕');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className="no-print fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-40 animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#0b2864] text-white p-4 rounded-2xl shadow-2xl border border-amber-400/30 flex items-center gap-3 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo App */}
        <div className="w-12 h-12 rounded-xl bg-white p-0.5 shrink-0 shadow-md ring-2 ring-amber-400/40">
          <img 
            src="./logo-tbm.png" 
            alt="Logo TBM" 
            className="w-full h-full object-cover rounded-[10px]"
          />
        </div>

        {/* Text Info */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-400/30">
              Aplikasi HP
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
            Pasang TBM Al Islamiyah
          </h4>
          <p className="text-[11px] text-slate-300 line-clamp-1">
            {isIos ? 'Ketuk Bagikan > Layar Utama' : 'Akses cepat & ringan tanpa buka browser'}
          </p>
        </div>

        {/* Install Button */}
        <button
          onClick={handleInstallClick}
          className="shrink-0 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {isIos ? (
            <>
              <Share className="w-3.5 h-3.5" />
              <span>Pasang</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Instal</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
