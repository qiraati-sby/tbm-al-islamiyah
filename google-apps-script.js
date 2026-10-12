/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - DATABASE TBM AL ISLAMIYAH (GOOGLE DRIVE)
 * =========================================================================
 * 
 * Script ini berfungsi sebagai backend API database Google Drive TBM Al Islamiyah.
 * Setiap data pengunjung, buku, dan sirkulasi akan tersimpan otomatis di sini
 * dan langsung dimuat oleh website secara otomatis (tanpa tombol update manual).
 * =========================================================================
 */

// 1. MEMBACA DATA DARI GOOGLE SPREADSHEET KE WEBSITE SECARA OTOMATIS
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    setupSheetsIfMissing(ss);

    // Ambil data Pengunjung
    var sheetV = ss.getSheetByName("Pengunjung");
    var vData = sheetV.getDataRange().getValues();
    var visitors = [];
    if (vData.length > 1) {
      for (var i = 1; i < vData.length; i++) {
        var row = vData[i];
        if (row[3] || row[0]) {
          visitors.push({
            id: String(row[0] || ("V" + i)),
            date: row[1] instanceof Date ? Utilities.formatDate(row[1], "Asia/Jakarta", "yyyy-MM-dd") : String(row[1] || ""),
            time: row[2] instanceof Date ? Utilities.formatDate(row[2], "Asia/Jakarta", "HH:mm") : String(row[2] || ""),
            name: String(row[3] || ""),
            gender: String(row[4] || ""),
            category: String(row[5] || ""),
            institution: String(row[6] || ""),
            purpose: String(row[7] || ""),
            notes: String(row[8] || "")
          });
        }
      }
    }

    // Ambil data Buku
    var sheetB = ss.getSheetByName("Buku");
    var bData = sheetB.getDataRange().getValues();
    var books = [];
    if (bData.length > 1) {
      for (var j = 1; j < bData.length; j++) {
        var bRow = bData[j];
        if (bRow[2] || bRow[0]) {
          books.push({
            id: "B" + String(j).padStart(3, '0'),
            code: String(bRow[0] || ""),
            callNumber: String(bRow[1] || ""),
            title: String(bRow[2] || ""),
            author: String(bRow[3] || ""),
            publisher: String(bRow[4] || ""),
            year: String(bRow[5] || ""),
            category: String(bRow[6] || ""),
            ddc: String(bRow[7] || ""),
            rack: String(bRow[8] || ""),
            stock: Number(bRow[9]) || 1,
            available: Number(bRow[10]) || 1,
            isbn: String(bRow[11] || ""),
            donor: String(bRow[12] || "")
          });
        }
      }
    }

    // Ambil data Sirkulasi Pinjam
    var sheetL = ss.getSheetByName("Sirkulasi");
    var loans = [];
    if (sheetL) {
      var lData = sheetL.getDataRange().getValues();
      if (lData.length > 1) {
        for (var k = 1; k < lData.length; k++) {
          var lRow = lData[k];
          if (lRow[0] || lRow[1]) {
            loans.push({
              id: String(lRow[0] || ("L" + k)),
              bookId: String(lRow[1] || ""),
              bookTitle: String(lRow[2] || ""),
              bookCode: String(lRow[3] || ""),
              borrowerName: String(lRow[4] || ""),
              borrowerCategory: String(lRow[5] || ""),
              borrowDate: lRow[6] instanceof Date ? Utilities.formatDate(lRow[6], "Asia/Jakarta", "yyyy-MM-dd") : String(lRow[6] || ""),
              dueDate: lRow[7] instanceof Date ? Utilities.formatDate(lRow[7], "Asia/Jakarta", "yyyy-MM-dd") : String(lRow[7] || ""),
              status: String(lRow[8] || "Dipinjam"),
              returnDate: lRow[9] instanceof Date ? Utilities.formatDate(lRow[9], "Asia/Jakarta", "yyyy-MM-dd") : (lRow[9] ? String(lRow[9]) : null)
            });
          }
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      name: "API Database Google Drive TBM Al Islamiyah",
      time: new Date(),
      visitors: visitors,
      books: books,
      loans: loans
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. MENERIMA DATA DARI WEBSITE KE GOOGLE SPREADSHEET
function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    setupSheetsIfMissing(ss);

    var action = contents.action;
    var data = contents.data;

    // AKSI 1: TAMBAH DATA PENGUNJUNG BARU (PRESENSI REAL-TIME)
    if (action === "ADD_VISITOR") {
      var sheetVisitor = ss.getSheetByName("Pengunjung");
      sheetVisitor.appendRow([
        data.id || ("V" + Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyyMMddHHmmss")),
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

    // AKSI 2: TAMBAH DATA BUKU BARU
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

    // AKSI 3: SINKRONISASI LENGKAP SEMUA TABEL
    if (action === "SYNC_ALL") {
      var visitors = contents.visitors || [];
      var books = contents.books || [];
      var loans = contents.loans || [];

      // Sheet Pengunjung
      var sheetV = ss.getSheetByName("Pengunjung");
      sheetV.clearContents();
      sheetV.appendRow(["ID", "Tanggal", "Jam", "Nama Pengunjung", "L/P", "Kategori", "Asal Instansi/Sekolah", "Keperluan", "Catatan", "Waktu Sinkron"]);
      sheetV.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#047857").setFontColor("#FFFFFF");
      for (var i = 0; i < visitors.length; i++) {
        var v = visitors[i];
        sheetV.appendRow([v.id, v.date, v.time, v.name, v.gender, v.category, v.institution, v.purpose, v.notes, new Date()]);
      }

      // Sheet Buku
      var sheetB = ss.getSheetByName("Buku");
      sheetB.clearContents();
      sheetB.appendRow(["Nomor Induk", "Nomor Panggil (Call No)", "Judul Buku", "Pengarang", "Penerbit", "Tahun", "Kategori", "DDC", "Lokasi Rak", "Stok", "Tersedia", "ISBN", "Sumber/Wakaf", "Waktu Sinkron"]);
      sheetB.getRange(1, 1, 1, 14).setFontWeight("bold").setBackground("#0b2864").setFontColor("#FFFFFF");
      for (var j = 0; j < books.length; j++) {
        var b = books[j];
        sheetB.appendRow([b.code, b.callNumber, b.title, b.author, b.publisher, b.year, b.category, b.ddc, b.rack, b.stock, b.available, b.isbn, b.donor, new Date()]);
      }

      // Sheet Sirkulasi
      var sheetL = ss.getSheetByName("Sirkulasi");
      if (sheetL) {
        sheetL.clearContents();
        sheetL.appendRow(["ID Pinjam", "ID Buku", "Judul Buku", "Kode Buku", "Nama Peminjam", "Kategori", "Tanggal Pinjam", "Jatuh Tempo", "Status", "Tanggal Kembali", "Waktu Sinkron"]);
        sheetL.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#b45309").setFontColor("#FFFFFF");
        for (var k = 0; k < loans.length; k++) {
          var l = loans[k];
          sheetL.appendRow([l.id, l.bookId, l.bookTitle, l.bookCode, l.borrowerName, l.borrowerCategory, l.borrowDate, l.dueDate, l.status, l.returnDate || "", new Date()]);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Seluruh data berhasil disinkronkan ke Google Spreadsheet!"
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

// Inisialisasi struktur Sheet
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

  var sheetL = ss.getSheetByName("Sirkulasi");
  if (!sheetL) {
    sheetL = ss.insertSheet("Sirkulasi");
    sheetL.appendRow(["ID Pinjam", "ID Buku", "Judul Buku", "Kode Buku", "Nama Peminjam", "Kategori", "Tanggal Pinjam", "Jatuh Tempo", "Status", "Tanggal Kembali", "Waktu Tercatat"]);
    sheetL.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#b45309").setFontColor("#FFFFFF");
  }
}
