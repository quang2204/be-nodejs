import express from "express";
import {
  AddProduct,
  DeleteProduct,
  GetAllProduct,
  GetProductDetails,
  GetProductsCategory,
  Pagination,
  UpdateProduct,
} from "../controller/product";
import { checkout } from "../xacthuc/checkout";
const router = express.Router();
router.get("/products", GetAllProduct);
router.get("/products/:page", Pagination);
router.get("/product/:id", GetProductDetails);
router.get("/products/category/:category", GetProductsCategory);
router.post("/products", AddProduct);
router.patch("/products/:id", UpdateProduct);
router.delete("/products/:id", DeleteProduct);
export default router;
