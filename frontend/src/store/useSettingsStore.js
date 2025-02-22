import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import { useAuthStore } from "./useAuthStore.js"
import toast from "react-hot-toast"

export const useSettingsStore = create((set, get) => ({
    settings: { sendReadReceipts: true, sendTypingIndicators: true, showOnline: true },
    isSettingsLoading: false,

    setSettings: (settings) => {
        set({ settings })
    },

    updateSettings: async (settings) => {
        set({ isSettingsLoading: true })
        const { updateSettingsLocally } = useAuthStore.getState()
        try {
            const res = await axiosInstance.put("/auth/settings", settings)
            updateSettingsLocally(settings)
            set({ settings: res.data })
            toast.success("Settings updated successfully")
        } catch (error) {
            console.log("error in updating settings: ", error)
            toast.error("Internal Server Error")
        } finally {
            set({ isSettingsLoading: false })
        }
    },
    getSettings: async () => {
        set({ isSettingsLoading: true })
        try {
            const res = await axiosInstance.get("/auth/settings")
            set({ settings: res.data })
        } catch (error) {
            console.log("error in getting settings: ", error)
        } finally {
            set({ isSettingsLoading: false })
        }
    }
}))