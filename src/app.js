import express from "express";
import cors from "cors"; // Import cors
import { connectDb } from "./config/db";
import productRouter from "./router/products";
import userRouter from "./router/User";
import cateroryRouter from "./router/Caterory";

const app = express();
app.use(cors());
app.use(express.json());
connectDb();
app.use("/api", productRouter);
app.use("/api", userRouter);
app.use("/api", cateroryRouter);

// export const viteNodeApp = app;
export default app;
