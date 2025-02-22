import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore"

export const useChatStore = create((set, get) => (
    {
        messages: [],
        users: [],
        isUsersLoading: false,
        contacts: [],
        selectedContact: null,
        isContactsLoading: false,
        isMessagesLoading: false,
        filteredUsers: [],
        searchString: "",
        isRead: false,
        isTyping: false,


        getReadState: async (selectedContact) => {
            try {
                const res = await axiosInstance.get(`/messages/getUnreadCount/${selectedContact}`)
                set({ isRead: (res.data == 0) })

            } catch (error) {
                toast.error("Internal Server Error")
            }
        },

        setSearchString: (text) => {
            set({ searchString: text })
        },

        searchAndSetUsers: async () => {
            set({ isUsersLoading: true });
            const searchString = get().searchString;

            try {
                if (searchString) {
                    const res = await axiosInstance.post(`/messages/searchUsers/${searchString}`)
                    set({ filteredUsers: res.data })
                };
            } catch (error) {

            } finally {
                set({ isUsersLoading: false })
            }
        },

        getUsers: async () => {
            set({ isUsersLoading: true });
            try {
                const res = await axiosInstance.get("/messages/users")
                if (res.data) set({ users: res.data })
            } catch (error) {
                toast.error("Internal Server Error")
            } finally {
                set({ isUsersLoading: false })
            }
        },

        setContact: async (userId) => {
            try {
                const res = await axiosInstance.post(`/auth/setContact/${userId}`)
                get().getContacts()
                get().getUsers()
                get().searchAndSetUsers()

            } catch (error) {
                toast.error("Internal Server Error")
                console.log(error)
            }
        },

        getContacts: async () => {
            const { selectedContact } = get()
            set({ isContactsLoading: true });

            try {
                const res = await axiosInstance.get("/auth/contacts")
                if (res.data) set({ contacts: res.data })
                else set({ contacts: [] })
            } catch (error) {
                toast.error("Internal Server Error")
                console.log(error)

            } finally {
                set({ isContactsLoading: false })
            }
        },

        getMessages: async (selectedContactId) => {
            const { getReadState } = get();
            set({ isMessagesLoading: true });
            try {
                const res = await axiosInstance.get(`/messages/${selectedContactId}`)
                set({ messages: res.data });

            } catch (error) {
                toast.error("Internal Server Error")
                console.log(error)
            } finally {
                set({ isMessagesLoading: false })
            }
        },
        sendMessage: async (messageData) => {

            // set's the message footer to "delivered"

            const { selectedContact, messages } = get()
            try {

                messageData.receiverId = selectedContact._id
                messageData.senderId = useAuthStore.getState().authUser._id
                const now = new Date().toISOString()
                messageData.createdAt = now
                messageData.updatedAt = now
                messageData._id = Math.random().toString(36).substr(2, 9)

                set({ messages: [...messages, messageData] })
                set({ isRead: false })

                const res = await axiosInstance.post(`/messages/send/${selectedContact._id}`, messageData)

            } catch (error) {
                toast.error(error);
            }
        },

        subscribeToMessages: () => {
            const socket = useAuthStore.getState().socket;

            // this both updates the chatcontent if a new message is sent in real time and also increments the unread Messages count
            socket.on("newMessage", (newMessage) => {
                const { selectedContact, contacts, messages } = get();

                // Only update the messages if the sender is the currently selected contact
                if (newMessage.senderId === selectedContact?._id) {
                    set({
                        messages: [...messages, newMessage],
                    });

                    // sends to the selectedUser that the message was instantly read while the chat was open
                    const authUser = useAuthStore.getState().authUser
                    socket.emit("markAsRead", selectedContact._id, authUser._id)
                }

                else {
                    // Increment the newMessages counter for the sender
                    const updatedContacts = contacts.map((contact) => {
                        if (contact._id === newMessage.senderId) {
                            return { ...contact, newMessages: (contact.newMessages || 0) + 1 };

                        }
                        return contact;
                    });
                    set({ contacts: updatedContacts });
                }
            })
        },

        unsubscribeFromMessages: () => {
            const socket = useAuthStore.getState().socket
            socket.off("newMessage")
        },

        subscribeToRead: () => {
            const socket = useAuthStore.getState().socket;
            const { selectedContact } = get()
            socket.on("messageRead", (readBy) => {
                if (selectedContact._id == readBy) {
                    set({ isRead: true })
                }
            })
        },

        unsubscribeFromRead: () => {
            const socket = useAuthStore.getState().socket
            socket.off("messageRead")
        },

        subscribeToTyping: () => {
            const socket = useAuthStore.getState().socket;
            const { selectedContact, contacts } = get()
            socket.on("startTyping", (senderId) => {
                if (selectedContact?._id == senderId) {
                    set({ isTyping: true })
                } else {
                    set({ contacts: contacts.map((contact) => contact._id === senderId ? { ...contact, isTyping: true } : contact) })
                }

            })
            socket.on("stopTyping", (senderId) => {
                if (selectedContact?._id == senderId) {
                    set({ isTyping: false })
                } else {
                    set({ contacts: contacts.map((contact) => contact._id === senderId ? { ...contact, isTyping: false } : contact) })
                }
            })
        },
        unsubscribeFromTyping: () => {
            const socket = useAuthStore.getState().socket
            socket.off("stopTyping")
            socket.off("startTyping")
        },


        // the selectedContact is the User Object as in Mongo of the chatUer currently selected
        setSelectedContact: (selectedContact) => {
            set({ selectedContact })
            if (selectedContact) {

                const socket = useAuthStore.getState().socket;
                // sends to the selectedUser that the message was read after loading the messages
                const authUser = useAuthStore.getState().authUser
                socket.emit("markAsRead", selectedContact._id, authUser._id)
                const { getReadState } = get();
                getReadState(selectedContact._id)

            }
        },
    }
))