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
        searchString: [],

        setSearchString: (text) => {
            set({ searchString: text })
        },

        searchAndSetUsers: async () => {
            set({ isUsersLoading: true });
            const searchString = get().searchString;

            try {
                const res = await axiosInstance.post(`/messages/searchUsers/${searchString}`)
                set({ filteredUsers: res.data })
            } catch (error) {
            } finally {
                set({ isUsersLoading: false })
            }
        },

        getUsers: async () => {
            set({ isUsersLoading: true });
            try {
                const res = await axiosInstance.get("/messages/users")
                set({ users: res.data })
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
            set({ isContactsLoading: true });
            try {
                const res = await axiosInstance.get("/auth/contacts")
                set({ contacts: res.data })
            } catch (error) {
                toast.error("Internal Server Error")
                console.log(error)

            } finally {
                set({ isContactsLoading: false })
            }
        },

        getMessages: async (userId) => {
            set({ isMessagesLoading: true });
            try {
                const res = await axiosInstance.get(`/messages/${userId}`)
                set({ messages: res.data });
            } catch (error) {
                toast.error("Internal Server Error")
            } finally {
                set({ isMessagesLoading: false })
            }
        },
        sendMessage: async (messageData) => {
            const { selectedContact, messages } = get()
            try {
                const res = await axiosInstance.post(`/messages/send/${selectedContact._id}`, messageData)
                set({ messages: [...messages, res.data] })
            } catch (error) {
                toast.error(error.response.data.message);
            }
        },

        subscribeToMessages: () => {
            const { selectedContact } = get();
            if (!selectedContact) return;

            const socket = useAuthStore.getState().socket;


            socket.on("newMessage", (newMessage) => {

                // check if the user is selected at the moment they send a message
                // otherwise the message would appear in the wrong chat temporarily until page is refreshed
                if (newMessage.senderId !== selectedContact._id) return;

                set({
                    messages: [...get().messages, newMessage],
                })
            })
        },

        unsubscribeFromMessages: () => {
            const socket = useAuthStore.getState().socket
            socket.off("newMessage")
        },

        setSelectedContact: (selectedContact) => set({ selectedContact }),




    }
))