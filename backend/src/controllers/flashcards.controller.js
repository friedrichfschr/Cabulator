import Flashcard from "../models/flashcard.model.js";

export const createFlashcard = async (req, res) => {
    const { vocabulary, translation, definition, comment } = req.body;
    const { id: deckId } = req.params;
    try {
        if (!deckId) {
            return res.status(400).json({ message: "No DeckId provided" })
        }

        if (!vocabulary || !translation) {
            return res.status(400).json({ message: "No all necessary fields provided" })
        }

        const newFlashcard = new Flashcard({
            vocabulary,
            translation,
            definition,
            comment,
            deckId,
        })

        await newFlashcard.save()

        res.status(201).json(newFlashcard)
    } catch (error) {
        console.log("Error in creating Flashcard", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getFlashcards = async (req, res) => {
    try {
        const { id: givenDeckId } = req.params;
        const flashcards = await Flashcard.find({ deckId: givenDeckId })
        res.status(200).json(flashcards)
    } catch (error) {
        console.log("Error in getting Flashcards", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
export const updateFlashcard = async (req, res) => {
    const { vocabulary, translation, definition, comment } = req.body;
    const { id: givenFlashcardId } = req.params;
    try {
        const updatedFlashcard = await Flashcard.findByIdAndUpdate(givenFlashcardId, {
            vocabulary,
            translation,
            definition,
            comment
        })
        res.status(200).json(updatedFlashcard)
    } catch (error) {
        console.log("Error in updating Flashcard")
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const deleteFlashcard = async (req, res) => {
    const { id: givenFlashcardId } = req.params;
    try {

        await Flashcard.findByIdAndDelete(givenFlashcardId)
        res.status(200).json({ message: "Deleted successfully" })
    } catch (error) {
        console.log("Error in deleting Flashcard")
        req.status(500).json({ message: "Internal Server Error" })
    }
}