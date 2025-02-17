import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js"
import { getUserForSidebar, getMessages, sendMessage, searchUsers, getUnReadMessagesCount } from "../controllers/message.controller.js";

const router = express.Router()

router.get("/users", protectRoute, getUserForSidebar)
router.get("/:id", protectRoute, getMessages)
router.get("/getUnreadCount/:selectedContactId", protectRoute, getUnReadMessagesCount)

router.post("/send/:id", protectRoute, sendMessage)

router.post("/searchUsers/:searchString", protectRoute, searchUsers)

export default router