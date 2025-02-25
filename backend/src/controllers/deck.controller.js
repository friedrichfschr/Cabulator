import Deck from "../models/deck.model.js";
import Flashcard from "../models/flashcard.model.js";
import mongoose, { mongo } from "mongoose";

export const createDeck = async (req, res) => {
    const { title, description, published, color } = req.body
    const userId = req.user._id
    try {
        if (!title) {
            return res.status(400).json({ message: "Please provide a title" })
        }
        const newDeck = new Deck({
            title: title,
            description: description,
            published: published, // this is a boolean if the deck can be accessed by other users or not
            owner: userId,
            color: color
        })
        await newDeck.save()

        res.status(201).json(newDeck)
    } catch (error) {
        console.log("Error in creating deck", error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const updateDeck = async (req, res) => {
    const { title, description, published, color } = req.body
    const { deckId: givenDeckId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(givenDeckId)) {
        return res.status(400).json({ message: "Invalid deck ID format" });
    }

    const updatedDeck = {};
    if (title) updatedDeck.title = title;
    if (description) updatedDeck.description = description;
    if (published) updatedDeck.published = published;
    if (color) updatedDeck.color = color;

    try {
        const updatedDeckInDB = await Deck.findByIdAndUpdate(givenDeckId, updatedDeck, { new: true })
        if (!updatedDeckInDB) {
            return res.status(404).json({ message: "Deck not found" })
        }
        res.status(200).json(updatedDeckInDB)

    } catch (error) {
        console.log("error in updating deck", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const deleteDeck = async (req, res) => {
    const { deckId: givenDeckId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(givenDeckId)) {
        return res.status(400).json({ message: "Invalid deck ID format" });
    }

    try {
        const deletedDeck = await Deck.findByIdAndDelete(givenDeckId)
        if (!deletedDeck) {
            return res.status(404).json({ message: "Deck not found" })
        }
        res.status(200).json({ message: "Deleted successfully" })
    } catch (error) {
        console.log("Error in deleting Deck", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getDecks = async (req, res) => {
    try {
        const decks = await Deck.find({ owner: req.user._id })
        res.status(200).json(decks)
    } catch (error) {
        console.log("Error in getting Deck", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const createFlashcard = async (req, res) => {
    const { word, translation, definition, comment } = req.body;
    const { deckId: deckId } = req.params;

    try {


        if (!deckId) {
            return res.status(400).json({ message: "No DeckId provided" })
        }

        if (!word || !translation) {
            return res.status(400).json({ message: "Please provide all necessary fields" })
        }

        const newFlashcard = new Flashcard({
            word,
            translation,
            definition,
            comment,
            deckId,
        })

        const newFlashcardFromDB = await newFlashcard.save()

        res.status(201).json(newFlashcardFromDB)
    } catch (error) {
        console.log("Error in creating Flashcard", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const updateFlashcard = async (req, res) => {
    const { word, translation, definition, comment } = req.body;
    const { flashcardId: givenFlashcardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(givenFlashcardId)) {
        return res.status(400).json({ message: "Invalid flashcard ID format" });
    }

    try {
        const updatedFlashcard = {};
        if (word) updatedFlashcard.word = word;
        if (translation) updatedFlashcard.translation = translation;
        if (definition) updatedFlashcard.definition = definition;
        if (comment) updatedFlashcard.comment = comment;

        const updatedFlashcardInDB = await Flashcard.findByIdAndUpdate(givenFlashcardId, updatedFlashcard, { new: true })
        if (!updatedFlashcardInDB) {
            return res.status(404).json({ message: "Flashcard not found" })
        }
        res.status(200).json(updatedFlashcardInDB)
    } catch (error) {
        console.log("Error in updating Flashcard")
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const deleteFlashcard = async (req, res) => {
    const { flashcardId: givenFlashcardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(givenFlashcardId)) {
        return res.status(400).json({ message: "Invalid flashcard ID format" });
    }

    try {
        const deletedFlashcard = await Flashcard.findByIdAndDelete(givenFlashcardId)
        if (!deletedFlashcard) {
            return res.status(404).json({ message: "Flashcard not found" })
        }
        res.status(200).json({ message: "Deleted successfully" })
    } catch (error) {
        console.log("Error in deleting Flashcard")
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getFlashcards = async (req, res) => {
    const { flashcardId: givenDeckId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(givenDeckId)) {
        return res.status(400).json({ message: "Invalid deck ID format" });
    }

    try {
        const flashcards = await Flashcard.find({ deckId: givenDeckId })

        res.status(200).json(flashcards)
    } catch (error) {
        console.log("Error in getting Flashcards", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}