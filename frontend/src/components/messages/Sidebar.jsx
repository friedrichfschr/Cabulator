import React, { useEffect, useState } from 'react'
import SidebarSkeleton from "../skeletons/SidebarSkeleton"
import AddContact from './AddContact'
import { Users } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { useChatStore } from '../../store/useChatStore'
import { formatMessageTimestampForSidebar, truncateMessage } from '../../lib/utils'
import { max } from 'date-fns'

const Sidebar = () => {
    const { getContacts, contacts, selectedContact, setSelectedContact, isContactsLoading, subscribeToMessages, unsubscribeFromMessages, subscribeToTyping, unsubscribeFromTyping } = useChatStore()

    const { onlineUsers, authUser } = useAuthStore()
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        getContacts()
    }, [getContacts])

    useEffect(() => {
        subscribeToMessages()
        return () => { unsubscribeFromMessages() }
    })

    useEffect(() => {
        subscribeToTyping();
        return () => unsubscribeFromTyping();
    })

    const onlineContacts = contacts.filter((contact) => (onlineUsers.includes(contact._id)));
    const shownContacts = showOnlineOnly ? onlineContacts : contacts;

    return (
        <div className="grow-1 h-full border-r border-base-300 flex flex-col transition-all duration-200">
            <div className='border-b border-base-300 w-full p-5 flex justify-between items-center'>
                <div>
                    <Users className='size-6' />
                    <span className='font-medium block'>Contacts</span>
                </div>

                <AddContact></AddContact>
            </div>
            <div className="ml-3 mt-3 flex items-center gap-2">
                <label className="cursor-pointer flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showOnlineOnly}
                        onChange={(e) => setShowOnlineOnly(e.target.checked)}
                        className="checkbox checkbox-sm"
                    />
                    <span className="text-sm">Show online only</span>
                </label>
                <span className="text-xs text-zinc-500">({onlineContacts.length} online)</span>
            </div>


            {isContactsLoading ?
                <SidebarSkeleton /> :
                <div className='mt-2 overflow-y-auto w-full py-3'>
                    {shownContacts.map((contact) => (
                        <button
                            key={contact._id}
                            onClick={() => setSelectedContact(contact)}
                            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors rounded-xl
              ${selectedContact?._id === contact._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
                        >
                            <div className=" block relative ">
                                <img
                                    src={contact.profilePic || "/avatar.png"}
                                    alt={contact.Username}
                                    className="size-12 min-w-12 object-cover rounded-full"
                                />
                                {onlineUsers.includes(contact._id) && (
                                    <span
                                        className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                                    />
                                )}
                            </div>


                            <div className="block text-left shrink-1">
                                <div className="font-medium truncate">{contact.Username}</div>
                                <div className="text-sm text-zinc-400" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                    {truncateMessage(contact.lastMessage)}
                                </div>
                            </div>
                            { }
                            {contact.lastMessageTimestamp &&
                                <time className="text-xs text-zinc-500 ml-auto shrink-0">
                                    {formatMessageTimestampForSidebar(contact.lastMessageTimestamp)}
                                </time>
                            }
                            {(contact.isTyping && authUser.settings.sendTypingIndicators) ? <div className="typing-indicator mt-1">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div> : contact.newMessages > 0 && <div className=" badge badge-primary size-5">{contact.newMessages}</div>}
                        </button>
                    ))}

                    {shownContacts.length === 0 && (
                        <div className="text-center text-zinc-500 py-4">No online users</div>
                    )}

                </div>}
        </div >
    )
}

export default Sidebar