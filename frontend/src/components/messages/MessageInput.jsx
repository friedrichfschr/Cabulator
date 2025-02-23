import React, { useRef, useState, useEffect } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';
import Textarea from '../Textarea';

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const { sendMessage, selectedContact } = useChatStore();
    const { authUser, socket } = useAuthStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
        try {
            const storeText = text;
            const storeImagePreview = imagePreview;

            setText("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";

            const messageData = {
                text: storeText.trim(),
                image: storeImagePreview,
            };
            await sendMessage(messageData);
            if (!document.getElementById("messageInput").matches(':focus')) {
                socket.emit("stopTyping", selectedContact._id, authUser._id);
            }
        } catch (error) {
            console.error("Failed to send message: ", error);
            toast.error("Failed to send message");
        }
    };

    useEffect(() => {
        const handleStartTyping = () => {
            if (authUser.settings.sendTypingIndicators) {
                socket.emit("startTyping", selectedContact._id, authUser._id);
            }
        };

        const handleStopTyping = () => {
            socket.emit("stopTyping", selectedContact._id, authUser._id);
        };

        const inputElement = document.getElementById("messageInput");
        inputElement.addEventListener("focus", handleStartTyping);
        inputElement.addEventListener("blur", handleStopTyping);

        return () => {
            inputElement.removeEventListener("focus", handleStartTyping);
            inputElement.removeEventListener("blur", handleStopTyping);
        };
    }, [selectedContact, socket, authUser]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.ctrlKey) {
            e.preventDefault();
            handleSendMessage(e);
        } else if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();

            const cursorPosition = textareaRef.current.selectionStart;
            const newText = text.slice(0, cursorPosition) + "\n" + text.slice(cursorPosition);
            setText(newText);
            setTimeout(() => {
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd = cursorPosition + 1;
            }, 0);
        }
    };

    return (
        <div className='p-3 pt-0 w-full'>
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className='flex items-center gap-2'>

                <div className='flex-1 flex gap-2'>
                    <Textarea
                        givenId="messageInput"
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    <button
                        type="button"
                        className={`flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>
                    <button
                        type="submit"
                        className="btn btn-sm btn-circle"
                        disabled={!text.trim() && !imagePreview}
                    >
                        <Send size={22} />
                    </button>
                </div>
            </form>
        </div >
    );
};

export default MessageInput;