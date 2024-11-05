import express from "express";

import {
  singin,
  singup,
  updateUser,
  DeleteUser,
  GetUser,
  DetailUser,
} from "../controller/user-joi";
const router = express.Router();
router.post("/register", singup);
router.get("/user", GetUser);
router.post("/login", singin);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", DeleteUser);
router.get("/user/:id", DetailUser);
export default router;
