import mongoose from "mongoose";
import Flashcard from "./flashcard.model.js";

const deckSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    published: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: "#94a3b8", // Default slate-400 color
    },

}, { timestamps: true })

// Add middleware for findByIdAndDelete and findOneAndDelete
deckSchema.pre(['findOneAndDelete', 'deleteOne'], async function (next) {
    const deckId = this.getQuery()["_id"];
    await Flashcard.deleteMany({ deckId: deckId });
    next();
});

// Add middleware for deleteMany
deckSchema.pre('deleteMany', async function (next) {
    const deckIds = this.getQuery()["_id"]["$in"];
    await Flashcard.deleteMany({ deckId: { $in: deckIds } });
    next();
});

const Deck = mongoose.model("Deck", deckSchema)
export default Deck;