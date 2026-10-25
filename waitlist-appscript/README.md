# Waitlist → Google Sheets (Apps Script)

Cara menghubungkan form waitlist landing ke Google Sheets tanpa server,
tanpa layanan berbayar. Memakai **Google Apps Script Web App**.

## Alur

```
Pengunjung submit  →  fetch(mode no-cors)  →  URL /exec  →  Apps Script doPost
                                                        →  appendRow ke sheet "waitlist"
```

## Langkah sekali set (dilakukan kamu, ~10 menit)

1. Buat **Google Sheet** kosong (nama bebas, misal "Waitlist CleanScript").
2. **Extensions → Apps Script** → tempel isi `Code.gs` → simpan.
3. **Deploy → New deployment** → type **Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   - Klik **Deploy** → izinkan permission yang diminta.
4. Salin **URL deployment** (akhiran `/exec`) → tempel di `landing/script.js`:
   `const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec';`
5. Deploy ulang landing di Netlify.

## Yang dihasilkan di sheet

Kolom: **Waktu · Email · Sumber** (duplikat email otomatis dicegah).

## Keamanan

- Web app open "Anyone" = siapa pun bisa kirim email (kebutuhan form publik).
  Proteksi spam minimum: validasi email + skip duplikat. Untuk anti-spam lanjut:
  tambahkan honeypot field + opsi batas harian di Apps Script.
- Tanpa API key, tanpa secret di repo — hanya URL deployment (publik, aman).

## Verifikasi

Setelah semua aktif: isi form di landing → buka Sheet → baris baru muncul.
Atau dari terminal (uji sendiri): `curl -X POST <URL_APPS_SCRIPT> -H "Content-Type: text/plain" -d '{"email":"tes@contoh.com"}'`
