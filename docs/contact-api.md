# API Formulir Kontak

Menerima kiriman formulir Kontak dan meneruskannya ke email penerima lewat Gmail API. Isian tidak disimpan dan tidak dicatat di log (NF-W-05).

Kebutuhan terkait: F-W-13, F-W-14, F-W-15, F-W-17, NF-W-04, NF-W-05, NF-W-06, NF-W-07, UC-W-06, UC-W-09.

## Cara memakai dari halaman Kontak

1. Saat formulir dibuka, panggil `GET /api/contact` dan simpan `formToken`.
2. Saat tombol kirim ditekan, panggil `POST /api/contact` dengan JSON berikut.
3. Tampilkan hasil sesuai tabel respons. Jangan mengosongkan isian kecuali `status` bernilai `sent`.

```json
{
  "name": "Budi Contoh",
  "email": "budi@contoh.test",
  "organization": "PT Contoh",
  "phone": "081234567890",
  "message": "Halo VeloCT",
  "privacyConsent": true,
  "locale": "id",
  "formToken": "<dari GET /api/contact>",
  "website": ""
}
```

`website` adalah kolom jebakan bot. Tampilkan di HTML tetapi sembunyikan dari pengunjung (di luar layar, `tabindex="-1"`, `autocomplete="off"`, `aria-hidden="true"`), dan biarkan kosong.

| Kolom | Aturan |
|---|---|
| `name` | Wajib, paling panjang 100 karakter, satu baris |
| `email` | Wajib, format email, paling panjang 254 karakter |
| `organization` | Wajib, paling panjang 150 karakter, satu baris |
| `phone` | Opsional. Nomor ponsel berawalan `08` atau `+628`, 10 sampai 13 digit untuk format `08`. Spasi dan tanda hubung boleh dipakai, dan nomor ditulis di email tanpa pemisah. Bila kosong, email menulis `-` |
| `message` | Wajib, paling panjang 5000 karakter |
| `privacyConsent` | Harus bernilai `true` |
| `locale` | `id` atau `en`, menentukan bahasa pesan respons. Bawaan `id` |

## Respons

Semua respons berisi `status`, dan `message` berisi teks siap tampil dalam bahasa `locale`.

| HTTP | `status` | Yang dilakukan halaman |
|---|---|---|
| 200 | `sent` | Tampilkan `message`, berisi janji balasan 3 hari kerja (F-W-17) |
| 422 | `invalid` | Tandai setiap kolom di `fields`, contoh `{ "email": "Format email tidak valid." }` |
| 502, 503 | `failed` | Tampilkan `message` dan `alternatives` (`email`, `whatsapp`, bisa `null`) |
| 403 | `expired` | Ambil `formToken` baru dan tampilkan `message`. Pengunjung menekan kirim lagi |
| 403, 400, 413 | `rejected` | Tampilkan `message` |
| 429 | `rateLimited` | Tampilkan `message`. Header `Retry-After` berisi lama tunggu dalam detik |

`GET /api/contact` mengembalikan `{ "formToken": "..." }`, atau HTTP 503 bila `CONTACT_FORM_SECRET` belum diisi.

## Anti-spam

Website tidak punya basis data, jadi pemeriksaannya tidak menyimpan apa pun kecuali penghitung sementara di memori.

| Pemeriksaan | Aturan | Bila gagal |
|---|---|---|
| Origin | Header `Origin` harus sama dengan host website | 403 `rejected` |
| Kolom jebakan | `website` harus kosong | 200 `sent` palsu, email tidak dikirim |
| Token bertanda tangan | Ditandatangani server, umur minimal 3 detik, maksimal 24 jam | 403 `rejected` atau `expired` |
| Batas kiriman | 5 kiriman per IP per 10 menit. IP di-hash | 429 `rateLimited` |

Batasannya: penghitung kiriman hanya berlaku per instance server dan hilang saat instance berhenti. Skrip yang sengaja dibuat untuk formulir ini (mengambil token, menunggu 3 detik, memalsukan `Origin`) masih bisa lolos sampai batas kiriman. Bila itu terjadi setelah rilis, langkah berikutnya adalah CAPTCHA seperti Cloudflare Turnstile, dan layanan tersebut perlu disebutkan di Kebijakan Privasi.

## Waktu persetujuan privasi

Waktu persetujuan adalah waktu server saat kiriman diterima, karena kotak persetujuan harus tercentang pada saat itu (F-W-15) dan waktu dari browser bisa dipalsukan. Email menuliskannya dalam WIB dan UTC.

## Menyiapkan Gmail

Kredensial hanya disimpan di `.env.local` dan di pengaturan Vercel, tidak pernah di repositori.

1. Masuk ke [Google Cloud Console](https://console.cloud.google.com/) dengan akun pengirim, lalu buat proyek.
2. Aktifkan **Gmail API**.
3. Atur OAuth consent screen, lalu tambahkan akun pengirim sebagai test user.
4. Buat OAuth client jenis **Web application** dengan redirect URI `https://developers.google.com/oauthplayground`.
5. Buka [OAuth Playground](https://developers.google.com/oauthplayground), klik ikon pengaturan, centang **Use your own OAuth credentials**, lalu isi client ID dan secret.
6. Otorisasi scope `https://www.googleapis.com/auth/gmail.send`, lalu tukarkan kode menjadi token dan salin **refresh token**.
7. Salin `.env.example` menjadi `.env.local` lalu isi nilainya:
   - `CONTACT_TO_EMAIL`: alamat penerima, pisahkan dengan koma.
   - `CONTACT_FORM_SECRET`: buat dengan `openssl rand -hex 32`.
   - `CONTACT_PUBLIC_EMAIL` dan `CONTACT_WHATSAPP_URL`: alternatif kontak saat pengiriman gagal.
   - `CONTACT_RATE_LIMIT_MAX`: opsional, bawaan 5 per 10 menit. Naikkan hanya di lingkungan uji, misalnya untuk uji kirim NF-W-02.

Refresh token dari consent screen berstatus **Testing** kedaluwarsa setelah 7 hari. Cukup untuk uji, tetapi akun resmi di produksi perlu status yang tidak kedaluwarsa.

## Mencoba dengan curl

```bash
npm run dev

TOKEN=$(curl -s http://localhost:3000/api/contact | sed -E 's/.*"formToken":"([^"]+)".*/\1/')
sleep 4
curl -i -X POST http://localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://localhost:3000' \
  -d '{"name":"Budi Contoh","email":"budi@contoh.test","organization":"PT Contoh","message":"Halo VeloCT","privacyConsent":true,"locale":"id","formToken":"'"$TOKEN"'","website":""}'
```
