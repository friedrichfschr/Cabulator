import React from 'react'
import { useChatStore } from '../../store/useChatStore'
import Sidebar from '../../components/Sidebar';
import NoChatSelected from '../../components/NoChatSelected';
import ChatContainer from '../../components/ChatContainer';

const HomePage = () => {
    const { selectedUser } = useChatStore();

    return (
        <div className="h-screen bg-base-200 overflow-hidden">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl mt-2 h-[calc(100dvh-8rem)] ">
                    {/*      max-[450px]:h-[calc(100dvh-8rem)]  */}
                    {!selectedUser && <div className="flex h-full rounded-lg overflow-hidden">

                        <Sidebar />
                        <NoChatSelected />
                    </div>}
                    {selectedUser && <div className=" h-full rounded-lg overflow-hidden"> <ChatContainer /></div>}
                </div>
            </div>
        </div>
    )
}

export default HomePage