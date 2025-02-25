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
            of: new mongoose.Schema({
                messageCount: {
                    type: Number,
                    default: 0
                },
                timestamp: {
                    type: Number,
                    default: 0
                },
                lastMessage: {
                    type: String,
                    default: ""
                }
            }, { _id: false })
        },
        profilePic: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
            default: ""
        },
        hobbies: {
            type: [String],
        },
        learns: {
            type: [String],
        },
        speaks: {
            type: [String],
        },
        settings: {
            type: settingsSchema,
            default: {
                sendReadReceipts: true,
                sendTypingIndicators: true,
                showOnline: true
            },
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSChema);

export default User;