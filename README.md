# Petunjuk Menjalankan dan Daftar Endpoint

## Prasyarat
1. Pastikan PostgreSQL sudah aktif dan database telah dibuat.
2. Salin `.env.example` menjadi `.env` lalu sesuaikan `DATABASE_URL`:
   ```bash
   cp .env.example .env
   ```
3. Pasang dependensi dan lakukan migrasi schema database:
   ```bash
   npm install
   npx prisma migrate dev
   npx prisma generate
   ```

## Menjalankan Server
Jalankan di dalam folder `/express_demo-pemweb`:
```bash
npm run dev
```
Akses `http://localhost:3000/products` di browser atau REST Client.

## Melihat Database Secara Visual (Prisma Studio)
Untuk melihat dan mengelola isi tabel database secara visual di browser (port 5555):
```bash
npx prisma studio
```

## Pengujian API (REST Client)
Untuk melakukan testing, jika menggunakan VS Code, pasang ekstensi **REST Client**.

![alt text](/docs/rest-client.png)

Lalu buka file `test.http`:

![alt text](/docs/test-http.png)

Ekstensi REST Client mempermudah pengujian request tanpa perlu keluar dari VS Code. Klik tombol **Send Request** pada skenario yang tersedia di `test.http`.

### Contoh Output Pengujian Minggu 9
- **Output Send Request 1 (GET All):**  
  ![alt text](/docs/request-1.png)

- **Output Send Request 2 (GET By ID):**  
  ![alt text](/docs/request-2.png)

- **Output Send Request 3 (GET 404):**  
  ![alt text](/docs/request-3.png)

- **Output Send Request 4 (POST Create):**  
  ![alt text](/docs/request-4.png)

---

## Daftar Endpoint Lengkap (CRUD PostgreSQL & Prisma)

| Method | Endpoint | Request Body | Status Code | Deskripsi |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/products` | - | `200 OK` | Mengambil seluruh daftar produk dari database |
| `GET` | `/products/:id` | - | `200 OK` / `404 Not Found` | Mengambil data produk berdasarkan ID |
| `POST` | `/products` | `{"name": string, "price": number}` | `201 Created` / `400 Bad Request` | Menambahkan produk baru ke database |
| `PUT` | `/products` | `{"id": number, "name": string, "price": number}` | `200 OK` / `400 Bad Request` / `404 Not Found` | Mengupdate data produk yang ada |
| `DELETE` | `/products/:id` | - | `200 OK` / `400 Bad Request` / `404 Not Found` | Menghapus data produk dari database berdasarkan ID |
| `GET` | `/hello` | - (Query param: `?nama=...`) | `200 OK` | Endpoint demo greeting |
