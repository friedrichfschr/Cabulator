import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../../store/useChatStore'
import MessageInput from "./MessageInput"
import ChatHeader from "./ChatHeader"
import MessageSkeleton from '../skeletons/MessageSkeleton'
import { useAuthStore } from '../../store/useAuthStore'
import { formatMessageTime } from "../../lib/utils";

const ChatContainer = () => {
    const { selectedContact,
        messages, getMessages, isMessagesLoading,
        subscribeToMessages, unsubscribeFromMessages,
        getReadState, subscribeToRead, unsubscribeFromRead, isRead,
        subscribeToTyping, unsubscribeFromTyping, isTyping
    } = useChatStore()

    const { authUser } = useAuthStore();

    useEffect(() => {
        getReadState(selectedContact._id);
        subscribeToRead();
        return () => unsubscribeFromRead();
    }, [selectedContact, getReadState, getMessages])

    useEffect(() => {
        getMessages(selectedContact._id);
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [selectedContact._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        subscribeToTyping();
        return () => unsubscribeFromTyping();
    }, [subscribeToTyping, unsubscribeFromTyping])

    const messageEndRef = useRef(null);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    if (isMessagesLoading) {
        return (
            <div className='flex flex-col h-full'>
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        )
    }

    return (
        <div className='flex flex-col h-full'>
            <div>
                <ChatHeader />
            </div>

            {messages.length > 0 ? (
                <div className='flex-1 overflow-y-auto overflow-x-hidden m-4 mt-0 space-y-4'>
                    {messages.map((message, index) => {
                        const isLastMessage = index === messages.length - 1;
                        return (
                            <div
                                key={message._id}
                                className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                                ref={isLastMessage ? messageEndRef : null}
                            >
                                <div className="chat-image avatar">
                                    <div className="size-10 rounded-full border">
                                        <img
                                            src={
                                                message.senderId === authUser._id
                                                    ? authUser.profilePic || "/avatar.png"
                                                    : selectedContact.profilePic || "/avatar.png"
                                            }
                                            alt="profile pic"
                                        />
                                    </div>
                                </div>

                                <div className="chat-header mb-1">
                                    <time className="text-xs opacity-50 ml-1">
                                        {formatMessageTime(message.createdAt)}
                                    </time>
                                </div>
                                <div className="chat-bubble flex flex-col max-w-120">
                                    {message.image && (
                                        <img
                                            src={message.image}
                                            alt="Attachment"
                                            className="min-w-20 max-w-full max-h-90 rounded-md mb-1 mt-1 object-contain"
                                        />
                                    )}

                                    {message.text && <p style={{ "wordBreak": "break-all" }}>{message.text}</p>}
                                </div>
                                <div className='chat-footer'>
                                    {isLastMessage && message.senderId === authUser._id && (
                                        <span className="text-xs text-gray-500 mt-1 ml-2 mb-0">
                                            {isRead ? "Read" : "Delivered"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {isTyping && (
                        <div className='chat chat-start'>
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border">
                                    <img
                                        src={selectedContact.profilePic || "/avatar.png"}
                                        alt="profile pic"
                                    />
                                </div>
                            </div>
                            <div className="chat-bubble flex flex-col max-w-120 ">
                                <div className="typing-indicator mt-1">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className='flex-1 flex overflow-y-auto space-y items-center justify-center'>
                    <span className="badge animate-pulse">Start the Conversation!</span>
                </div>
            )}

            <div className=''>
                <MessageInput />
            </div>
        </div>
    )
}

export default ChatContainer