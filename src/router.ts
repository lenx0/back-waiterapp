import path from 'node:path';

import { Router } from 'express';
import multer from 'multer'

import { listCategories } from './app/useCases/categories/listCategories';
import { createCategory } from './app/useCases/categories/createCategory';
import { listProducts } from './app/useCases/products/listProducts';
import { createProduct } from './app/useCases/products/createProduct';
import { listProductsByCategory } from './app/useCases/categories/listProductsByCategory';
import { listOrders } from './app/useCases/orders/listOrders';
import { createOrder } from './app/useCases/orders/createOrder';
import { changeOrderStatus } from './app/useCases/orders/changeOrderStatus';
import { cancelOrder } from './app/useCases/orders/cancelOrder';
import { registerUser } from './app/useCases/users/register';
import { check } from 'express-validator';
import { loginUser } from './app/useCases/users/login';


export const router = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, path.resolve(__dirname, '..', 'uploads'));
    },
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
    }
  })
});

//List categories
router.get('/categories', listCategories);

//Create category
router.post('/categories', createCategory);

//List products
router.get('/products', listProducts)

//Create product
router.post('/products', upload.single('image'), createProduct) //single para uma única imagem

//Get products by category
router.get('/categories/:categoryId/products', listProductsByCategory)

//List orders
router.get('/orders', listOrders)

//Create order
router.post('/orders', createOrder)

//Change order status
router.patch('/orders/:orderId', changeOrderStatus)

//Delete/cancel order
router.delete('/orders/:orderId', cancelOrder)

router.post('/register', [
  check('name', 'Nome é obrigatório').not().isEmpty(),
  check('email', 'Por favor, inclua um email válido').isEmail(),
  check('password', 'Por favor, inclua uma senha com 6 ou mais caracteres').isLength({ min: 6 }),
], registerUser)

router.post('/login', [
  check('email', 'Por favor, inclua um email válido').isEmail(),
  check('password', 'A senha é obrigatória').exists(),
], loginUser)
