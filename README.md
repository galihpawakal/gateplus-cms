# Gateplus CMS

Content Management System untuk mengelola dan menampilkan konten Gateplus.id. Aplikasi menyediakan halaman publik untuk menjelajahi konten yang sudah dipublikasikan, halaman admin untuk mengelola konten, serta REST API untuk operasi konten.

## Fitur

- Daftar konten publik dengan pencarian, filter genre, dan pagination.
- Halaman detail konten.
- Admin untuk membuat, mengubah, dan menghapus konten serta melihat status draft dan published.
- REST API dengan validasi Zod dan format respons yang konsisten.
- PostgreSQL dengan Prisma ORM dan data awal berisi 10 konten contoh.

## Teknologi

- Next.js 14 App Router, React 18, dan TypeScript
- PostgreSQL 16 dan Prisma 5
- Zod untuk validasi input
- Tailwind CSS

## Technical Decisions

Docker dipakai hanya untuk reproduksi database lokal. Production memakai Supabase karena terkelola dan tidak perlu mengurus server database.

## Persyaratan

- Node.js 18 atau lebih baru dan npm
- PostgreSQL apa pun, atau Docker Desktop dengan Docker Compose untuk database lokal opsional
- Port PostgreSQL yang dipilih dan port `3000` tersedia

## Menjalankan secara lokal

1. Masuk ke direktori project dan buat file environment lokal:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Atur `.env` sesuai PostgreSQL yang digunakan. Jangan commit file `.env` atau menyimpan kredensial production di repository.

3. Instal dependency:

   ```bash
   npm install
   ```

4. Pilih salah satu cara menyediakan PostgreSQL lokal.

  Opsi Docker lokal saja. `npm run setup` menyalakan container, menunggu database sehat, menjalankan migrasi, lalu mengisi data contoh:

   ```bash
   npm run setup
   ```

  Tanpa Docker, gunakan PostgreSQL apa pun. Isi `DATABASE_URL` dan `DIRECT_URL` dengan URL database yang sama untuk koneksi lokal, lalu jalankan:

  ```bash
  npm run db:migrate
  npm run db:seed
  ```

5. Jalankan aplikasi:

   ```bash
   npm run dev
   ```

