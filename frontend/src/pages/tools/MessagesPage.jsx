import React from 'react'
import { useChatStore } from '../../store/useChatStore'
import Sidebar from '../../components/messages/Sidebar';
import NoChatSelected from '../../components/messages/NoChatSelected';
import ChatContainer from '../../components/messages/ChatContainer';

const HomePage = () => {
    const { selectedContact, } = useChatStore();

    return (

        <div className="h-100dvh bg-base-200 overflow-hidden">
            <div className="flex items-center justify-center pt-20 px-4">

                <div className="overflow-hidden bg-base-100 rounded-lg shadow-cl w-full max-w-6xl mt-2 h-[calc(100dvh-6rem)] ">
                    {!selectedContact && <div className="flex h-full rounded-lg overflow-hidden">

                        <Sidebar />
                        <NoChatSelected />
                    </div>}
                    {selectedContact && <ChatContainer />}
                </div>
            </div>
        </div>

    )
}

export default HomePage