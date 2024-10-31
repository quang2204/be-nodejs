import express from "express";
import {CreateVoucher, getAllVoucher} from "../controller/voucher";

const router=express.Router();
router.get("/vouchers",getAllVoucher);
router.post("/vouchers",CreateVoucher);
export default router