Buka [http://localhost:3000](http://localhost:3000). URL root akan mengarahkan ke `/contents`; halaman admin tersedia di `/admin`.

### Environment variables

| Variabel | Keterangan | Nilai contoh lokal |
| --- | --- | --- |
| `POSTGRES_USER` | User container Compose, local dev only | `gateplus` |
| `POSTGRES_PASSWORD` | Password container Compose, local dev only | Ganti dengan password lokal |
| `POSTGRES_DB` | Database container Compose, local dev only | `gateplus_cms` |
| `DB_PORT` | Port host Compose, local dev only | `5432` |
| `DATABASE_URL` | URL koneksi aplikasi Prisma | `postgresql://gateplus:password@localhost:5432/gateplus_cms?schema=public` |
| `DIRECT_URL` | URL koneksi langsung untuk migrasi Prisma | Sama dengan `DATABASE_URL` secara lokal |
| `NEXT_PUBLIC_APP_URL` | URL aplikasi | `http://localhost:3000` |

Untuk Docker lokal, port pada URL harus sama dengan `DB_PORT`. Compose menyimpan data dalam named volume `pgdata`. Untuk Supabase, `DATABASE_URL` dapat memakai connection pooler dan `DIRECT_URL` memakai koneksi langsung. Nilai production hanya disimpan di GitHub Secrets dan Vercel Environment Variables, bukan di file repository.

## Perintah yang tersedia

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan Next.js dalam mode development |
| `npm run build` | Membuat build production |
| `npm run start` | Menjalankan build production |
| `npm run lint` | Menjalankan lint Next.js |
| `npm run db:up` | Local dev only: menyalakan PostgreSQL Docker Compose |
| `npm run db:down` | Local dev only: menghentikan PostgreSQL Docker Compose |
| `npm run db:logs` | Local dev only: melihat log PostgreSQL Docker Compose |
| `npm run setup` | Local dev only: menyalakan Compose, menunggu sehat, migrasi, dan seed |
| `npm run db:migrate` | Membuat/menjalankan migrasi Prisma development pada URL database aktif |
| `npm run db:migrate:deploy` | Menerapkan migrasi Prisma yang sudah ada ke database target |
| `npm run db:seed` | Mengisi database aktif dengan data contoh melalui Prisma |
| `npm run db:reset` | Menghapus dan membuat ulang database, menjalankan migrasi, lalu seed |

`npm run db:reset` bersifat destruktif dan menghapus data yang ada. Gunakan hanya pada database lokal yang memang boleh di-reset.

## Struktur utama

```text
app/
  admin/                 Halaman pengelolaan konten
  api/contents/           REST API konten
  contents/               Halaman daftar dan detail publik
components/               Komponen UI dan komponen konten
lib/                      Prisma client, validasi, API, dan tipe
prisma/                   Schema, migrasi, dan seed
```

## Komponen UI

Komponen bersama berada di `components/ui/`. Halaman dan fitur harus memakai komponen ini daripada menyalin markup atau class styling yang sama.

| Komponen | Fungsi |
| --- | --- |
| `FormField`, `Input`, `Select` | Label, hint/error, dan kontrol form dengan ukuran/focus yang konsisten |
| `SearchInput`, `FilterToolbar` | Pencarian debounce 300 ms, sinkron query URL, filter genre/status, dan reset |
| `Button`, `ButtonLink`, `IconButton`, `IconLink` | Tombol, navigasi button-style, dan kontrol ikon dengan label aksesibel |
| `PageHeader`, `Pagination` | Header halaman dan navigasi halaman yang dipakai list public/admin |
| `StatusBadge`, `Thumbnail` | Status terpusat dan gambar 16:9 dengan fallback |
| `Skeleton`, `EmptyState`, `ErrorState` | Loading, data kosong, dan kegagalan pemuatan |
| `ConfirmDialog`, `Toast` | Konfirmasi aksi dengan Escape/focus trap dan feedback |
| `Card`, `Badge` | Kontainer dan label konten generik |

Jangan menduplikasi komponen, markup, atau class Tailwind untuk elemen UI yang sudah tersedia. Tambahkan variasi typed props ke komponen shared bila dibutuhkan beberapa halaman. Gunakan `lib/constants.ts` untuk status dan `lib/utils.ts` untuk formatter tanggal/truncate.

## Deployment & CI/CD

Production memakai Vercel untuk aplikasi dan Supabase untuk PostgreSQL. Deployment Vercel tidak memakai Docker, Dockerfile, atau container. File `docker-compose.yml` hanya opsi database local development dan tidak digunakan oleh workflow.

Workflow CI di `.github/workflows/ci.yml` menjalankan `npm ci`, lint, dan build tanpa Docker Compose maupun database service. Workflow `.github/workflows/migrate.yml` dijalankan manual dari GitHub Actions; siapkan GitHub Environment `production` dengan secrets `SUPABASE_DATABASE_URL` dan `SUPABASE_DIRECT_URL`. Workflow menjalankan `prisma migrate deploy` lewat `npm run db:migrate:deploy`.

Atur `DATABASE_URL` dan `DIRECT_URL` production di Vercel Environment Variables. Gunakan URL pooler Supabase untuk `DATABASE_URL` dan URL koneksi langsung untuk `DIRECT_URL`. Jangan buat atau commit file env production.

## REST API

Semua endpoint menggunakan prefix `/api/contents`.

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| `GET` | `/api/contents` | Daftar konten dengan pencarian, filter, dan pagination |
| `POST` | `/api/contents` | Membuat konten; respons sukses `201` |
| `GET` | `/api/contents/:id` | Mengambil detail berdasarkan ID |
| `PUT` | `/api/contents/:id` | Memperbarui konten berdasarkan ID |
| `DELETE` | `/api/contents/:id` | Menghapus konten; respons sukses `204` tanpa body |

Parameter query untuk daftar:

| Parameter | Keterangan |
| --- | --- |
| `search` | Mencari teks pada judul atau deskripsi |
| `genre` | Filter genre, pencocokan tidak membedakan kapitalisasi |
| `status` | Filter `draft` atau `published`; tanpa parameter, semua status disertakan |
| `page` | Nomor halaman, mulai dari `1` |
| `limit` | Jumlah item per halaman, default `10`, maksimum `100` |

Contoh:

```text
GET /api/contents?search=bisnis&genre=Bisnis&status=published&page=1&limit=10
```

Contoh respons sukses untuk daftar atau detail:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

Contoh respons error validasi (`422`):

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validasi gagal",
    "details": {
      "title": ["Judul wajib diisi"]
    }
  }
}
```

Field konten: `title`, `description`, `genre`, `status`, `thumbnailUrl`, dan `publishedAt`. Status hanya menerima `draft` atau `published`; konten berstatus `published` wajib memiliki `publishedAt`. Tanggal dikirim sebagai string datetime ISO 8601, sedangkan `thumbnailUrl` harus berupa URL valid atau string kosong.

## Catatan keamanan

> **Penting:** autentikasi dan otorisasi admin belum diterapkan. Halaman `/admin` dan operasi tulis API saat ini tidak dilindungi; jangan publikasikan aplikasi ini ke internet atau gunakan untuk data produksi sebelum menambahkan kontrol akses dan mengamankan database.

## Verifikasi

Jalankan pemeriksaan project dengan:

```bash
npm run lint
npm run build
```

Verifikasi API secara manual mencakup respons sukses, validasi input, resource tidak ditemukan, dan koneksi database. Belum tersedia skrip test otomatis di `package.json`.

## Known Limitations

Reviewer tidak wajib memasang Docker untuk menjalankan aplikasi. Siapkan PostgreSQL apa pun yang dapat diakses, isi `DATABASE_URL` dan `DIRECT_URL`, lalu jalankan migrasi dan seed Prisma. Docker hanya diperlukan bila memilih opsi database lokal Compose.