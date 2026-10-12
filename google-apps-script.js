/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - DATABASE TBM AL ISLAMIYAH (GOOGLE DRIVE)
 * =========================================================================
 * 
 * PANDUAN PEMASANGAN (CUKUP SEKALI SAJA):
 * 1. Buka Google Drive (https://drive.google.com) Anda.
 * 2. Buat Google Spreadsheet baru, beri nama: "Database TBM Al Islamiyah".
 * 3. Di menu atas Spreadsheet, klik: Extensions (Ekstensi) > Apps Script.
 * 4. Hapus semua kode default di sana, lalu SALIN & TEMPEL (Copy-Paste) seluruh isi file ini.
 * 5. Klik ikon Simpan (Save/Disket).
 * 6. Klik tombol "Deploy" (Terapkan) di pojok kanan atas > Pilih "New deployment" (Penerapan baru).
 * 7. Pada ikon Gerigi (Select type), pilih "Web app".
 * 8. Isi konfigurasi:
 *    - Description: "API TBM Al Islamiyah"
 *    - Execute as: "Me (email anda)"
 *    - Who has access: "Anyone" (Siapa saja - agar website dapat mengirim data)
 * 9. Klik "Deploy", lalu izinkan akses Google (Authorize access).
 * 10. Salin "Web App URL" yang diberikan (contoh: https://script.google.com/macros/s/AKfycb.../exec).
 * 11. Tempel URL tersebut ke menu "Sinkronisasi Google Drive" di website TBM Al Islamiyah Anda!
 * =========================================================================
 */

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Inisialisasi Sheet jika belum ada
    setupSheetsIfMissing(ss);

    var action = contents.action;
    var data = contents.data;

    // AKSI 1: TAMBAH DATA PENGUNJUNG BARU (PRESENSI)
    if (action === "ADD_VISITOR") {
      var sheetVisitor = ss.getSheetByName("Pengunjung");
      sheetVisitor.appendRow([
        data.id || "",
        data.date || Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd"),
        data.time || Utilities.formatDate(new Date(), "Asia/Jakarta", "HH:mm"),
        data.name || "",
        data.gender || "",
        data.category || "",
        data.institution || "",
        data.purpose || "",
        data.notes || "",
        new Date()
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Data pengunjung berhasil dicatat di Google Spreadsheet!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // AKSI 2: TAMBAH / UPDATE BUKU
    if (action === "ADD_BOOK") {
      var sheetBooks = ss.getSheetByName("Buku");
      sheetBooks.appendRow([
        data.code || "",
        data.callNumber || "",
        data.title || "",
        data.author || "",
        data.publisher || "",
        data.year || "",
        data.category || "",
        data.ddc || "",
        data.rack || "",
        data.stock || 1,
        data.available || 1,
        data.isbn || "",
        data.donor || "",
        new Date()
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Data buku berhasil ditambahkan ke Google Spreadsheet!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // AKSI 3: SINKRONISASI MASSAL SEMUA DATA (BULK SYNC)
    if (action === "SYNC_ALL") {
      var visitors = contents.visitors || [];
      var books = contents.books || [];

      // Update Sheet Pengunjung
      var sheetV = ss.getSheetByName("Pengunjung");
      sheetV.clearContents();
      sheetV.appendRow(["ID", "Tanggal", "Jam", "Nama Pengunjung", "L/P", "Kategori", "Asal Instansi/Sekolah", "Keperluan", "Catatan", "Waktu Sinkron"]);
      sheetV.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#047857").setFontColor("#FFFFFF");

      for (var i = 0; i < visitors.length; i++) {
        var v = visitors[i];
        sheetV.appendRow([v.id, v.date, v.time, v.name, v.gender, v.category, v.institution, v.purpose, v.notes, new Date()]);
      }

      // Update Sheet Buku
      var sheetB = ss.getSheetByName("Buku");
      sheetB.clearContents();
      sheetB.appendRow(["Nomor Induk", "Nomor Panggil (Call No)", "Judul Buku", "Pengarang", "Penerbit", "Tahun", "Kategori", "DDC", "Lokasi Rak", "Stok", "Tersedia", "ISBN", "Sumber/Wakaf", "Waktu Sinkron"]);
      sheetB.getRange(1, 1, 1, 14).setFontWeight("bold").setBackground("#0b2864").setFontColor("#FFFFFF");

      for (var j = 0; j < books.length; j++) {
        var b = books[j];
        sheetB.appendRow([b.code, b.callNumber, b.title, b.author, b.publisher, b.year, b.category, b.ddc, b.rack, b.stock, b.available, b.isbn, b.donor, new Date()]);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Semua data buku & pengunjung berhasil disinkronkan ke Google Spreadsheet!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Aksi tidak dikenali"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Untuk tes koneksi melalui Browser URL biasa
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    name: "API Database Google Drive TBM Al Islamiyah",
    time: new Date()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Helper: Setup nama header kolom otomatis
function setupSheetsIfMissing(ss) {
  var sheetV = ss.getSheetByName("Pengunjung");
  if (!sheetV) {
    sheetV = ss.insertSheet("Pengunjung");
    sheetV.appendRow(["ID", "Tanggal", "Jam", "Nama Pengunjung", "L/P", "Kategori", "Asal Instansi/Sekolah", "Keperluan", "Catatan", "Waktu Tercatat"]);
    sheetV.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#047857").setFontColor("#FFFFFF");
  }

  var sheetB = ss.getSheetByName("Buku");
  if (!sheetB) {
    sheetB = ss.insertSheet("Buku");
    sheetB.appendRow(["Nomor Induk", "Nomor Panggil (Call No)", "Judul Buku", "Pengarang", "Penerbit", "Tahun", "Kategori", "DDC", "Lokasi Rak", "Stok", "Tersedia", "ISBN", "Sumber/Wakaf", "Waktu Tercatat"]);
    sheetB.getRange(1, 1, 1, 14).setFontWeight("bold").setBackground("#0b2864").setFontColor("#FFFFFF");
  }
}
