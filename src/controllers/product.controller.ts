import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

// 1. GET /products: Menampilkan seluruh data produk
export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error getProducts:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}

// GET /products/:id: Menampilkan produk berdasarkan ID
export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const targetId = Number(req.params.id);
    if (isNaN(targetId)) {
      res.status(400).json({ message: 'ID harus berupa angka.' });
      return;
    }

    const found = await prisma.product.findUnique({
      where: { id: targetId },
    });

    if (!found) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }

    res.status(200).json(found);
  } catch (error) {
    console.error('Error getProductById:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}

// 2. POST /products: Membuat data produk baru
export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const { name, price } = req.body;

    // Validasi kelengkapan data
    if (!name || price === undefined) {
      res.status(400).json({ message: 'Properti name dan price wajib diisi.' });
      return;
    }

    // Validasi tipe data price
    if (isNaN(Number(price))) {
      res.status(400).json({ message: 'Price harus berupa angka.' });
      return;
    }

    const newProduct = await prisma.product.create({
      data: {
        name: String(name).trim(),
        price: Number(price),
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error createProduct:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}

// 3. PUT /products: Mengupdate data yang sudah ada (body sama dengan post namun ada tambahan id)
export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    // Mendukung ID baik dari req.body.id (sesuai instruksi slide) maupun dari req.params.id
    const id = req.body.id !== undefined ? Number(req.body.id) : Number(req.params.id);
    const { name, price } = req.body;

    // Validasi ID
    if (!id || isNaN(id)) {
      res.status(400).json({ message: 'ID produk wajib disertakan dan harus berupa angka.' });
      return;
    }

    // Validasi name dan price
    if (!name || price === undefined) {
      res.status(400).json({ message: 'Properti name dan price wajib diisi.' });
      return;
    }

    if (isNaN(Number(price))) {
      res.status(400).json({ message: 'Price harus berupa angka.' });
      return;
    }

    // Cek keberadaan produk di database
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: String(name).trim(),
        price: Number(price),
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updateProduct:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}

// 4. DELETE /products/:id: Menghapus data produk berdasarkan ID
export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id ? Number(req.params.id) : Number(req.body.id);

    if (!id || isNaN(id)) {
      res.status(400).json({ message: 'ID produk tidak valid atau tidak disertakan.' });
      return;
    }

    // Cek keberadaan produk di database
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }

    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({ message: `Produk dengan ID ${id} berhasil dihapus.` });
  } catch (error) {
    console.error('Error deleteProduct:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}
