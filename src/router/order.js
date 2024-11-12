import express from "express";
import {
  AddOrder,
  DeleteOrder,
  DetailOrder,
  GetOrder,
  GetOrderBystatus,
  GetOrderByUser,
  UpdateOrder,
} from "../controller/order";
const router = express.Router();
router.get("/orders", GetOrder);
router.post("/order", AddOrder);
router.patch("/order/:id", UpdateOrder);
router.delete("/order/:id", DeleteOrder);
router.get("/order/user/:userid", GetOrderByUser);
router.get("/order/:id", DetailOrder);
router.get("/order/status/:status", GetOrderBystatus);
// router.delete("/order", DeleteAllOrder);
export default router;
