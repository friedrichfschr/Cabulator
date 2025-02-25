import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createDeck, createFlashcard, deleteDeck, deleteFlashcard, getDecks, getFlashcards, updateDeck, updateFlashcard } from "../controllers/deck.controller.js";


const router = express.Router();

router.post("/create", protectRoute, createDeck)
router.put("/update/:deckId", protectRoute, updateDeck)
router.delete("/delete/:deckId", protectRoute, deleteDeck)
router.get("/", protectRoute, getDecks)

router.post("/flashcards/create/:deckId", protectRoute, createFlashcard)
router.put("/flashcards/update/:flashcardId", protectRoute, updateFlashcard)
router.delete("/flashcards/delete/:flashcardId", protectRoute, deleteFlashcard)
router.get("/flashcards/:flashcardId", protectRoute, getFlashcards)



export default router