# Dokumentasi Tugas Pemrograman Berbasis Web (Pemweb)

- **Nama:** Satya Putra Aryanta
- **NRP:** 5027251012

---

## Daftar Isi
1. [Bagian 1: Tugas Minggu Lalu (Minggu 9 - Express.js REST API Basics)](#bagian-1-tugas-minggu-lalu-minggu-9---expressjs-rest-api-basics)
2. [Bagian 2: Laporan Tugas Minggu Ini (Tugas 2 / Minggu 10 - Express x Database PostgreSQL & Prisma ORM)](#bagian-2-laporan-tugas-minggu-ini-tugas-2--minggu-10---express-x-database-postgresql--prisma-orm)
   - [1. Pendahuluan](#1-pendahuluan)
   - [2. Cara Menjalankan](#2-cara-menjalankan)
   - [3. Daftar Endpoint](#3-daftar-endpoint)
   - [4. Bukti Pengujian API & Database](#4-bukti-pengujian-api--database)
   - [5. Alur Pengerjaan Git](#5-alur-pengerjaan-git)

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

## 1. Pendahuluan

Pada tugas Minggu 9 sebelumnya, data produk masih disimpan di array JavaScript lokal sehingga data langsung ter-reset setiap kali server dimatikan atau di-restart.

Pada Tugas 2 (Minggu 10) ini, aplikasi Express dihubungkan ke database PostgreSQL menggunakan Prisma ORM. Seluruh operasi CRUD (Create, Read, Update, Delete) berjalan langsung ke database PostgreSQL, sehingga data tersimpan secara permanen.

### Skema Database (`prisma/schema.prisma`)

Berikut adalah skema model `Product` yang digunakan:

```prisma
model Product {
  id        Int      @id @default(autoincrement())
  name      String
  price     Int
  createdAt DateTime @default(now())
}
```

- `id`: Primary key integer (auto-increment).
- `name`: Nama produk (String).
- `price`: Harga produk (Integer).
- `createdAt`: Waktu pembuatan data (otomatis terisi tanggal dan jam saat data dibuat).

---

## 2. Cara Menjalankan

1. **Jalankan PostgreSQL:**
   ```bash
   sudo service postgresql start
   ```

2. **Buat Database:**
   ```bash
   sudo -u postgres psql -c "CREATE DATABASE express_pemweb;"
   ```

3. **Setup Environment:**
   Salin file `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```
   Pastikan isi koneksi pada `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/express_pemweb?schema=public"
   ```

4. **Install Dependensi & Jalankan Migrasi:**
   ```bash
   npm install
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Jalankan Server Express:**
   ```bash
   npm run dev
   ```
   Server berjalan di `http://localhost:3000`.

6. **Melihat Database di Browser (Prisma Studio):**
   ```bash
   npx prisma studio
   ```
   Buka `http://localhost:5555` di browser untuk melihat isi tabel secara langsung.

---

## 3. Daftar Endpoint

| Method | Endpoint | Request Body | Status Code | Deskripsi |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/products` | - | `200 OK` | Menampilkan seluruh produk dari database |
| `GET` | `/products/:id` | - | `200 OK` / `404 Not Found` | Menampilkan detail produk berdasarkan ID |
| `POST` | `/products` | `{"name": string, "price": number}` | `201 Created` / `400 Bad Request` | Menambahkan produk baru ke database |
| `PUT` | `/products` | `{"id": number, "name": string, "price": number}` | `200 OK` / `400 Bad Request` / `404 Not Found` | Mengupdate produk (ID dikirim di body sesuai ketentuan tugas) |
| `DELETE` | `/products/:id` | - | `200 OK` / `400 Bad Request` / `404 Not Found` | Menghapus produk dari database berdasarkan ID |
| `GET` | `/hello` | - (Query param: `?nama=...`) | `200 OK` | Endpoint demo greeting |

---

## 4. Bukti Pengujian API & Database

Pengujian dilakukan menggunakan ekstensi REST Client di VS Code melalui file `test.http`, serta diverifikasi menggunakan Prisma Studio.

### 4.1 Menampilkan Seluruh Data Produk (GET /products)
Request: `GET http://localhost:3000/products`  
Hasil respon status `200 OK` dengan list data produk dalam bentuk JSON:

![Bukti GET All](docs/tugas-2/01_get_all.png)

---

### 4.2 Menambahkan Produk Baru (POST /products)
Request:
```http
POST http://localhost:3000/products
Content-Type: application/json

{
  "name": "Buku Tulis Sinar Dunia",
  "price": 6000
}
```

**Tampilan database sebelum data ditambahkan (Before):**  
![Prisma Studio Sebelum POST](docs/tugas-2/02_post_db_before.png)

**Respon API POST /products (201 Created):**  
![Respon POST](docs/tugas-2/03_post_response.png)

**Tampilan database setelah data ditambahkan (After):**  
![Prisma Studio Sesudah POST](docs/tugas-2/04_post_db_after.png)

Data baru berhasil tersimpan ke tabel database dengan ID auto-increment.

---

### 4.3 Mengupdate Produk (PUT /products)
Sesuai instruksi slide 49, request PUT menerima atribut `id` pada request body:
```http
PUT http://localhost:3000/products
Content-Type: application/json

{
  "id": 1,
  "name": "Buku Tulis Sinar Dunia (Edisi Revisi)",
  "price": 7500
}
```

**Tampilan database sebelum data diupdate (Before):**  
![Prisma Studio Sebelum PUT](docs/tugas-2/05_put_db_before.png)

**Respon API PUT /products (200 OK):**  
![Respon PUT](docs/tugas-2/06_put_response.png)

**Tampilan database setelah data diupdate (After):**  
![Prisma Studio Sesudah PUT](docs/tugas-2/07_put_db_after.png)

Data berhasil diperbarui di database tanpa mengubah nilai ID produk.

---

### 4.4 Menghapus Produk (DELETE /products/:id)
Request: `DELETE http://localhost:3000/products/1`

**Tampilan database sebelum data dihapus (Before):**  
![Prisma Studio Sebelum DELETE](docs/tugas-2/08_delete_db_before.png)

**Respon API DELETE /products/:id (200 OK):**  
![Respon DELETE](docs/tugas-2/09_delete_response.png)

**Tampilan database setelah data dihapus (After):**  
![Prisma Studio Sesudah DELETE](docs/tugas-2/10_delete_db_after.png)

Data produk ID 1 berhasil dihapus dan tidak lagi ada di tabel database.

---

### 4.5 Pengujian Validasi Input (Error 400 Bad Request)

- **Field Kosong (tanpa field price):**  
  ![Validasi Field Kosong](docs/tugas-2/11_err_missing_field.png)

- **Tipe Data Harga Bukan Angka (`price: "gratis"`):**  
  ![Validasi Harga Bukan Angka](docs/tugas-2/12_err_invalid_price.png)

- **PUT Tanpa Menyertakan ID pada Body:**  
  ![Validasi PUT Tanpa ID](docs/tugas-2/13_err_missing_id.png)

---

### 4.6 Pengujian Data Tidak Ditemukan (Error 404 Not Found)

- **GET dengan ID tidak ada (`GET /products/9999`):**  
  ![404 GET](docs/tugas-2/14_404_get.png)

- **PUT dengan ID tidak ada (`id: 9999`):**  
  ![404 PUT](docs/tugas-2/15_404_put.png)

- **DELETE dengan ID tidak ada (`DELETE /products/9999`):**  
  ![404 DELETE](docs/tugas-2/16_404_delete.png)

---

## 5. Alur Pengerjaan Git

Pengerjaan tugas ini dilakukan secara bertahap menggunakan branch dan pull request:

1. **Tahap 1: Setup Prisma & Migrasi Database**
   - Branch: `tugas-2/setup-prisma`
   - Install dependensi Prisma dan driver PostgreSQL.
   - Definisi skema model `Product` dan migrasi database awal.
   - Pull Request #1 di-merge ke `main`.

2. **Tahap 2: Implementasi Controller & Route CRUD**
   - Branch: `tugas-2/crud-products`
   - Implementasi Prisma Client singleton dan fungsi CRUD pada `product.controller.ts`.
   - Setup route GET, POST, PUT (ID di body), dan DELETE.
   - Pull Request #2 di-merge ke `main`.

3. **Tahap 3: Testing & Dokumentasi**
   - Branch: `tugas-2/testing-docs`
   - Pembuatan 11 skenario pengujian pada `test.http`.
   - Dokumentasi pengujian dan bukti screenshot pada `README.md`.
