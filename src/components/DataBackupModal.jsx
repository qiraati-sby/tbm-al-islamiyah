import React, { useRef, useState, useEffect } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Cloud, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Save,
  RefreshCw,
  X 
} from 'lucide-react';
import { syncAllToGoogleDrive } from '../utils/googleSync';
import { DEFAULT_GDRIVE_SCRIPT_URL } from '../data/initialData';

export default function DataBackupModal({ 
  isOpen, 
  onClose, 
  allData, 
  onRestoreData, 
  onResetData 
}) {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('drive'); // 'drive' or 'local'
  const [googleScriptUrl, setGoogleScriptUrl] = useState(() => {
    return localStorage.getItem('tbm_gdrive_script_url') || DEFAULT_GDRIVE_SCRIPT_URL;
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  useEffect(() => {
    const savedUrl = localStorage.getItem('tbm_gdrive_script_url');
    if (!savedUrl) {
      localStorage.setItem('tbm_gdrive_script_url', DEFAULT_GDRIVE_SCRIPT_URL);
    }
  }, []);

  if (!isOpen) return null;

  // Save Google Script URL
  const handleSaveGoogleUrl = (e) => {
    e.preventDefault();
    localStorage.setItem('tbm_gdrive_script_url', googleScriptUrl.trim());
    setSyncStatus('URL Google Drive berhasil disimpan!');
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // Trigger Bulk Sync to Google Drive
  const handleBulkSyncToGoogle = async () => {
    if (!googleScriptUrl.trim()) {
      alert("Silakan masukkan URL Web App Google Apps Script terlebih dahulu.");
      return;
    }

    setIsSyncing(true);
    setSyncStatus('Sedang mengirim data ke Google Spreadsheet di Google Drive...');

    try {
      await syncAllToGoogleDrive(googleScriptUrl.trim(), allData.visitors || [], allData.books || []);
      setSyncStatus('Data berhasil disinkronkan ke Google Spreadsheet!');
      setTimeout(() => setSyncStatus(null), 4000);
    } catch (err) {
      setSyncStatus('Gagal: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Export JSON file
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
    const downloadAnchor = document.createElement('a');
    const todayStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Backup_TBM_Al_Islamiyah_${todayStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON file
  const handleFileChange = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.books && parsed.visitors) {
            onRestoreData(parsed);
            alert("Data berhasil dipulihkan dari file cadangan!");
            onClose();
          } else {
            alert("Format file cadangan tidak valid.");
          }
        } catch (error) {
          alert("Gagal membaca file JSON: " + error.message);
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0b2864] text-white flex items-center justify-between border-b border-[#143782]">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base">Penyimpanan & Koneksi Google Drive</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('drive')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'drive'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cloud className="w-4 h-4 text-emerald-600" />
            <span>Koneksi Google Drive (Sheets)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('local')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'local'
                ? 'border-[#0b2864] text-[#0b2864] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4 text-[#0b2864]" />
            <span>Cadangan File Lokal (.JSON)</span>
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs sm:text-sm">
          
          {/* TAB 1: GOOGLE DRIVE CONNECTION */}
          {activeTab === 'drive' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-xs text-emerald-900">
                  <Cloud className="w-4 h-4 text-emerald-600" />
                  <span>Sinkronisasi Otomatis ke Google Drive</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Setiap kali ada pengunjung baru yang mengisi buku tamu atau buku baru yang diinput, data dapat otomatis terkirim dan tersimpan di <b>Google Spreadsheet di Google Drive Anda</b>.
                </p>
              </div>

              {/* Status Alert */}
              {syncStatus && (
                <div className="p-2.5 rounded-lg bg-slate-900 text-white text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{syncStatus}</span>
                </div>
              )}

              {/* URL Input Form */}
              <form onSubmit={handleSaveGoogleUrl} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  URL Web App Google Apps Script:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    value={googleScriptUrl}
                    onChange={(e) => setGoogleScriptUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Save className="w-3.5 h-3.5" /> Simpan
                  </button>
                </div>
              </form>

              {/* Manual Bulk Sync Button */}
              {googleScriptUrl && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleBulkSyncToGoogle}
                    disabled={isSyncing}
                    className="w-full bg-[#0b2864] hover:bg-[#143782] disabled:opacity-50 text-white font-bold p-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-xs sm:text-sm"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Sedang Mengirim ke Google Drive...' : 'Kirim / Sinkronkan Semua Data ke Google Drive Sekarang'}</span>
                  </button>
                </div>
              )}

              {/* Quick Setup Instructions */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800">📄 Cara Mengaktifkan Google Apps Script:</div>
                <ol className="list-decimal pl-4 space-y-0.5">
                  <li>Buat Spreadsheet baru di <b>Google Drive</b> Anda.</li>
                  <li>Buka <b>Ekstensi &gt; Apps Script</b>.</li>
                  <li>Salin kode dari file <code>google-apps-script.js</code> di proyek ini ke sana.</li>
                  <li>Klik <b>Deploy &gt; New deployment &gt; Web app</b> (Who has access: <i>Anyone</i>).</li>
                  <li>Tempelkan URL hasil deploy ke kotak di atas!</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: LOCAL JSON BACKUP */}
          {activeTab === 'local' && (
            <div className="space-y-3">
              <p className="text-slate-600 text-xs">
                Data disimpan di memori peramban (LocalStorage). Gunakan menu ini untuk mengunduh berkas cadangan offline atau memulihkan data.
              </p>

              <div className="space-y-2.5 pt-1">
                {/* Download Backup */}
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-50 text-emerald-950 font-semibold transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-emerald-600" />
                    <div className="text-left text-xs">
                      <div className="font-bold">Unduh File Cadangan (.JSON)</div>
                      <div className="text-[10px] text-emerald-700">Simpan salinan data buku & pengunjung di komputer</div>
                    </div>
                  </div>
                </button>

                {/* Restore Backup */}
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Upload className="w-4 h-4 text-[#0b2864]" />
                      <div className="text-left text-xs">
                        <div className="font-bold">Pulihkan dari File (.JSON)</div>
                        <div className="text-[10px] text-slate-500">Muat kembali data dari berkas cadangan</div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Reset to Default */}
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Apakah Anda yakin ingin mengatur ulang ke data contoh awal?")) {
                      onResetData();
                      onClose();
                    }
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-50 text-rose-950 font-semibold transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <RotateCcw className="w-4 h-4 text-rose-600" />
                    <div className="text-left text-xs">
                      <div className="font-bold">Reset ke Data Contoh Standar</div>
                      <div className="text-[10px] text-rose-700">Kembalikan katalog dan pengunjung ke bawaan</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Footer close button */}
          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Tutup
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
