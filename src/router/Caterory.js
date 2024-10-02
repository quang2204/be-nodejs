import express from "express";
import { CreateCaterory, GetAllCaterory } from "../controller/Caterory";
const router=express.Router();
router.get("/caterory",GetAllCaterory)
router.post("/caterory",CreateCaterory)
export default router