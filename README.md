# Sistem Informasi Taman Baca Masyarakat (TBM) Al Islamiyah

Aplikasi web modern, profesional, dan responsif untuk pengelolaan **Taman Baca Masyarakat Al Islamiyah**, mencakup pencatatan data pengunjung, manajemen katalog buku, pembuatan label punggung & barcode buku, serta sirkulasi peminjaman.

---

## 🌟 Fitur Utama

### 1. 👥 Manajemen Data Pengunjung (Buku Tamu & Presensi)
- Form pencatatan kehadiran pemustaka dengan atribut lengkap:
  - Tanggal & Jam kedatangan (otomatis / kustom)
  - Nama Pengunjung & Jenis Kelamin
  - Kategori Pemustaka: *Siswa / Santri, Mahasiswa, Guru / Ustadz, Warga Umum, Anak-anak (PAUD/TK)*
  - Asal Sekolah / Instansi / RT-RW
  - Keperluan Kunjungan: *Membaca di Tempat, Peminjaman, Mengerjakan Tugas, Kajian, dsb.*
- Pencarian cerdas & filter berdasarkan kategori dan rentang waktu.
- **Ekspor Excel / CSV**: Download data rekapitulasi pengunjung format CSV (UTF-8 BOM siap buka di Microsoft Excel).
- **Cetak Laporan**: Fitur cetak rekap kehadiran resmi.

### 2. 📚 Manajemen Data Buku (Katalog Koleksi)
- Input & Edit data koleksi dengan standar perpustakaan:
  - Nomor Induk Buku (Barcode ID e.g. `TBM-ISL-001`)
  - Judul, Penulis, Penerbit, Tahun Terbit, ISBN
  - Klasifikasi DDC (Dewey Decimal Classification) & Kategori
  - **Generator Nomor Panggil Otomatis (Call Number)**:
    - Menghasilkan format standar perpustakaan secara otomatis: `[DDC] [3 Huruf Pengarang] [Huruf Judul]` (Contoh: `297.9 ALM a`).
  - Penempatan Lokasi Rak (e.g. *Rak A-1 (Al-Qur'an & Hadits)*)
  - Jumlah Stok & Eksemplar Tersedia
  - Asal Sumber Buku / Wakaf / Donatur
- Mode Tampilan: **Tabel Data** dan **Grid Kartu Buku Estetis**.
- Ekspor data katalog ke Excel/CSV.

### 3. 🏷️ Generator & Cetak Label Buku (Spine Label & Barcode)
- **3 Format Label Siap Cetak**:
  1. **Kombo 2-in-1**: Sisi kiri label punggung (Call number) + sisi kanan barcode dan judul.
  2. **Label Punggung (Spine Label)**: Format 4 baris standar perpustakaan untuk ditempel di punggung buku.
  3. **Stiker Barcode**: Barcode Code 128 terbaca scanner barcode + judul dan rak buku.
- **Kustomisasi Cetak**:
  - Pilihan buku satuan atau cetak massal (semua / per rak).
  - Pilihan 2, 3, atau 4 kolom per lembar stiker A4 / label Tom & Jerry (No. 103/104).
  - Pilihan garis potong (cut guide), tema warna (*Hijau Al Islamiyah*, *Hitam Klasik*, *Biru*).
- **Cetak Langsung (Print Preview)**: Desain `@media print` presisi tanpa terpotong dan menyembunyikan navigasi web secara otomatis.

### 4. 🔄 Layanan Sirkulasi (Peminjaman & Pengembalian)
- Pencatatan peminjaman buku dengan tanggal batas kembali (due date).
- Indikator keterlambatan (overdue badge).
- Pengembalian buku 1-klik yang otomatis memperbarui jumlah stok buku tersedia.

### 5. 💾 Penyimpanan & Portabilitas Data
- **LocalStorage Persistence**: Data tersimpan permanen di peramban (tidak hilang saat di-refresh).
- **Backup & Restore**: Ekspor dan impor data cadangan berformat JSON kapan saja.
- **Reset**: Pilihan untuk memulihkan ke data contoh awal.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi telah terpasang dan server lokal sedang aktif:
- **URL Akses**: [http://localhost:5173/](http://localhost:5173/)

Jika ingin menjalankan ulang di kemudian hari:
```bash
cd C:\Users\User\.gemini\antigravity\scratch\tbm-al-islamiyah
npm.cmd run dev
```
Buka browser dan kunjungi `http://localhost:5173/`.
