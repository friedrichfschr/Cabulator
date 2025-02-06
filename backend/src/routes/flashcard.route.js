import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createFlashcard, deleteFlashcard, getFlashcards, updateFlashcard } from "../controllers/flashcards.controller.js";

const router = express.Router();

// the :id is the DeckId 
router.post("/create/:id", protectRoute, createFlashcard)
router.get("/:id", protectRoute, getFlashcards)

// the id is the flashcard id here
router.put("/update/:id", protectRoute, updateFlashcard)
router.delete("/delete/:id", protectRoute, deleteFlashcard)
export default router;