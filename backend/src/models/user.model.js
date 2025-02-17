import mongoose, { Mongoose } from "mongoose";
const contactSchema = new mongoose.Schema({
    contactId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    value: {
        type: Number,
        required: false,
        default: 0,
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
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSChema);

export default User;