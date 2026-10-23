# Panduan Kontribusi

Panduan ini berlaku untuk semua anggota tim. Repositori ini tidak memakai proteksi branch, jadi aturan di bawah adalah **kesepakatan tim** yang kita jaga bersama.

## Kesepakatan utama

1. **Jangan push langsung ke `main`.** Semua perubahan lewat pull request.
2. **Hanya Team Lead yang melakukan merge ke `main`.** Merge ke `main` otomatis di-deploy ke produksi.
3. **Satu tugas, satu branch, satu pull request.** Tugas besar dipecah dulu menjadi issue yang lebih kecil.
4. **Jangan commit rahasia.** Kunci, token, dan kata sandi hanya disimpan di `.env.local`, tidak pernah di repositori.
5. **Jangan commit data pribadi asli.** Data contoh memakai nama fiktif.

## Alur kerja (GitHub Flow)

1. Lihat tugasmu di tab sprint pada Papan Tim. Untuk tugas pengembangan, buat atau ambil issue-nya di GitHub dan tetapkan dirimu di sana.
2. Perbarui `main` di laptopmu, lalu buat branch baru:
   ```bash
   git switch main
   git pull
   git switch -c feat/123-form-cuti
   ```
3. Kerjakan tugas dengan commit kecil-kecil.
4. Push branch-mu, lalu buka pull request ke `main` memakai template yang tersedia.
5. Tunggu review. Perbaiki bila ada masukan, lalu push lagi ke branch yang sama.
6. Setelah disetujui dan CI lulus, Team Lead melakukan merge (squash).

### Penamaan branch

`<jenis>/<nomor-issue>-<deskripsi-singkat>`, contoh:

- `feat/12-halaman-beranda`
- `fix/31-validasi-email-kontak`
- `docs/8-panduan-setup`

## Pesan commit (Conventional Commits)

Format: `<jenis>: <ringkasan dalam bahasa Indonesia>`

| Jenis | Dipakai untuk |
|---|---|
| `feat` | Fitur baru |
| `fix` | Perbaikan bug |
| `docs` | Dokumentasi |
| `test` | Menambah atau memperbaiki test |
| `refactor` | Perubahan kode tanpa mengubah perilaku |
| `style` | Format kode, tanpa perubahan logika |
| `chore` | Pekerjaan pendukung, misalnya konfigurasi atau dependensi |

Contoh: `feat: tambah formulir pengajuan cuti`

## Definisi selesai

Sebuah tugas dianggap selesai bila:

- [ ] Pull request sudah direview dan disetujui Team Lead
- [ ] CI lulus (lint, typecheck, test)
- [ ] Sudah dicoba berjalan di laptop pembuat dan reviewer
- [ ] Logbook hari itu sudah terisi

## Konvensi kode

- Nama variabel, fungsi, dan file dalam bahasa Inggris.
- Teks yang tampil ke pengguna dalam bahasa Indonesia (dan Inggris untuk versi `/en`).
- Format kode mengikuti Prettier dan ESLint proyek.

## Butuh bantuan?

Buntu lebih dari satu jam? Langsung tanya di grup chat tim. Lebih baik bertanya cepat daripada buntu seharian.
