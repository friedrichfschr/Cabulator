import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js"
import { getUsersForAddingContact, getMessages, sendMessage, searchUsers, getUnReadMessagesCount } from "../controllers/message.controller.js";

const router = express.Router()

router.get("/users", protectRoute, getUsersForAddingContact)
router.get("/:id", protectRoute, getMessages)
router.get("/getUnreadCount/:selectedContactId", protectRoute, getUnReadMessagesCount)

router.post("/send/:id", protectRoute, sendMessage)

router.post("/searchUsers/:searchString", protectRoute, searchUsers)

export default router