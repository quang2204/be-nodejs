import express from "express";
import cors from "cors"; // Import cors
import { connectDb } from "./config/db";
import productRouter from "./router/products";
import userRouter from "./router/User";
import categoryRouter from "./router/Caterory";
import cartRouter from "./router/cart";
import voucher from "./router/voucher";
import order from "./router/order";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
    origin: 'https://nextnode-mu.vercel.app', // domain frontend của bạn
    credentials: true, // cho phép gửi cookie, credentials
  }));
  app.use(cookieParser());
app.use(express.json());
connectDb();
app.use("/api", productRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", cartRouter);
app.use("/api", voucher);
app.use("/api", order);
// sa
// export const viteNodeApp = app;
export default app;
