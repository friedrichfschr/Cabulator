import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}


//used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    // console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId
    if (userId) {
        userSocketMap[userId] = socket.id
    }

    // io.emit is used to send events to all connected users
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("markAsRead", (selectedContactId, readBy) => {
        // Notify the sender that the message has been read
        const receiverSocketId = getReceiverSocketId(selectedContactId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageRead", readBy);
        }

        // update the database that the message has been read
        // this is need so that the message will still be shown as read even if the page was reloaded and the read state queried from the DB
        User.findByIdAndUpdate(readBy, { $set: { [`contacts.${selectedContactId}`]: 0 } }).exec();

    })

    socket.on("typing", (selectedContactId, senderId) => {
        const receiverSocketId = getReceiverSocketId(selectedContactId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", senderId);
        }
    })

    socket.on("disconnect", () => {
        // console.log("A user disconnected", socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))

    })


})


export { io, app, server };