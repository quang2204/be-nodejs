import express from "express";

import {
  singup,
  updateUser,
  DeleteUser,
  GetUser,
  DetailUser,
  UpdatePassword,
  signin,
  refreshTokenHandler,
  logout,
  addUser,
} from "../controller/user-joi";
const router = express.Router();
router.post("/register", singup);
router.post("/addUser", addUser);
router.get("/user", GetUser);
router.post("/logout", logout);
router.post("/login", signin);
router.post('/refresh-token', refreshTokenHandler);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", DeleteUser);
router.get("/user/:id", DetailUser);
router.patch("/user/pass/:id", UpdatePassword);
export default router;
