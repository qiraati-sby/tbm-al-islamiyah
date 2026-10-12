// Helper untuk sinkronisasi data ke Google Drive (Google Sheets) via Apps Script Web App

export async function syncVisitorToGoogleDrive(apiUrl, visitorData) {
  if (!apiUrl || !apiUrl.trim().startsWith('http')) return false;

  try {
    await fetch(apiUrl, {
      method: 'POST',
      mode: 'no-cors', // Apps Script requires no-cors for direct browser post
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
    console.error('Gagal mengirim ke Google Drive:', error);
    return false;
  }
}

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
    console.error('Gagal mengirim ke Google Drive:', error);
    return false;
  }
}

export async function syncAllToGoogleDrive(apiUrl, visitors, books) {
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
        visitors: visitors,
        books: books
      })
    });
    return true;
  } catch (error) {
    console.error('Gagal sinkronisasi ke Google Drive:', error);
    return false;
  }
}
