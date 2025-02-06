import mongoose from "mongoose";

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
    }

}, { timestamps: true })

const Deck = mongoose.model("Deck", deckSchema)
export default Deck;