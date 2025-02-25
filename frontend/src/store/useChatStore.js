import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore"
import { useSettingsStore } from "./useSettingsStore";

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
        hasMoreMessages: true,
        currentPage: 1,
        isLoadingMore: false,

        getReadState: async (selectedContact) => {
            const { authUser } = useAuthStore.getState();
            try {
                const res = await axiosInstance.get(`/messages/getUnreadCount/${selectedContact}`)
                if (authUser.settings.sendReadReceipts == true) {
                    set({ isRead: (res.data === 0) })
                }

            } catch (error) {
                toast.error("Internal Server Error")
                console.log("error in getting read state: ", error)
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
                toast.error("Internal Server Error")
                console.log("error in searching users: ", error)
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
                console.log("error in getting users: ", error)
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
                console.log("error in setting contact: ", error)
            }
        },

        getContacts: async () => {
            set({ isContactsLoading: true });

            try {
                const res = await axiosInstance.get("/auth/contacts")
                if (res.data) set({ contacts: res.data })
                else set({ contacts: [] })
                return res.data
            } catch (error) {
                toast.error("Internal Server Error")
                console.log("error in getting contacts: ", error)

            } finally {
                set({ isContactsLoading: false })
            }
        },

        getMessages: async (selectedContactId, page = 1) => {
            if (page === 1) {
                set({ isMessagesLoading: true });
            } else {
                set({ isLoadingMore: true });
            }

            try {
                const res = await axiosInstance.get(
                    `/messages/${selectedContactId}?page=${page}&limit=30`
                );

                if (page === 1) {
                    set({
                        messages: res.data.messages,
                        hasMoreMessages: res.data.pagination.hasMore,
                        currentPage: page
                    });
                } else {
                    set(state => ({
                        messages: [...res.data.messages, ...state.messages],
                        hasMoreMessages: res.data.pagination.hasMore,
                        currentPage: page
                    }));
                }
            } catch (error) {
                toast.error("Error loading messages");
                console.log("error in getting message: ", error);
            } finally {
                set({
                    isMessagesLoading: false,
                    isLoadingMore: false
                });
            }
        },

        loadMoreMessages: async () => {
            const { selectedContact, currentPage, hasMoreMessages, isLoadingMore } = get();

            if (!hasMoreMessages || isLoadingMore) return;

            await get().getMessages(selectedContact._id, currentPage + 1);
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
                console.log("error in sending message: ", error)
            }
        },

        subscribeToMessages: () => {
            const socket = useAuthStore.getState().socket;

            socket.on("newMessage", (newMessage) => {
                const { selectedContact, contacts, messages, getContacts } = get();

                // Handle messages from currently selected contact
                if (newMessage.senderId === selectedContact?._id) {
                    set({
                        messages: [...messages, newMessage],
                    });

                    const authUser = useAuthStore.getState().authUser;
                    if (useSettingsStore.getState().settings.sendReadReceipts) {
                        socket.emit("markAsRead", selectedContact._id, authUser._id);
                    }
                } else {
                    let newMessageSenderIsContact = false;
                    let messageAdder = 1;
                    const updatedContacts = contacts.map((contact) => {
                        if (contact._id === newMessage.senderId) {
                            newMessageSenderIsContact = true;
                            if (contact.newMessages === -1) messageAdder = 2
                            else messageAdder = 1
                            return {
                                ...contact,
                                newMessages: (contact.newMessages || 0) + messageAdder,
                                lastMessageTimestamp: Date.now(),
                                lastMessage: newMessage.text || "Image",
                            };
                        }
                        return contact;
                    });

                    // Handle message from new sender (not in contacts)
                    if (!newMessageSenderIsContact) {
                        getContacts().then(() => {
                            console.log("in then")
                            const newContact = get().contacts.find((contact) => contact._id === newMessage.senderId);
                            if (newContact) {
                                newContact.newMessages = 1;
                            }
                            const sortedContacts = [...updatedContacts, newContact].sort((a, b) =>
                                (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0)
                            );
                            set({ contacts: sortedContacts });

                        });

                    } else {
                        // Sort and update existing contacts
                        const sortedContacts = [...updatedContacts].sort((a, b) =>
                            (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0)
                        );
                        set({ contacts: sortedContacts });
                    }
                }
            });
        },

        unsubscribeFromMessages: () => {
            const socket = useAuthStore.getState().socket
            socket.off("newMessage")
        },

        subscribeToRead: () => {
            const { socket, authUser } = useAuthStore.getState();
            const { selectedContact } = get()
            socket.on("messageRead", (readBy) => {
                if ((selectedContact._id == readBy) && (authUser.settings.sendReadReceipts == true)) {
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
            const { authUser } = useAuthStore.getState()
            socket.on("startTyping", (senderId) => {
                if ((selectedContact?._id == senderId) && (authUser.settings.sendTypingIndicators == true)) {
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
                if (useSettingsStore.getState().settings.sendReadReceipts) {
                    socket.emit("markAsRead", selectedContact._id, authUser._id)
                }
                const { getReadState } = get();
                getReadState(selectedContact._id)

            }
        },
    }
))