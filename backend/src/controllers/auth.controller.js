import { set } from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {

    const { Username, email, password } = req.body;
    try {
        if (!Username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        };

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        console.log(req.body)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            Username: Username,
            email: email,
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                Username: newUser.Username,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }

    } catch (error) {
        if (error.name == "MongoServerError") {
            res.status(500).json({ message: "Username already taken" })
        }
        console.log("Error in signup controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        };

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" })
        };

        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            Username: user.Username,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }


};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic, Username, bio, speaks, learns } = req.body;
        const userId = req.user._id

        const updatedprofile = {};

        if (Username) {
            const doesUsernameExist = await User.findOne({ Username });
            if (doesUsernameExist && doesUsernameExist._id.toString() !== userId.toString()) {
                return res.status(400).json({ message: "Username already exists" });
            }
            updatedprofile.Username = Username;
        }

        if (profilePic) {
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            updatedprofile.profilePic = uploadResponse.secure_url;
        }

        if (bio) {
            updatedprofile.bio = bio;
        }

        if (speaks) { updatedprofile.speaks = speaks; }

        if (learns) { updatedprofile.learns = learns; }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedprofile, { new: true });

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("error in updating profile: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getContacts = async (req, res) => {
    try {

        // check if there are any contacts to get
        if (!req.user.contacts) return res.status(200).json(null)

        const contactIds = Array.from(req.user.contacts.keys());

        const contactUsers = await User.find({ "_id": { "$in": contactIds } }).select("-password");

        const contactsWithNewMessages = contactUsers.map(user => ({
            _id: user._id,
            Username: user.Username,
            email: user.email,
            profilePic: user.profilePic,
            newMessages: req.user.contacts.get(user._id.toString())
        }));



        res.status(200).json(contactsWithNewMessages);
    } catch (error) {
        console.error("Error in getContacts", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const setContact = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const { id: contactId } = req.params;

        const updatedUser = await User.findByIdAndUpdate(loggedInUserId, { $set: { [`contacts.${contactId}`]: 0 } }, { new: true })

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in setting Contact: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ Username: username }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);

    } catch (error) {
        console.log("Error in getUserByUsername controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
};

export const updateSettings = async (req, res) => {
    try {
        const { sendReadReceipts, sendTypingIndicators, showOnline } = req.body;
        const userId = req.user._id;
        const updatedSettings = {};
        console.log(req.body);

        if (sendReadReceipts !== undefined) {
            updatedSettings.sendReadReceipts = sendReadReceipts;
        }
        if (sendTypingIndicators !== undefined) {
            updatedSettings.sendTypingIndicators = sendTypingIndicators;
        }
        if (showOnline !== undefined) {
            updatedSettings.showOnline = showOnline;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { settings: updatedSettings } },
            { new: true }
        );
        console.log(updatedUser.settings);
        res.status(200).json(updatedUser.settings);
    } catch (error) {
        console.log("error in updating settings: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getSettings = async (req, res) => {
    try {
        const settings = req.user.settings;
        res.status(200).json(settings);
    } catch {
        console.log("error in getSettings", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}