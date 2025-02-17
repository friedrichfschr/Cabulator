import { X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

const ChatHeader = () => {
    const { selectedContact, setSelectedContact, getMessages } = useChatStore();
    const { onlineContacts } = useAuthStore();

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedContact.profilePic || "/avatar.png"} alt={selectedContact.Username} />
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium">{selectedContact.Username}</h3>
                        <p className="text-sm text-base-content/70">
                            {onlineContacts.includes(selectedContact._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/* Close button */}
                <button onClick={() => {
                    getMessages(selectedContact._id)
                    setSelectedContact(null)
                }}>
                    <X />
                </button>
            </div>
        </div>
    );
};
export default ChatHeader;