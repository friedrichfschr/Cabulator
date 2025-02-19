import { X } from "lucide-react";
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
                <div
                    className="flex items-center gap-3 p-2.5 ml-2.5 w-full hover:text-faint"
                    onClick={() => navigate(`/profile/${selectedContact.Username}`)}
                >
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedContact.profilePic || "/avatar.png"} alt={selectedContact.Username} />
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium text-base-content">{selectedContact.Username}</h3>
                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedContact._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/* Close button */}
                <button
                    className="btn btn-ghost mr-2.5"
                    onClick={() => {
                        getMessages(selectedContact._id);
                        setSelectedContact(null);
                    }}
                >
                    <X />
                </button>
            </div>
        </div>
    );
};
export default ChatHeader;