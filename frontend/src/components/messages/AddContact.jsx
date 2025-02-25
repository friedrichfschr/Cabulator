import React, { useEffect, useState } from 'react';
import { Loader, Search, UserPlus, X } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';

const AddContact = () => {
    const navigate = useNavigate();
    const { users, getUsers, setContact, isUsersLoading, searchAndSetUsers, filteredUsers, searchString, setSearchString } = useChatStore();
    const { onlineUsers } = useAuthStore();

    const [clearWholeSearchNext, setClearWholeSearchNext] = useState(false);
    const [text, setText] = useState(searchString);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    useEffect(() => {
        const wasModalOpen = localStorage.getItem('isModalOpen') === 'true';
        if (wasModalOpen) {
            setIsModalOpen(true);
        }
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            document.getElementById('addContactId').showModal();
        } else {
            document.getElementById('addContactId').close();
        }
    }, [isModalOpen]);

    const shownUsers = clearWholeSearchNext ? filteredUsers : users;

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchString(text);
        setClearWholeSearchNext(true);
        searchAndSetUsers();
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        localStorage.setItem('isModalOpen', 'false');
    };

    const handleAddContactClick = () => {
        setIsModalOpen(true);
        localStorage.setItem('isModalOpen', 'true');
    };

    return (
        <div className='p-5'>
            <button className="btn" onClick={handleAddContactClick}>Add Contact</button>
            <dialog id="addContactId" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleModalClose}>
                            <X size={18} />
                        </button>
                    </form>
                    <h3 className="font-bold text-lg">Users</h3>

                    <form className='flex items-center gap-2 mt-4 m-2' onSubmit={handleSearch}>
                        <input
                            type="text"
                            id="addContactSearch"
                            className='input input-bordered rounded-lg input-sm grow'
                            placeholder='search users...'
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value);
                                if (clearWholeSearchNext) {
                                    setClearWholeSearchNext(false);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Backspace' && clearWholeSearchNext) {
                                    setText("");
                                    setClearWholeSearchNext(false);
                                }
                            }}
                        />
                        <button
                            type='submit'
                            className="btn btn-sm btn-circle m-2"
                            disabled={!text.trim()}
                            onClick={handleSearch}
                        >
                            <Search />
                        </button>
                    </form>

                    {isUsersLoading ? (
                        <div className="flex items-center justify-center h-120">
                            <Loader className="size-10 animate-spin"></Loader>
                        </div>
                    ) : (
                        <div className='mt-2 overflow-y-auto w-full py-3 h-120 justify-center'>
                            {shownUsers.map((user) => (
                                <div key={user._id} className='flex items-center gap-3 hover:bg-base-300 transition-colors p-3 rounded-xl'>
                                    <div
                                        className='flex items-center gap-3  w-full'
                                        onClick={() => {
                                            setSearchString(text);
                                            navigate(`/profile/${user.Username}`);
                                        }}
                                    >
                                        <div className="block relative">
                                            <img
                                                src={user.profilePic || "/avatar.png"}
                                                alt={user.name}
                                                className="size-12 object-cover rounded-full"
                                            />
                                            {onlineUsers.includes(user._id) && (
                                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                                            )}
                                        </div>
                                        <div className="block text-left min-w-0">
                                            <div className="font-medium truncate">{user.Username}</div>
                                            <div className="text-sm text-zinc-400">
                                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                            </div>
                                        </div>
                                    </div>
                                    <button className='btn ml-auto mr-3' onClick={() => setContact(user._id)}>
                                        <UserPlus size={18} />
                                        Add
                                    </button>
                                </div>
                            ))}
                            {shownUsers.length === 0 && (
                                <div className='flex items-center justify-center mt-5 text-zinc-500'>
                                    No users found
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={handleModalClose}>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default AddContact;