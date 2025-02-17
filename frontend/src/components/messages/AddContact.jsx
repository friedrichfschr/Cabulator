import React, { useEffect, useState } from 'react'
import { Loader, Search, UserPlus, X } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';

const AddContact = () => {


    const [showSearch, setShowSearch] = useState(false)
    const [text, setText] = useState("");

    const { onlineUsers } = useAuthStore()
    const { users, getUsers, setContact, isUsersLoading, searchAndSetUsers, filteredUsers, setSearchString } = useChatStore()

    useEffect(() => {
        getUsers()
    }, [getUsers])

    useEffect(() => {
        searchAndSetUsers()
    }, [searchAndSetUsers])

    const shownUsers = showSearch ? filteredUsers : users

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSearchString(text)
        setShowSearch(true)
        searchAndSetUsers(text)
    };


    return (
        <div className='p-5'>
            <button className="btn" onClick={() => document.getElementById('addContactId').showModal()}>Add Contact</button>
            <dialog id="addContactId" className="modal">
                <div className="modal-box ">
                    <form method="dialog" >
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 size-"><X size={18}></X></button>
                    </form>
                    <h3 className="font-bold text-lg">Users</h3>


                    <form className='flex items-center gap-2 mt-4 m-2' onSubmit={handleFormSubmit}>
                        <input type="text"
                            id="addContactSearch"
                            className='input input-bordered rounded-lg input-sm grow'
                            placeholder='search users...'
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value)
                                if (showSearch) {
                                    setShowSearch(false)
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Backspace' && showSearch) {
                                    setText("");
                                    setShowSearch(false)
                                }
                            }
                            }
                        />

                        <button type='submit'

                            className="btn btn-sm btn-circle m-2"
                            disabled={!text.trim()}
                            onClick={handleFormSubmit}
                        >
                            <Search />
                        </button>
                    </form>

                    {isUsersLoading ?
                        <div className="flex items-center justify-center h-120">
                            <Loader className="size-10 animate-spin"></Loader>
                        </div> :
                        <div className='mt-2 overflow-y-auto w-full py-3 h-120 justify-center'>
                            {shownUsers.map((user) => (
                                <div key={user._id} className='flex items-center gap-3 hover:bg-base-300 transition-colors p-3 rounded-xl'>
                                    <div className=" block relative ">
                                        <img
                                            src={user.profilePic || "/avatar.png"}
                                            alt={user.name}
                                            className="size-12 object-cover rounded-full"
                                        />
                                        {onlineUsers.includes(user._id) && (
                                            <span
                                                className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                                            />
                                        )}
                                    </div>

                                    <div className="block text-left min-w-0">
                                        <div className="font-medium truncate">{user.Username}</div>
                                        <div className="text-sm text-zinc-400">
                                            {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                        </div>
                                    </div>

                                    <button className='btn  ml-auto mr-3' onClick={() => {
                                        setContact(user._id)
                                    }}>
                                        <UserPlus size={20} />
                                    </button>
                                </div>

                            ))}
                            {shownUsers.length == 0 &&
                                <div className='justify-self-center mt-5 text-zinc-500'>
                                    No users found
                                </div>
                            }
                        </div>
                    }


                </div>
                <form method="dialog" className="modal-backdrop">
                    <button >close</button>
                </form>
            </dialog >
        </div >
    )
}

export default AddContact