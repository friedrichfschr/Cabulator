import mongoose, { mongo } from "mongoose";

const flashcardSchema = new mongoose.Schema({

    // content  
    vocabulary: {
        type: String, required: true,
    },
    translation: {
        type: String,
        required: true,

    },
    definition: {
        type: String,
    },
    comment: {
        type: String,
    },
    deckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deck",
        required: true
    },


    // Spaced Repetition System
    nextReview: {
        type: Date, default: Date.now
    },
    ease: {
        type: Number, default: 2.5
    },
    interval: {
        type: Number, default: 1
    },
    incorrectCount: {
        type: Number, default: 0
    },


    // Statistics
    reviewHistory: {
        type: [Date]
    }
}, { timestamps: true });

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

export default Flashcard;