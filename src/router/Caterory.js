import express from "express";
import {
  CreateCategory,
  DeleteCategory,
  DetailCategory,
  GetAllCategory,
  UpdateCategory,
} from "../controller/Caterory";

const router = express.Router();
router.get("/categorys", GetAllCategory);
router.post("/category", CreateCategory);
router.patch("/category/:id", UpdateCategory);
router.delete("/category/:id", DeleteCategory);
router.get("/category/:id", DetailCategory);
export default router;
