import express from "express";
import {
  AddProduct,
  DeleteProduct,
  GetAllProduct,
  GetProductDetails,
  Pagination,
  UpdateProduct,
} from "../controller/product";
import { checkout } from "../xacthuc/checkout";
const router = express.Router();
router.get("/products", GetAllProduct);
router.get("/products/:page", Pagination);
router.get("/product/:id", GetProductDetails);
router.post("/products", AddProduct);
router.put("/products/:id", UpdateProduct);
router.delete("/products/:id", DeleteProduct);
export default router;
