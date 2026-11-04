# Dokumentasi Tugas Pemrograman Berbasis Web (Pemweb)

- **Nama:** Satya Putra Aryanta
- **NRP:** 5027251012
- **Departemen:** Teknologi Informasi - Fakultas Teknologi Elektro dan Informatika Cerdas (FTEIC), Institut Teknologi Sepuluh Nopember
- **Mata Kuliah:** Pemrograman Berbasis Web

---

## Daftar Isi
1. [Bagian 1: Tugas Minggu Lalu (Minggu 9 - Express.js REST API Basics)](#bagian-1-tugas-minggu-lalu-minggu-9---expressjs-rest-api-basics)
2. [Bagian 2: Laporan Tugas Minggu Ini (Tugas 2 / Minggu 10 - Express x Database PostgreSQL & Prisma ORM)](#bagian-2-laporan-tugas-minggu-ini-tugas-2--minggu-10---express-x-database-postgresql--prisma-orm)
   - [1. Pendahuluan dan Arsitektur Sistem](#1-pendahuluan-dan-arsitektur-sistem)
   - [2. Petunjuk Menjalankan Aplikasi](#2-petunjuk-menjalankan-aplikasi)
   - [3. Daftar Endpoint Lengkap](#3-daftar-endpoint-lengkap)
   - [4. Bukti Pengujian API dan Perubahan Database (Evidence)](#4-bukti-pengujian-api-dan-perubahan-database-evidence)
   - [5. Implementasi Workflow Git Bertahap](#5-implementasi-workflow-git-bertahap)
   - [6. Kesimpulan](#6-kesimpulan)

---

# Bagian 1: Tugas Minggu Lalu (Minggu 9 - Express.js REST API Basics)

# Petunjuk Menjalankan dan Daftar Endpoint

jalankan

```bash
npm install
npm run dev
```

di dalam folder `/express_demo-pemweb`

masuk ke `http://localhost:3000/products` di browser

Untuk melakukan testing, kalau menggunakan vscode, install extension rest client.

![alt text](/docs/rest-client.png)

lalu buka `test.http`

![alt text](/docs/test-http.png)

extension rest client mempermudah kita untuk melakukan request ke website kita apabila melakukan development di vs code. Karena tidak perlu keluar dari vs code.

klik tombol send request dari ### 1 sampai ### 4. 

### output send request ### 1

![alt text](/docs/request-1.png)

### output send request ### 2

![alt text](/docs/request-2.png)

### output send request ### 3

![alt text](/docs/request-3.png)

### output send request ### 4

![alt text](/docs/request-4.png)

## Daftar Endpoint

| Method | Endpoint | Request Body | Status Code | Deskripsi |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/products` | - | `200 OK` | Mengambil seluruh daftar produk |
| `GET` | `/products/:id` | - | `200 OK` / `404 Not Found` | Mengambil data produk berdasarkan ID |
| `POST` | `/products` | `{"name": "...", "price": ...}` | `201 Created` / `400 Bad Request` | Menambahkan produk baru |
| `GET` | `/hello` | - (Query param: `?nama=...`) | `200 OK` | Endpoint demo greeting |

---

# Bagian 2: Laporan Tugas Minggu Ini (Tugas 2 / Minggu 10 - Express x Database PostgreSQL & Prisma ORM)

## 1. Pendahuluan dan Arsitektur Sistem

Pada tugas sebelumnya (Minggu ke-9), penyimpanan data produk pada aplikasi Express masih menggunakan array lokal di memori proses Node.js (*in-memory array*). Kelemahan mendasar dari pendekatan tersebut adalah data produk bersifat volatil/sementara dan akan hilang ter-reset setiap kali server dimulai ulang (*restart*).

Pada Tugas ke-2 (Minggu ke-10) ini, aplikasi Express telah diintegrasikan dengan database relasional **PostgreSQL** menggunakan **Prisma ORM 7**. Seluruh operasi *Create*, *Read*, *Update*, dan *Delete* (CRUD) dilakukan secara persisten ke database menggunakan *Prisma Client singleton* yang dikonfigurasi dengan driver adapter PostgreSQL (`@prisma/adapter-pg` dan driver `pg`).

### 1.1 Skema Model Database (`prisma/schema.prisma`)

Struktur tabel `Product` didefinisikan pada file skema Prisma sebagai berikut:

```prisma
model Product {
  id        Int      @id @default(autoincrement())
  name      String
  price     Int
  createdAt DateTime @default(now())
}
```

**Keterangan Atribut:**
- `id`: Kunci utama (*primary key*) bertipe Integer dengan mekanisme auto-increment yang digenerate langsung oleh database PostgreSQL.
- `name`: Tipe data String yang menyimpan nama produk.
- `price`: Tipe data Integer yang menyimpan nilai harga produk.
- `createdAt`: Tipe data DateTime yang secara otomatis mencatat *timestamp* waktu penambahan data ke database.

---

## 2. Petunjuk Menjalankan Aplikasi

### 2.1 Prasyarat
1. Pastikan PostgreSQL sudah terpasang dan berjalan (misal: di WSL):
   ```bash
   sudo service postgresql start
   ```
2. Buat database PostgreSQL bernama `express_pemweb`:
   ```bash
   sudo -u postgres psql -c "CREATE DATABASE express_pemweb;"
   ```
3. Salin file environment dan sesuaikan konfigurasi koneksi:
   ```bash
   cp .env.example .env
   ```
   Isi file `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/express_pemweb?schema=public"
   ```

### 2.2 Migrasi Database dan Generate Prisma Client
Jalankan perintah berikut di root folder project:
```bash
npm install
npx prisma migrate dev --name init
npx prisma generate
```

### 2.3 Menjalankan Server Development
```bash
npm run dev
```
Server Express akan aktif dan mendengarkan request pada port `3000` (`http://localhost:3000`).

### 2.4 Memantau Database Secara Visual (Prisma Studio)
Untuk melihat dan memvalidasi isi tabel PostgreSQL secara visual melalui antarmuka web GUI:
```bash
npx prisma studio
```
Akses Prisma Studio di browser pada URL `http://localhost:5555`.

---

## 3. Daftar Endpoint Lengkap

Aplikasi menyediakan antarmuka REST API lengkap untuk mengelola produk secara persisten:

| Method | Endpoint | Request Body | Status Code | Deskripsi |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/products` | - | `200 OK` | Mengambil seluruh baris data produk dari tabel database PostgreSQL |
| `GET` | `/products/:id` | - | `200 OK` / `404 Not Found` | Mengambil data produk spesifik berdasarkan parameter ID |
| `POST` | `/products` | `{"name": string, "price": number}` | `201 Created` / `400 Bad Request` | Menambahkan baris produk baru ke dalam database |
| `PUT` | `/products` | `{"id": number, "name": string, "price": number}` | `200 OK` / `400 Bad Request` / `404 Not Found` | Memperbarui data produk yang sudah ada (ID dikirim via request body sesuai ketentuan tugas) |
| `DELETE` | `/products/:id` | - | `200 OK` / `400 Bad Request` / `404 Not Found` | Menghapus baris produk dari database berdasarkan parameter ID |
| `GET` | `/hello` | - (Query param: `?nama=...`) | `200 OK` | Endpoint demo greeting |

---

## 4. Bukti Pengujian API dan Perubahan Database (Evidence)

Seluruh pengujian dilakukan menggunakan file `test.http` dan ekstensi REST Client di VS Code, serta diverifikasi secara visual melalui antarmuka **Prisma Studio**.

### 4.1 Skenario 1: Menampilkan Seluruh Data Produk (GET /products)
- **Request:** `GET http://localhost:3000/products`
- **Ekspektasi:** HTTP `200 OK` dengan payload JSON berisi seluruh daftar produk.

![Gambar 2.1: Bukti Respon API GET /products](docs/tugas-2/01_get_all.png)

*Analisis:* Endpoint berhasil mengambil seluruh data produk yang tersimpan pada tabel database PostgreSQL dengan status code `200 OK`.

---

### 4.2 Skenario 2: Membuat Data Produk Baru (POST /products)
- **Request:**
  ```http
  POST http://localhost:3000/products
  Content-Type: application/json

  {
    "name": "Buku Tulis Sinar Dunia",
    "price": 6000
  }
  ```
- **Ekspektasi:** HTTP `201 Created` dengan objek produk baru yang memiliki ID auto-increment dari database.

#### Bukti Perubahan Database (Before vs After)

**Tampilan Database Sebelum Penambahan Data (Before):**  
![Gambar 2.2: Prisma Studio Sebelum POST](docs/tugas-2/02_post_db_before.png)

**Bukti Respon API POST /products (201 Created):**  
![Gambar 2.3: Bukti Respon POST](docs/tugas-2/03_post_response.png)

**Tampilan Database Sesudah Penambahan Data (After):**  
![Gambar 2.4: Prisma Studio Sesudah POST](docs/tugas-2/04_post_db_after.png)

*Analisis:* Data baru berhasil masuk ke database PostgreSQL dengan status code `201 Created`. Tampilan Prisma Studio membuktikan bahwa record baru bertambah secara persisten di database.

---

### 4.3 Skenario 3: Memperbarui Data Produk yang Sudah Ada (PUT /products)
Sesuai slide modul ke-49, request body pada operasi PUT memiliki format yang sama dengan POST dengan tambahan atribut `id`.

- **Request:**
  ```http
  PUT http://localhost:3000/products
  Content-Type: application/json

  {
    "id": 1,
    "name": "Buku Tulis Sinar Dunia (Edisi Revisi)",
    "price": 7500
  }
  ```
- **Ekspektasi:** HTTP `200 OK` dengan data produk yang telah terupdate.

#### Bukti Perubahan Database (Before vs After)

**Tampilan Database Sebelum Pembaruan Data (Before):**  
![Gambar 2.5: Prisma Studio Sebelum PUT](docs/tugas-2/05_put_db_before.png)

**Bukti Respon API PUT /products (200 OK):**  
![Gambar 2.6: Bukti Respon PUT](docs/tugas-2/06_put_response.png)

**Tampilan Database Sesudah Pembaruan Data (After):**  
![Gambar 2.7: Prisma Studio Sesudah PUT](docs/tugas-2/07_put_db_after.png)

*Analisis:* Data produk dengan ID yang ditentukan berhasil diperbarui pada database PostgreSQL dengan status `200 OK` tanpa mengubah ID produk tersebut.

---

### 4.4 Skenario 4: Menghapus Data Produk (DELETE /products/:id)
- **Request:** `DELETE http://localhost:3000/products/1`
- **Ekspektasi:** HTTP `200 OK` dengan pesan konfirmasi penghapusan data.

#### Bukti Perubahan Database (Before vs After)

**Tampilan Database Sebelum Penghapusan Data (Before):**  
![Gambar 2.8: Prisma Studio Sebelum DELETE](docs/tugas-2/08_delete_db_before.png)

**Bukti Respon API DELETE /products/:id (200 OK):**  
![Gambar 2.9: Bukti Respon DELETE](docs/tugas-2/09_delete_response.png)

**Tampilan Database Sesudah Penghapusan Data (After):**  
![Gambar 2.10: Prisma Studio Sesudah DELETE](docs/tugas-2/10_delete_db_after.png)

*Analisis:* Baris data produk dengan ID yang dituju berhasil terhapus dari tabel PostgreSQL. Prisma Studio mengonfirmasi bahwa baris data tersebut telah hilang dari database.

---

### 4.5 Skenario 5: Kesalahan Validasi Input (Validation Error - HTTP 400)

Pengujian skenario kegagalan validasi dilakukan untuk menguji kehandalan server dalam menangani request yang tidak sesuai format kontrak API.

#### 4.5.1 Kasus Field Name atau Price Kosong
Request `POST /products` hanya mengirimkan atribut `name` tanpa atribut `price`:  
![Gambar 2.11: Validasi Field Kosong](docs/tugas-2/11_err_missing_field.png)

#### 4.5.2 Kasus Tipe Data Price Tidak Valid (Bukan Angka)
Request `POST /products` mengirimkan nilai `price` berupa string non-numerik (`"gratis"`):  
![Gambar 2.12: Validasi Harga Bukan Angka](docs/tugas-2/12_err_invalid_price.png)

#### 4.5.3 Kasus Request PUT Tanpa Menyertakan ID
Request `PUT /products` dikirimkan tanpa menyertakan field `id` pada body:  
![Gambar 2.13: Validasi PUT Tanpa ID](docs/tugas-2/13_err_missing_id.png)

*Analisis:* Server berhasil mendeteksi input yang tidak valid dan merespon dengan status `400 Bad Request` serta payload JSON deskriptif tanpa menyebabkan aplikasi mengalami *crash*.

---

### 4.6 Skenario 6: Data Tidak Ditemukan (Not Found - HTTP 404)

Pengujian dilakukan untuk memastikan request dengan ID yang tidak terdaftar di database ditangani secara elegan.

#### 4.6.1 Kasus GET dengan ID Tidak Ada (`GET /products/9999`)
![Gambar 2.14: 404 GET](docs/tugas-2/14_404_get.png)

#### 4.6.2 Kasus PUT dengan ID Tidak Ada (`PUT /products` id: 9999)
![Gambar 2.15: 404 PUT](docs/tugas-2/15_404_put.png)

#### 4.6.3 Kasus DELETE dengan ID Tidak Ada (`DELETE /products/9999`)
![Gambar 2.16: 404 DELETE](docs/tugas-2/16_404_delete.png)

*Analisis:* Ketika query `prisma.product.findUnique` menghasilkan `null`, server merespon dengan status code `404 Not Found` dan pesan JSON `{"message": "Produk tidak ditemukan"}`.

---

## 5. Implementasi Workflow Git Bertahap

Sebagai bukti proses pengerjaan bertahap sesuai prinsip *software engineering* dan standar *Conventional Commits*, alur kerja di GitHub dibagi menjadi branch bertahap dan digabungkan melalui Pull Request:

1. **Tahap 1: Setup Prisma & Database Migration**
   - **Branch:** `tugas-2/setup-prisma`
   - **Commits:**
     - `build(tugas-2): install prisma 7 and postgresql driver dependencies`
     - `feat(tugas-2): define product schema and create initial database migration`
   - **Pull Request #1:** `main <- tugas-2/setup-prisma` (Merged)

2. **Tahap 2: Implementasi CRUD Produk dengan Prisma ORM**
   - **Branch:** `tugas-2/crud-products`
   - **Commits:**
     - `feat(tugas-2): implement product CRUD controller and routes with prisma`
   - **Pull Request #2:** `main <- tugas-2/crud-products` (Merged)

3. **Tahap 3: Skenario Pengujian REST Client & Dokumentasi Lengkap**
   - **Branch:** `tugas-2/testing-docs`
   - **Commits:**
     - `test(tugas-2): add REST client scenarios for CRUD and validation errors`
     - `docs(tugas-2): update instructions for database setup and full endpoint list`
     - `style(tugas-2): simplify test.http comment delimiters for REST Client`
     - `docs(tugas-2): add comprehensive markdown report with evidence screenshots in readme`
   - **Pull Request:** `main <- tugas-2/testing-docs`

---

## 6. Kesimpulan

Integrasi Express.js dengan PostgreSQL menggunakan Prisma ORM 7 telah berhasil diimplementasikan secara menyeluruh. Seluruh fitur yang disyaratkan pada Tugas 2 (GET all, GET by ID, POST data baru, PUT update data dengan ID pada body, dan DELETE data berdasarkan ID) berfungsi secara normal dan persisten. Validasi input (`400 Bad Request`) dan penanganan *resource not found* (`404 Not Found`) telah teruji dan terdokumentasi lengkap dengan bukti screenshot *Before* dan *After* pada Prisma Studio.
