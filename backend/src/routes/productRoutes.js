import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  getProductByCategory,
  countTotalProducts,
  
} from "../controllers/productController.js";
import { verify } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getAllProducts);
router.get("/getById/:id", getProductById);
router.post("/",verify, createProduct);
router.put("/:id",verify, updateProduct);
router.delete("/:id",verify, deleteProduct);
router.get("/search", searchProduct);
router.get("/getByCategory/:category", getProductByCategory);
router.get("/total", countTotalProducts);
export default router;
