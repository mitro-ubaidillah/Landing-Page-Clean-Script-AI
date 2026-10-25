// CleanScript AI — Waitlist ke Google Sheets (Apps Script Web App)
// ===============================================================
// CARA PAKAI:
// 1. Buka spreadsheet Google Sheets kosong (mis. "Waitlist CleanScript").
// 2. Menu: Extensions -> Apps Script. Hapus isi, tempel kode ini.
// 3. Simpan (Ctrl+S), beri nama project "Waitlist CleanScript".
// 4. Deploy -> New deployment -> pilih type "Web app":
//      - Execute as  : Me (akun pemilik spreadsheet)
//      - Who has access: Anyone
//    Klik Deploy, izinkan permission yang diminta.
// 5. Salin URL deployment yang berakhiran /exec, tempel di
//    landing/script.js -> const APPS_SCRIPT_URL.
// 6. Deploy ulang landing di Netlify.
//
// Catatan: request dari browser dikirim sebagai text/plain berisi JSON
// (lihat script.js, mode no-cors). Baca via e.postData.contents.

const SHEET_NAME = 'waitlist'; // ganti jika ingin nama sheet berbeda

function doPost(e) {
  var email = '';
  try {
    if (e && e.postData && e.postData.contents) {
      email = JSON.parse(e.postData.contents).email || '';
    }
  } catch (err) {
    return respond({ ok: false, error: 'bad_input' });
  }

  email = String(email).trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return respond({ ok: false, error: 'invalid_email' });
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Waktu', 'Email', 'Sumber']);
    }
    // Cegah duplikat (kalau belum ada email yang sama, baru append).
    var existing = sheet.getRange(2, 2, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
    var dup = existing.some(function (r) { return String(r[0]).trim().toLowerCase() === email; });
    if (!dup) {
      sheet.appendRow([new Date(), email, 'landing']);
    }
    return respond({ ok: true });
  } catch (err) {
    return respond({ ok: false, error: String(err) });
  }
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
