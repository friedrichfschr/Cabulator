import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";


import { connectDB } from "./lib/db.js"
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config()


app.use(express.json())

app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true

}))

app.use(bodyParser.json({ limit: '50mb' })); // Increase limit to 50MB
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));



app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)



const PORT = process.env.PORT

server.listen(PORT, () => {
    console.log("Server running on Port http://localhost:" + PORT);
    connectDB();
});