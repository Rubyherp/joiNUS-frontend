import { createContext, useContext, useCallback } from 'react'
import { UserContext } from './userContext';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
export const ChatContext = createContext();

export function ChatProvider({ children }) {
    const { user, token } = useContext(UserContext);

    async function fetchChatHistory(otherUserId) {
        const response = await fetch(`${API_URL}/chats/dm/${otherUserId}/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch Chat History');
        }

        return data;
    }

    const loadConversations = useCallback(async () => {
        const response = await fetch(`${API_URL}/chats/conversations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load conversations');
        }

        return data;

    }, [token])

    const uploadAttachment = useCallback(async (attachment, otherUserId) => {
        const formData = new FormData();
        formData.append('file', {
            uri: attachment.uri,
            name: attachment.name || 'attachment',
            type: attachment.mimeType || attachment.type,
        })

        const response = await fetch(`${API_URL}/chats/upload/${otherUserId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to upload attachment');
        }

        return data;
    }, [token])

    return (
        <ChatContext.Provider value={{ fetchChatHistory, loadConversations, uploadAttachment }}>
            {children}
        </ChatContext.Provider>
    )
}
