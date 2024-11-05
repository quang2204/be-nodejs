import express from "express";
import {
  AddOrder,
  DeleteOrder,
  GetOrder,
  UpdateOrder,
} from "../controller/order";

const router = express.Router();
router.get("/orders", GetOrder);
router.post("/order", AddOrder);
router.patch("/order/:id", UpdateOrder);
router.delete("/order/:id", DeleteOrder);
export default router;
