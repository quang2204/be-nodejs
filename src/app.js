import express from "express";
import cors from "cors"; // Import cors
import { connectDb } from "./config/db";
import productRouter from "./router/products";
import userRouter from "./router/User";
import categoryRouter from "./router/Caterory";
import cartRouter from "./router/cart";
import voucher from "./router/voucher";
import order from "./router/order";
const app = express();
app.use(cors());
app.use(express.json());
connectDb();
app.use("/api", productRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", cartRouter);
app.use("/api", voucher);
app.use("/api", order);

export const viteNodeApp = app;
// export default app;
