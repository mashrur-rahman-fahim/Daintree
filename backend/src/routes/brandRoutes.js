import express from "express";
const router = express.Router();
import { getBrandsByCategory } from "../controllers/productController.js";
router.get("/:category", getBrandsByCategory);
export default router;
