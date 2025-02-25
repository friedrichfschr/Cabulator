import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


export const searchUsers = async (req, res) => {
    try {
        const { searchString } = req.params;
        const loggedInUser = req.user;

        let contactIds = [];
        if (req.user.contacts) {
            contactIds = Array.from(req.user.contacts.keys());
        }

        const filteredUsers = await User.find({
            Username: { $regex: searchString, $options: "i" },
            _id: { $ne: loggedInUser._id, $nin: contactIds }
        }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in searchUsers", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUsersForAddingContact = async (req, res) => {
    try {
        const loggedInUserId = req.user._id

        // check if there are any contacts to be excluded
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
        console.error("Error in getUsersForAddingContact", error)
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ]
        });

        const user = await User.findById(myId);
        const currentContact = user.contacts.get(userToChatId);

        if (currentContact) { // Only update if contact exists
            const newMessageCount = user.settings.sendReadReceipts ? 0 : -1;
            await User.findByIdAndUpdate(myId,
                {
                    $set: {
                        [`contacts.${userToChatId}.messageCount`]: newMessageCount
                    }
                }
            );
        }

        res.status(200).json(messages);
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

        // update the timestamp of the sender so that the contact with the receiver is moved to the top
        await User.findByIdAndUpdate(senderId, { $set: { [`contacts.${receiverId}.timestamp`]: Date.now() } });
        if (text) {
            await User.findByIdAndUpdate(senderId, { $set: { [`contacts.${receiverId}.lastMessage`]: text } });
        }
        else {
            await User.findByIdAndUpdate(senderId, { $set: { [`contacts.${receiverId}.lastMessage`]: "Image" } });
        }

        const contactData = receiver.contacts?.get(senderId.toString());
        if (!contactData) {
            // Handle case where contactData is undefined -> the other user doesn't have the sender as a contact
            const initialValue = {
                messageCount: 1,
                timestamp: Date.now(),
                lastMessage: text || "Image"
            };
            await User.findByIdAndUpdate(
                receiverId,
                { $set: { [`contacts.${senderId}`]: initialValue } },
                { new: true }

            );
        } else {
            const currentCount = parseInt(contactData.messageCount) || 0;
            const newCount = currentCount === -1 ? 1 : currentCount + 1;
            await User.findByIdAndUpdate(
                receiverId,
                {
                    $set: {
                        [`contacts.${senderId}`]: {
                            messageCount: newCount,
                            timestamp: Date.now(),
                            lastMessage: text || "Image"
                        }
                    }
                },
                { new: true }
            );
        }


        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // a newMessage event is emitted to the receiver so that the message can be displayed without refreshing the page
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

        // this finds the amount of unread messages for the selected user
        // this is used to determine if the receiver has read the messages or not and this function is called 
        // by the use wanting to know the read status : the sender

        // a use sent a message -> if the receiver opened the message this count will be 0 : otherwise the count will be the amount of unread messages

        const user = await User.findById(selectedContactId, { [`contacts.${userId}`]: 1 });

        const contactData = user.contacts?.get(userId.toString());
        const unreadMessagesCount = contactData?.messageCount || 0;

        res.status(200).json(unreadMessagesCount);

    } catch (error) {
        console.log("Error in getUnReadMessagesCount", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



