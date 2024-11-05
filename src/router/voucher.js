import express from "express";
import {
  CreateVoucher,
  DeleteVoucher,
  DetailVoucher,
  getAllVoucher,
  UpdateVoucher,
} from "../controller/voucher";

const router = express.Router();
router.get("/vouchers", getAllVoucher);
router.post("/voucher", CreateVoucher);
router.patch("/voucher/:id", UpdateVoucher);
router.delete("/voucher/:id", DeleteVoucher);
router.get("/voucher/:id", DetailVoucher);
export default router;
