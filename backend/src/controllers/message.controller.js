import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


export const searchUsers = async (req, res) => {
    try {
        const { searchString } = req.params
        const loggedInUser = req.user;

        const contactIds = Array.from(req.user.contacts.keys());

        const filteredUsers = await User.find({
            Username: { $regex: searchString, $options: "i" },
            _id: { $ne: loggedInUser._id, $nin: contactIds }
        }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in searchUsers", error.message)
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id

        // check if contacts need to be excluded
        if (req.user.contacts) {
            const contactIds = Array.from(req.user.contacts.keys());
            const filteredUsers = await User.find({
                _id: { $ne: loggedInUserId, $nin: contactIds }
            }).select("-password");
            res.status(200).json(filteredUsers)

        } else {
            const filteredUsers = await User.find({
                _id: { $ne: loggedInUserId }
            }).select("-password")
            res.status(200).json(filteredUsers)
        }

    } catch (error) {
        console.error("Error in getUserForSidebar", error)
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ]
        })
        await User.findByIdAndUpdate(myId, { $set: { [`contacts.${userToChatId}`]: 0 } });

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save()

        const receiver = await User.findById(receiverId);


        if (!receiver.contacts || !receiver.contacts[senderId]) {
            // Create the field if it doesn't exist
            await User.findByIdAndUpdate(
                receiverId,
                { $set: { [`contacts.${senderId}`]: 0 } },
                { new: true }
            );
        }

        await User.findByIdAndUpdate(
            receiverId,
            { $inc: { [`contacts.${senderId}`]: 1 } },
            { new: true }
        );

        //  realtime functionality goes here => socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage)



    } catch (error) {
        console.log("Error in sendMessage controller", error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

export const getUnReadMessagesCount = async (req, res) => {
    try {
        const { selectedContactId } = req.params;
        const userId = req.user._id

        const user = await User.findById(selectedContactId, { [`contacts.${userId}`]: 1 });

        const unreadMessagesCount = user.contacts.get(userId.toString()) || 0;
        res.status(200).json(unreadMessagesCount)

    } catch (error) {
        console.log("Error in getReadState", error)
        res.status(500)
    }

}



