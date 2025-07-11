import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  getProductByCategory
} from "../controllers/productController.js";
const router = express.Router();

router.get("/", getAllProducts);
router.get("/getById/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/search", searchProduct);
router.get("/getByCategory/:category", getProductByCategory);

export default router;
