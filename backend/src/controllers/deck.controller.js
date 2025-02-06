import mongoose from "mongoose";
import Deck from "../models/deck.model.js";

export const createDeck = async (req, res) => {
    const { title, description, published } = req.body
    const userId = req.user._id
    try {
        if (!title) {
            return res.status(400).json({ message: "Please provide a title" })
        }
        const newDeck = new Deck({
            title: title,
            description: description,
            published: published,
            owner: userId,

        })
        await newDeck.save()

        res.status(201).json(newDeck)

    } catch (error) {
        console.log("Error in creating deck", error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const updateDeck = async (req, res) => {
    const { title, description, published } = req.body
    const { id: deckId } = req.params;

    try {
        const updatedDeck = await Deck.findByIdAndUpdate(deckId, {
            title: title,
            description: description,
            published: published
        }, { new: true })
        res.status(200).json(updatedDeck)

    } catch (error) {
        console.log("error in updating deck", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}