import express from "express";
import {
  AddOrder,
  DeleteOrder,
  DetailOrder,
  GetOrder,
  GetOrderByUser,
  UpdateOrder,
} from "../controller/order";
import { DeleteAllOrder } from "../controller/cart";

const router = express.Router();
router.get("/orders", GetOrder);
router.post("/order", AddOrder);
router.patch("/order/:id", UpdateOrder);
router.delete("/order/:id", DeleteOrder);
router.get("/order/user/:userid", GetOrderByUser);
router.get("/order/:id", DetailOrder);
// router.delete("/order", DeleteAllOrder);

export default router;
