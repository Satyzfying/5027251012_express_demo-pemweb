import type { Request, Response } from 'express';

const products = [
  { id: 1, name: 'Buku', price: 15000 },
  { id: 2, name: 'Pulpen', price: 5000 },
];

let nextId = 3;

export function getProducts(req: Request, res: Response): void {
  res.status(200).json(products);
}

export function getProductById(req: Request, res: Response): void {
  const targetId = Number(req.params.id);
  const found = products.find((item) => item.id === targetId);

  if (!found) {
    res.status(404).json({
      message: 'Produk tidak ditemukan',
    });
    return;
  }

  res.status(200).json(found);
}

export function createProduct(req: Request, res: Response): void {
  const { name, price } = req.body;

  if (!name || price === undefined) {
    res.status(400).json({
      message: 'Properti name dan price wajib diisi.',
    });
    return;
  }

  const newProduct = {
    id: nextId++,
    name: String(name).trim(),
    price: Number(price),
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
}