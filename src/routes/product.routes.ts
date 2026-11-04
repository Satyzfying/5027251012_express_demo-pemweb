import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

const router = Router();

// GET
router.get('/', getProducts);
router.get('/:id', getProductById);

// POST
router.post('/', createProduct);

// PUT (Mendukung ID di body sesuai slide, serta di URL param)
router.put('/', updateProduct);
router.put('/:id', updateProduct);

// DELETE (Mendukung ID di URL param maupun body)
router.delete('/:id', deleteProduct);
router.delete('/', deleteProduct);

export default router;
