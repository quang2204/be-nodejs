import express from "express";

import {
  singin,
  singup,
  updateUser,
  DeleteUser,
  GetUser,
  DetailUser,
  UpdatePassword,
} from "../controller/user-joi";
const router = express.Router();
router.post("/register", singup);
router.get("/user", GetUser);
router.post("/login", singin);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", DeleteUser);
router.get("/user/:id", DetailUser);
router.patch("/user/pass/:id", UpdatePassword);
export default router;
