import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useDeckStore = create((set, get) => ({
    decks: [],
    selectedDeck: null,
    setSelectedDeck: (deck) => set({ selectedDeck: deck }),
    dueCards: [],

    addDeck: async (deck) => {
        try {
            const { data } = await axiosInstance.post('/decks/create', deck);
            set((state) => ({
                decks: [...state.decks, data]
            }));
            console.log(get().decks);
            toast.success('Deck created successfully');
        } catch (error) {
            console.error("Error in creating deck:", error);
            toast.error(error.response?.data?.message || 'Failed to create deck');
        }
    },
    editDeck: async (updatedDeck) => {
        try {
            const res = await axiosInstance.put(`/decks/update/${updatedDeck._id}`, updatedDeck);
            set((state) => ({
                decks: state.decks.map((d) => d._id === updatedDeck._id ? res.data : d)
            }));
            toast.success('Deck updated successfully');
        } catch (error) {
            console.error("Error in updating deck:", error);
            toast.error(error.response?.data?.message || 'Failed to update deck');
        }
    },
    deleteDeck: async (deckId) => {
        try {
            await axiosInstance.delete(`/decks/delete/${deckId}`);
            set((state) => ({
                decks: state.decks.filter((d) => d._id !== deckId)
            }));
            toast.success('Deck deleted successfully');
        } catch (error) {
            console.error("Error in deleting deck:", error);
            toast.error(error.response?.data?.message || 'Failed to delete deck');
        }
    },

    getDecks: async () => {
        try {
            const res = await axiosInstance.get('/decks');
            set({
                decks: res.data
            });
        } catch (error) {
            console.log("Error in getting Deck", error)
            toast.error(error.response.data.message)
        }
    },

    getDueCards: async (deckId) => {
        try {
            const res = await axiosInstance.get(`/decks/due-cards/${deckId}`);
            set({ dueCards: res.data });
            return res.data;
        } catch (error) {
            console.error("Error in getting due cards:", error);
            toast.error(error.response?.data?.message || 'Failed to get due cards');
        }
    },




    getCards: async (deck) => {
        const res = await axiosInstance.get(`/decks/flashcards/${deck._id}`)
        set((state) => {
            const updatedDeck = {
                ...state.selectedDeck,
                cards: res.data
            };
            return {
                selectedDeck: updatedDeck,
                decks: state.decks.map(d => d._id === deck._id ? updatedDeck : d)
            };
        });
        return res.data;
    },

    createFlashcard: async (deckId, card) => {
        try {
            const res = await axiosInstance.post(`/decks/flashcards/create/${deckId}`, card);

            set((state) => {
                const updatedDeck = {
                    ...state.selectedDeck,
                    cards: [...(state.selectedDeck.cards || []), res.data]
                };
                return {
                    selectedDeck: updatedDeck,
                    decks: state.decks.map(d => d._id === deckId ? updatedDeck : d)
                };
            });
            toast.success('Flashcard created successfully');
            return res.data
        } catch (error) {
            console.error("Error in creating flashcard:", error);
            toast.error(error.response?.data?.message || 'Failed to create flashcard');
        }
    },
}));