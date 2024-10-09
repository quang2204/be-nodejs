import express from "express";
import cors from "cors"; // Import cors
import { connectDb } from "./config/db";
import productRouter from "./router/products";
import userRouter from "./router/User";
import cateroryRouter from "./router/Caterory";

const app = express();

// CORS options
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"], // Allow specific origins (you can also use an array of domains)
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Restrict allowed headers
  credentials: true, // Enable credentials (cookies, authorization headers)
};

// Use CORS middleware with options
app.use(cors(corsOptions));
app.use(express.json());

connectDb();

app.use("/api", productRouter);
app.use("/api", userRouter);
app.use("/api", cateroryRouter);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});

export default app;
