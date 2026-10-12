// Helper untuk komunikasi real-time dua arah ke Google Drive (Google Sheets) via Apps Script Web App

// 1. Ambil seluruh data terbaru dari Google Drive saat website dibuka / berkala
export async function fetchDataFromGoogleDrive(apiUrl) {
  if (!apiUrl || !apiUrl.trim().startsWith('http')) return null;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('Gagal membaca data dari Google Drive:', error);
    return null;
  }
}

// 2. Kirim data pengunjung baru langsung ke Google Drive
export async function syncVisitorToGoogleDrive(apiUrl, visitorData) {
  if (!apiUrl || !apiUrl.trim().startsWith('http')) return false;

  try {
    await fetch(apiUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'ADD_VISITOR',
        data: visitorData
      })
    });
    return true;
  } catch (error) {
    console.error('Gagal mengirim pengunjung ke Google Drive:', error);
    return false;
  }
}

// 3. Kirim data buku baru langsung ke Google Drive
export async function syncBookToGoogleDrive(apiUrl, bookData) {
  if (!apiUrl || !apiUrl.trim().startsWith('http')) return false;

  try {
    await fetch(apiUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'ADD_BOOK',
        data: bookData
      })
    });
    return true;
  } catch (error) {
    console.error('Gagal mengirim buku ke Google Drive:', error);
    return false;
  }
}

// 4. Sinkronisasi seluruh koleksi & peminjaman ke Google Drive
export async function syncAllToGoogleDrive(apiUrl, visitors, books, loans = []) {
  if (!apiUrl || !apiUrl.trim().startsWith('http')) return false;

  try {
    await fetch(apiUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'SYNC_ALL',
        visitors: visitors || [],
        books: books || [],
        loans: loans || []
      })
    });
    return true;
  } catch (error) {
    console.error('Gagal sinkronisasi data ke Google Drive:', error);
    return false;
  }
}
