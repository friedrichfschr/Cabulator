import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link, useNavigate } from 'react-router-dom'

import { Earth, LogOut, MessageSquare, Settings, User } from 'lucide-react'

const Navbar = () => {
    const navigate = useNavigate();

    const { logout, authUser } = useAuthStore()
    return (
        <header
            className=" border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80 overflow-visible"
        >
            <div className='container mx-auto px-4 h-16'>
                <div className='flex items-center justify-between h-full'>
                    {/* LEFT */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Earth className="w-5 h-5 text-primary" />
                            </div>
                            <h1 className="text-lg font-bold">Cabulator</h1>
                        </Link>
                        <div className="dropdown dropdown-hover">
                            <div tabIndex={0} role="button" className="btn m-1">Tools</div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                <li onClick={(e) => navigate("/flashcards")}><a>Flashcards</a></li>
                                <li onClick={(e) => navigate("/reader")}><a>Reader</a></li>
                                <li onClick={(e) => navigate("/messages")}><a>Messages</a></li>
                            </ul>
                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className='flex items-center gap-2'>


                        {authUser && (
                            <>
                                <Link
                                    to={"/settings"}
                                    className={`
                                btn btn-sm gap-2 transition-colors`}>

                                    <Settings className="w-4 h-4" />
                                    <span className="hidden sm:inline">Settings</span>
                                </Link>
                                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                                    <User className="size-5" />
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>

                                <button className="flex gap-2 items-center" onClick={logout}>
                                    <LogOut className="size-5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </header>
    )
}

export default Navbar