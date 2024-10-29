import express from "express";
import {AddCart, DeleteCart, GetCart, UpdateCart} from "../controller/cart";

const route =express.Router();
route.post("/cart/:userid",AddCart)
route.get("/cart/:userid", GetCart)
route.delete("/cart/:id", DeleteCart)
route.patch("/cart/:id", UpdateCart)
export default route