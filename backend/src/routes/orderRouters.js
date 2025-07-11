import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import { verify } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',verify, createOrder);

export default router;
