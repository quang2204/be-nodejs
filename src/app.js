import express from "express";
import cors from "cors"; // Import cors
import { connectDb } from "./config/db";
import productRouter from "./router/products";
import userRouter from "./router/User";
import categoryRouter from "./router/Caterory";
import cartRouter from "./router/cart";
import voucher from "./router/voucher";
import dashboardRouter from "./router/dashboard";
import comment from "./router/comment";
import order from "./router/order";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // domain frontend của bạn
    credentials: true, // cho phép gửi cookie, credentials
  }));
  app.use(cookieParser());
app.use(express.json());
connectDb();
app.use("/api", productRouter);
app.use("/api", dashboardRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", cartRouter);
app.use("/api", voucher);
app.use("/api", order);
app.use("/api", comment);
export const viteNodeApp = app;
// export default app;
