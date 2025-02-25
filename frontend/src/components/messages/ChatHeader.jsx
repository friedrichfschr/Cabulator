import { ChevronLeft } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
    const { selectedContact, setSelectedContact, getMessages } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const navigate = useNavigate();

    return (
        <div className="border-b border-base-300 mb-1">
            <div className="flex items-center justify-between">

                {/* Close button */}
                <button
                    className="btn btn-ghost ml-2.5"
                    onClick={() => {
                        getMessages(selectedContact._id);
                        setSelectedContact(null);
                    }}
                >
                    <ChevronLeft />
                </button>
                <div
                    className="flex items-center gap-3 p-2.5 mr-2.5 w-full hover:text-faint"
                    onClick={() => navigate(`/profile/${selectedContact.Username}`)}
                >
                    {/* Avatar */}
                    <div className="avatar size-11 items-center">
                        <div className="size-11 relative">
                            <img src={selectedContact.profilePic || "/avatar.png"} alt={selectedContact.Username} className="rounded-full" />
                            {onlineUsers.includes(selectedContact._id) && (
                                <span
                                    className="absolute bottom-1 right-1 size-2 bg-green-500 
                  rounded-full ring-1 ring-zinc-900"
                                />
                            )}
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium text-base-content">{selectedContact.Username}</h3>

                    </div>
                </div>


            </div>
        </div>
    );
};
export default ChatHeader;