# Panduan Menaruh Web ke GitHub & Menghubungkan ke Google Drive

Dokumen ini berisi panduan lengkap untuk:
1. Menghubungkan database web ke **Google Spreadsheet di Google Drive** (agar data presensi & buku otomatis masuk ke Google Drive secara gratis & real-time).
2. Mengunggah web ke **GitHub** agar online dan bisa diakses oleh siapa saja lewat internet.

---

## BAGIAN 1: Menghubungkan ke Google Drive (Google Sheets)

Dengan langkah ini, setiap ada pengunjung yang mengisi buku tamu atau buku baru yang diinput, datanya **langsung tersimpan di Google Drive pengurus TBM**.

### Langkah-langkah:
1. Buka [Google Drive](https://drive.google.com).
2. Buat **Google Spreadsheet** baru, beri nama: `Database TBM Al Islamiyah`.
3. Pada menu atas Spreadsheet, klik: **Ekstensi (Extensions) > Apps Script**.
4. Hapus kode default yang ada di sana, lalu buka file `google-apps-script.js` yang ada di folder proyek ini:
   - Salin (Copy) semua isi kode file `google-apps-script.js`.
   - Tempel (Paste) ke editor Google Apps Script tersebut.
5. Klik ikon **Simpan (Save/Disket)**.
6. Klik tombol biru **Terapkan (Deploy)** di pojok kanan atas > Pilih **Penerapan baru (New deployment)**.
7. Pada ikon Gerigi (Select type), pilih **Aplikasi web (Web app)**.
8. Atur pengaturannya:
   - **Deskripsi**: `API TBM Al Islamiyah`
   - **Jalankan sebagai**: `Saya (email Anda)`
   - **Siapa yang memiliki akses**: Pilih **`Siapa saja (Anyone)`** *(Wajib agar website dapat mengirim data)*
9. Klik **Terapkan (Deploy)**, lalu klik **Izinkan akses (Authorize access)** dengan akun Google Anda.
10. Salin **URL Aplikasi Web** yang muncul (berakhiran `/exec`).
11. Buka website TBM Al Islamiyah Anda:
    - Klik tombol database/koneksi di pojok kanan atas (atau menu *Manajemen Cadangan Data*).
    - Pada tab **Koneksi Google Drive (Sheets)**, tempelkan URL tersebut ke kolom input, lalu klik **Simpan**.
12. Selesai! Klik tombol *"Kirim / Sinkronkan Semua Data ke Google Drive Sekarang"* untuk mencoba mengirim seluruh data buku dan pengunjung saat ini ke Google Spreadsheet.

---

## BAGIAN 2: Mengunggah Web ke GitHub & Online Gratis (GitHub Pages)

### Cara A: Menggunakan GitHub Web (Paling Mudah, Tanpa Perlu Install Git)
1. Buka [GitHub.com](https://github.com) dan login ke akun Anda.
2. Buat repository baru, misalnya bernama: `tbm-al-islamiyah` (pilih Public).
3. Klik tombol **"uploading an existing file"**.
4. Buka folder proyek di komputer Anda:
   `C:\Users\User\.gemini\antigravity\scratch\tbm-al-islamiyah`
5. Tarik (drag & drop) semua file di folder tersebut ke GitHub (kecuali folder `node_modules`).
6. Klik **Commit changes**.
7. Untuk mengaktifkan website online:
   - Di halaman repository GitHub Anda, klik menu **Settings > Pages**.
   - Pada bagian **Build and deployment > Source**, pilih **GitHub Actions**.
   - Sistem akan otomatis mendeteksi file `.github/workflows/deploy.yml` yang sudah kami siapkan dan menerbitkan website Anda secara gratis!
   - Website Anda akan memiliki alamat resmi: `https://USERNAME.github.io/tbm-al-islamiyah/`.

### Cara B: Menggunakan Vercel (1-Klik Online Otomatis)
1. Buka [Vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda.
2. Klik **Add New Project** > Pilih repository `tbm-al-islamiyah`.
3. Klik **Deploy**.
4. Dalam 1 menit, web Anda langsung online dengan link resmi yang cepat dan memiliki sertifikat keamanan SSL gratis!
