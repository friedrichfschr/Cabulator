import { format, isToday, isYesterday } from 'date-fns';

export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export function formatDate(date) {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, 'MMMM d, yyyy');
}

export const formatMessageTimestampForSidebar = (timestamp) => {
    if (!timestamp) return "";

    const messageDate = new Date(timestamp);

    if (isToday(messageDate)) {
        return format(messageDate, 'HH:mm');
    } else if (isYesterday(messageDate)) {
        return "Yesterday";
    } else {
        return format(messageDate, 'MMM d');
    }
};

export const truncateMessage = (message, maxLength = 45) => {
    if (!message) return '';
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
};