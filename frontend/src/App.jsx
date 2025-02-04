import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"

import Navbar from './components/Navbar'

import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import MessagesPage from "./pages/MessagesPage"
import FlashcardsPage from "./pages/FlashcardsPage"
import ReaderPage from './pages/ReaderPage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'



const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()
  const { theme } = useThemeStore()

  console.log(onlineUsers)

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);


  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"></Loader>
    </div>
  )

  return (
    <div style={{ height: "100vh", overflow: "auto" }} data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />

        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />

        <Route pat h="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/messages" element={authUser ? <MessagesPage /> : <Navigate to="/login" />} />
        <Route path="/flashcards" element={authUser ? <FlashcardsPage /> : <Navigate to="/login" />} />
        <Route path="/reader" element={authUser ? <ReaderPage /> : <Navigate to="/login" />} />

      </Routes>
      <Toaster />
    </div >
  )
}

export default App