import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../../store/useChatStore'
import MessageInput from "./MessageInput"
import ChatHeader from "./ChatHeader"
import MessageSkeleton from '../skeletons/MessageSkeleton'
import { useAuthStore } from '../../store/useAuthStore'
import { formatMessageTime } from "../../lib/utils";

const ChatContainer = () => {
    const { messages, getMessages, isMessagesLoading, selectedContact, subscribeToMessages, unsubscribeFromMessages } = useChatStore()
    const { authUser } = useAuthStore();

    const messageEndRef = useRef(null);

    useEffect(() => {
        getMessages(selectedContact._id);
        subscribeToMessages();

        return () => unsubscribeFromMessages();
    }, [selectedContact._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages]);

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
        <div className='flex flex-col h-full  '>
            <div >
                {/* className='mt-30 max-[450px]:mt-54' */}
                <ChatHeader />
            </div>

            {
                messages.length > 0 ? <div className='flex-1 overflow-y-auto overflow-x-hidden m-4 space-y-4'>
                    {messages.map((message) => (
                        <div
                            key={message._id}
                            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                            ref={messageEndRef}
                        >
                            <div className=" chat-image avatar">
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
                                        className="min-w-40 max-w-fit max-h-90 rounded-md mb-1 mt-1 object-contain"
                                    />
                                )}

                                {message.text && <p style={{ "wordBreak": "break-all" }}>{message.text}</p>}



                            </div>
                        </div>
                    ))}
                </div>

                    : <div className='flex-1 flex overflow-y-auto space-y items-center justify-center'><span className="badge  animate-pulse">Start the Conversation!</span></div>
            }



            <div className='  mt-2'>
                <MessageInput />
            </div>



        </div >
    )
}

export default ChatContainer