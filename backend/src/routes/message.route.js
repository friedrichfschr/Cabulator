import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js"
import { getUserForSidebar, getMessages, sendMessage, searchUsers, getReadState } from "../controllers/message.controller.js";

const router = express.Router()

router.get("/users", protectRoute, getUserForSidebar)
router.get("/:id", protectRoute, getMessages)
router.get("/read/:selectedContactId", protectRoute, getReadState)

router.post("/send/:id", protectRoute, sendMessage)

router.post("/searchUsers/:searchString", protectRoute, searchUsers)

export default router