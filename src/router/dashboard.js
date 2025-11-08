import express from "express";
import DashboardStats from "../controller/dashboard";

const route = express.Router();

route.get("/dashboard", DashboardStats);
export default route;
