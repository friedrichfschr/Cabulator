import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            const conn = await mongoose.connect(process.env.MONGO_DEV_URI)
            console.log("MongoDB connected: " + conn.connection.host)
        } else {
            const conn = await mongoose.connect(process.env.MONGO_URI)
            console.log("MongoDB connected: " + conn.connection.host)
        }

    } catch (error) {
        console.log("failed to connect Database", error)
    }
};

