import React, { useEffect, useState } from 'react'
import { useDeckStore } from '../../store/useDeckStore'
import { Check, ChevronLeft, EllipsisVertical, Filter } from 'lucide-react'

const DecksPage = () => {
    const { addDeck, getDecks, decks, editDeck, deleteDeck, selectedDeck, setSelectedDeck, createFlashcard, getCards } = useDeckStore()

    const [newDeck, setNewDeck] = useState(null)
    const [editingDeck, setEditingDeck] = useState(null)
    const [deletingDeck, setDeletingDeck] = useState(null)
    const [deleteConfirmation, setDeleteConfirmation] = useState('')
    const [isFilterexpanded, setIsFilterExpanded] = useState(false)
    const [cards, setCards] = useState([])
    const [filter, setFilter] = useState({ searchString: '', })

    const [newFlashcard, setNewFlashcard] = useState({ word: '', translation: '', comment: '', definition: '' })


    const colorOptions = [
        { value: '#94a3b8', label: 'Slate' },
        { value: '#f87171', label: 'Red' },
        { value: '#fb923c', label: 'Orange' },
        { value: '#fbbf24', label: 'Amber' },
        { value: '#4ade80', label: 'Green' },
        { value: '#60a5fa', label: 'Blue' },
        { value: '#818cf8', label: 'Indigo' },
        { value: '#c084fc', label: 'Purple' },
        { value: '#e879f9', label: 'Pink' },
    ];

    const handleCreateDeckSubmit = async (e) => {
        e.preventDefault()
        console.log(newDeck)
        await addDeck(newDeck)
        setNewDeck(null)
        document.getElementById('addDeckModal').close()
    }

    const handleEditDeckSubmit = async (e) => {
        e.preventDefault()
        await editDeck(editingDeck)
        setEditingDeck(null)
        document.getElementById('editDeckModal').close()
    }

    const handleDeleteDeckSubmit = async (e) => {
        e.preventDefault()
        if (deleteConfirmation === deletingDeck.title) {
            await deleteDeck(deletingDeck._id)
            setDeletingDeck(null)
            setDeleteConfirmation('')
            document.getElementById('deleteDeckModal').close()
        }
    }

    const handleCreateFlashcardSubmit = async (e) => {
        e.preventDefault()
        const newFlashcardFromDB = await createFlashcard(selectedDeck._id, newFlashcard)
        setNewFlashcard({ word: '', translation: '', comment: '', definition: '' })
        setCards([...cards, newFlashcardFromDB])
        document.getElementById('createFlashcardModal').close()
    }
    const handleDeckSelect = async (deck) => {
        setSelectedDeck(deck)
        if (deck) {
            const fetchedCards = await getCards(deck)
            setCards(fetchedCards)
        } else {
            setCards([])
        }
    }

    const handleFilter = (newFilter) => {
        if (!selectedDeck) return
        const allCards = selectedDeck.cards || []

        // Filter by search string
        let filteredCards = allCards
        if (newFilter.searchString) {
            const searchString = newFilter.searchString.toLowerCase()
            filteredCards = filteredCards.filter(card =>
                card.word.toLowerCase().includes(searchString) ||
                card.translation.toLowerCase().includes(searchString)
            )
        }

        // Example of additional filters
        // if (newFilter.difficulty !== 'all') {
        //     filteredCards = filteredCards.filter(card =>
        //         card.difficulty === newFilter.difficulty
        //     )
        // }

        setCards(filteredCards)
    }
    useEffect(() => {
        if (!selectedDeck) getDecks()
        console.log("test")
    }, [selectedDeck, getDecks])

    return (
        <div className="h-100dvh bg-base-200 overflow-hidden w-full">
            <div className="flex items-center justify-center pt-18">
                <div className="overflow-y-scroll bg-base-100 rounded-2xl w-full max-w-6xl h-[calc(100dvh-6rem)] flex flex-col items-center " >
                    {selectedDeck ?
                        <div className='w-full flex flex-col items-center'>
                            <div className='w-full relative py-3 shadow-lg' style={{ backgroundColor: selectedDeck.color ? selectedDeck.color + '95' : undefined, }}>
                                <button onClick={() => handleDeckSelect(null)} className="btn btn-ghost absolute left-4 ">
                                    <ChevronLeft />Decks
                                </button>
                                <h1 className="text-2xl font-semibold justify-self-center mt-2 text-center">{selectedDeck.title}</h1>
                            </div>

                            <div role="tablist" className="tabs tabs-bordered justify-center w-full mt-6">
                                <input type="radio" name="my_tabs_1" role="tab" className="tab w-25" aria-label="Flashcards" />
                                <div role="tabpanel" className="tab-content p-10 ">
                                    <div className='flex flex-col items-center'>
                                        <button className='btn btn-accent w-full' onClick={() => document.getElementById("createFlashcardModal").showModal()}>Create New Card</button>

                                        <label className="w-full input input-bordered flex items-center gap-2 mt-2">
                                            <input
                                                type="text"
                                                className="grow"
                                                placeholder="Search"
                                                value={filter.searchString}
                                                onChange={(e) => {
                                                    const newFilter = {
                                                        ...filter,
                                                        searchString: e.target.value
                                                    }
                                                    setFilter(newFilter)
                                                    handleFilter(newFilter)
                                                }}
                                            />
                                            <button>
                                                <Filter />
                                            </button>

                                        </label>
                                        {cards?.map(card => (
                                            <button key={card._id} className='bg-base-300 w-full mt-2 '>
                                                <div className='text-base-content'> {card.word}</div>
                                                <div className=''> {card.translation}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <input type="radio" name="my_tabs_1" role="tab" className="tab w-25" aria-label="Review" defaultChecked />
                                <div role="tabpanel" className="tab-content p-10 w-full">Review</div>

                                <input type="radio" name="my_tabs_1" role="tab" className="tab w-25" aria-label="Stats" />
                                <div role="tabpanel" className="tab-content p-10">Stats</div>
                            </div>

                            <dialog id="createFlashcardModal" className='modal'>
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg mb-4">Create New Flashcardk</h3>
                                    <form onSubmit={handleCreateFlashcardSubmit} className="space-y-4">
                                        <div className='grid grid-cols-2 gap-4' onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleCreateFlashcardSubmit(e) }}>

                                            <label className="label">
                                                <span className="label-text">Word</span>
                                            </label>
                                            <label className="label">
                                                <span className="label-text">Translation</span>
                                            </label>
                                            <textarea
                                                style={{ resize: 'none' }}
                                                className="textarea textarea-bordered"
                                                value={newFlashcard.word}
                                                onChange={(e) => setNewFlashcard({ ...newFlashcard, word: e.target.value })}
                                                required
                                            />
                                            <textarea
                                                style={{ resize: 'none' }}
                                                className="textarea textarea-bordered"
                                                value={newFlashcard.translation}
                                                onChange={(e) => setNewFlashcard({ ...newFlashcard, translation: e.target.value })}
                                                required
                                            />

                                        </div>

                                        <div className="modal-action">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                Create Flashcard
                                            </button>
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() => {
                                                    document.getElementById('createFlashcardModal').close()
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>

                        </div> :
                        <div className='w-full flex flex-col items-center'>
                            <h1 className="text-2xl font-semibold mb-6 mt-6">Decks</h1>
                            {/* top buttons */}
                            <button className="btn btn-accent shadow-lg" onClick={() => document.getElementById('addDeckModal').showModal()}>
                                Add New Deck
                            </button>

                            {/* deck list */}
                            <div className='flex flex-col w-full max-w-6xl p-4  mt-6 rounded-xl items-center'>
                                {(decks.length === 0) && <div className=' text-zinc-500 mt-10 animate-pulse'>Create a deck to get started!</div>}
                                {decks.map(deck => (
                                    <div key={deck._id} className="flex justify-between w-full rounded-xl px-4 my-2 hover:bg-base-200" style={{ backgroundColor: deck.color }}>
                                        {/* left */}
                                        <button onClick={() => {
                                            handleDeckSelect(deck)
                                        }} className="w-full flex items-center justify-between">
                                            <h2 className="text-lg font-semibold">{deck.title}</h2>
                                            <span className='font-bold '>{deck.dueCardsCount}</span>

                                        </button>
                                        {/* right */}
                                        <div className="flex items-center ml-10">
                                            <div className="dropdown dropdown-bottom dropdown-end ">
                                                <label tabIndex={0} role="button" className="m-1"><EllipsisVertical /></label>
                                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                                    <li>
                                                        <button onClick={() => {
                                                            setEditingDeck(deck)
                                                            document.getElementById('editDeckModal').showModal()
                                                            document.activeElement.blur()
                                                        }}>
                                                            Edit
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className='text-red-600'
                                                            onClick={() => {
                                                                setDeletingDeck(deck)
                                                                document.getElementById('deleteDeckModal').showModal()
                                                                document.activeElement.blur()
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                            {/* Add Modal */}
                            <dialog id="addDeckModal" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg mb-4">Create New Deck</h3>
                                    <form onSubmit={handleCreateDeckSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className="label">
                                                <span className="label-text">Title</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input input-bordered"
                                                value={newDeck?.title}
                                                onChange={(e) => setNewDeck({ ...newDeck, title: e.target.value })}
                                                required
                                            />
                                            <label className="label">
                                                <span className="label-text">Description</span>
                                            </label>
                                            <textarea
                                                className="textarea textarea-bordered"
                                                value={newDeck?.description}
                                                onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
                                            />
                                        </div>

                                        <div className="flex gap-2 flex-wrap">
                                            {colorOptions.map((color) => (
                                                <button key={color.value} type='button' className={`w-8 h-8 rounded-full transition-all ${newDeck?.color === color.value ? 'ring-2 ring-offset-2 ring-base-content' : ''
                                                    }`}
                                                    onClick={() => setNewDeck({ ...newDeck, color: color.value })} style={{ backgroundColor: color.value }}>

                                                </button>
                                            ))}
                                        </div>
                                        <div className="modal-action">
                                            <button type="submit" className="btn btn-primary">
                                                Create Deck
                                            </button>
                                            <button type="button" className="btn" onClick={() => {
                                                setNewDeck(null)
                                                document.getElementById('addDeckModal').close()
                                            }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>

                            {/* Edit Modal */}
                            <dialog id="editDeckModal" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg mb-4">Edit Deck</h3>
                                    <form onSubmit={handleEditDeckSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className="label">
                                                <span className="label-text">Title</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input input-bordered"
                                                value={editingDeck?.title || ''}
                                                onChange={(e) => setEditingDeck({ ...editingDeck, title: e.target.value })}
                                                required
                                            />
                                            <label className="label">
                                                <span className="label-text">Description</span>
                                            </label>
                                            <textarea
                                                className="textarea textarea-bordered"
                                                value={editingDeck?.description || ''}
                                                onChange={(e) => setEditingDeck({ ...editingDeck, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {colorOptions.map((color) => (
                                                <button key={color.value} type='button' className={`w-8 h-8 rounded-full transition-all ${editingDeck?.color === color.value ? 'ring-2 ring-offset-2 ring-base-content' : ''
                                                    }`}
                                                    onClick={() => setEditingDeck({ ...editingDeck, color: color.value })} style={{ backgroundColor: color.value }}>

                                                </button>
                                            ))}
                                        </div>
                                        <div className="modal-action">
                                            <button type="submit" className="btn btn-primary">
                                                Save Changes
                                            </button>
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() => {
                                                    setEditingDeck(null)
                                                    document.getElementById('editDeckModal').close()
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>

                            {/* Delete Modal */}
                            <dialog id="deleteDeckModal" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg mb-4">Delete Deck</h3>
                                    <form onSubmit={handleDeleteDeckSubmit} className="space-y-4">
                                        <p className="text-sm">
                                            This action cannot be undone. Please type <span className="font-bold">{deletingDeck?.title}</span> to confirm.
                                        </p>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full"
                                            value={deleteConfirmation}
                                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                                            placeholder="Type deck name to confirm"
                                            required
                                        />
                                        <div className="modal-action">
                                            <button
                                                type="submit"
                                                className="btn btn-error"
                                                disabled={deleteConfirmation !== deletingDeck?.title}
                                            >
                                                Delete Deck
                                            </button>
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() => {
                                                    setDeletingDeck(null)
                                                    setDeleteConfirmation('')
                                                    document.getElementById('deleteDeckModal').close()
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>
                        </div>}
                </div>
            </div>
        </div>
    )
}

export default DecksPage
