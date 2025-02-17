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

            if (selectedContact) console.log(selectedContact)

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

                getReadState(selectedContactId)
                axiosInstance.get(`/messages/markAsRead/${selectedContactId}`)

            } catch (error) {
                toast.error("Internal Server Error")
                console.log(error)
            } finally {
                set({ isMessagesLoading: false })
            }
        },
        sendMessage: async (messageData) => {
            const { selectedContact, messages } = get()
            try {
                const res = await axiosInstance.post(`/messages/send/${selectedContact._id}`, messageData)
                set({ messages: [...messages, res.data] })
                set({ isRead: false })

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
                if (selectedContact && newMessage.senderId === selectedContact._id) {
                    set({
                        messages: [...messages, newMessage],
                    });
                    axiosInstance.get(`/messages/markAsRead/${selectedContact._id}`)
                    console.log("newMessage event received")
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
            const { selectedContact, isRead } = get()
            socket.on("messageRead", () => {
                if (selectedContact) set({ isRead: true })
                console.log("messageRead event received")
            })
        },

        unsubscribeFromRead: () => {
            const socket = useAuthStore.getState().socket
            socket.off("messageRead")
        },


        // the selectedContact is the User Object as in Mongo of the chatUer currently selected
        setSelectedContact: (selectedContact) => {
            set({ selectedContact })
            axiosInstance.get(`/messages/markAsRead/${selectedContact._id}`)
        }


    }
))