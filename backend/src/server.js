import express from "express";
import { connectDB } from "./config/db.js";
import "dotenv/config";
import productRoutes from "./routes/productRoutes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import orderRoutes from "./routes/orderRouters.js";
import path from "path";
//add cors middleware

const app = express();
app.use(express.json());
const __dirname = path.resolve();

app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/orders", orderRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});
}
connectDB().then(() =>
  app.listen(process.env.PORT, () =>
    console.log("Server is listening on port " + process.env.PORT)
  )
);
