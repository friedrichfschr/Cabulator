import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createDeck, updateDeck } from "../controllers/deck.controller.js";


const router = express.Router();

router.post("/create", protectRoute, createDeck)

router.put("/update/:id", protectRoute, updateDeck)
export default router