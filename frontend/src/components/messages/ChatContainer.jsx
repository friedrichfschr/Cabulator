import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../../store/useChatStore'
import MessageInput from "./MessageInput"
import ChatHeader from "./ChatHeader"
import ViewImage from '../viewImage'
import MessageSkeleton from '../skeletons/MessageSkeleton'
import { useAuthStore } from '../../store/useAuthStore'
import { formatMessageTime, formatDate } from "../../lib/utils";

const ChatContainer = () => {
    const { selectedContact,
        messages, getMessages, isMessagesLoading,
        subscribeToMessages, unsubscribeFromMessages,
        getReadState, subscribeToRead, unsubscribeFromRead, isRead,
        subscribeToTyping, unsubscribeFromTyping, isTyping,
        hasMoreMessages, isLoadingMore, loadMoreMessages
    } = useChatStore()

    const { authUser } = useAuthStore();

    const messagesContainerRef = useRef(null);
    const previousMessagesLength = useRef(messages.length);
    const isInitialLoad = useRef(true); // Add this ref for tracking initial load

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (!isLoadingMore) {
            if (isInitialLoad.current) {
                // Scroll on initial load
                scrollToBottom();
                isInitialLoad.current = false;
            } else {
                // Only scroll if a new message was added (not when loading older messages)
                const isNewMessage = messages.length === previousMessagesLength.current + 1;
                if (isNewMessage) {
                    scrollToBottom();
                }
            }
        }
        previousMessagesLength.current = messages.length;
    }, [messages, isLoadingMore]);

    useEffect(() => {
        isInitialLoad.current = true;
    }, [selectedContact._id]);

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


    const handleScroll = (e) => {
        const { scrollTop } = e.target;
        if (scrollTop < 50 && hasMoreMessages && !isLoadingMore) {
            loadMoreMessages();
        }
    };

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
                <div
                    ref={messagesContainerRef}
                    className='flex-1 overflow-y-auto overflow-x-hidden m-4 mt-0 space-y-4'
                    onScroll={handleScroll}
                >
                    {isLoadingMore && (
                        <div className="text-center">
                            <span className="loading loading-spinner"></span>
                        </div>
                    )}
                    {messages.map((message, index) => {
                        const isLastMessage = index === messages.length - 1;

                        const currentMessageDate = new Date(message.updatedAt);
                        const previousMessageDate = index > 0 ? new Date(messages[index - 1].updatedAt) : null;
                        const showDate = !previousMessageDate || currentMessageDate.toDateString() !== previousMessageDate.toDateString();

                        return (
                            <React.Fragment key={message._id}>
                                {showDate && (
                                    <div className="text-center my-2">
                                        <span className="badge">{formatDate(currentMessageDate)}</span>
                                    </div>
                                )}
                                <div
                                    className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}

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

                                    <div className="chat-header mb-1 ">
                                        <time className="text-xs opacity-50 ml-1">
                                            {formatMessageTime(message.updatedAt)}
                                        </time>
                                    </div>
                                    <div className="chat-bubble flex flex-col max-w-120">
                                        {message.image && (
                                            <ViewImage
                                                classes="min-w-20 max-w-full max-h-90 rounded-md mb-1 mt-1 object-contain"
                                                src={message.image}
                                                alt="Attachment"
                                            />
                                        )}
                                        {message.text && <p style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{message.text}</p>}
                                    </div>
                                    <div className='chat-footer'>
                                        {isLastMessage && message.senderId === authUser._id && (
                                            <span className="text-xs text-gray-500 mt-1 ml-2 mb-0">
                                                {isRead ? "Read" : "Delivered"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </React.Fragment>
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