import mongoose, { Mongoose } from "mongoose";

const settingsSchema = new mongoose.Schema({
    sendReadReceipts: {
        type: Boolean,
        default: true,
    },
    sendTypingIndicators: {
        type: Boolean,
        default: true,
    },
    showOnline: {
        type: Boolean,
        default: true,
    }
}, { _id: false });

const userSChema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        Username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        contacts: {
            type: Map,
        },
        profilePic: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
            default: ""
        },
        learns: {
            type: [String],
        },
        speaks: {
            type: [String],
        },
        settings: {
            type: settingsSchema,
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSChema);

export default User;