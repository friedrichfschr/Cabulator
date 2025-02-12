import express from "express";
import { login, logout, signup, updateProfile, checkAuth, getContacts, setContact } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.put("/update-profile", protectRoute, updateProfile)

router.get("/check", protectRoute, checkAuth)

router.get("/contacts", protectRoute, getContacts)
router.post("/setContact/:id", protectRoute, setContact)


export default router;