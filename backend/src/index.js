import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js"
import authRoutes from "./routes/auth.route.js";

dotenv.config()
const app = express();

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)



const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log("Server running on Port http://localhost:" + PORT);
    connectDB();
});