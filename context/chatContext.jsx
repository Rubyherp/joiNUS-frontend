import { createContext, useContext, useCallback } from 'react'
import { UserContext } from './userContext';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
export const ChatContext = createContext();

export function ChatProvider({ children }) {
    const { token } = useContext(UserContext);

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

        // const raw = await response.text();
        // console.log('RAW RESPONSE:', raw);
        // const data = JSON.parse(raw);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load conversations');
        }

        return data;

    }, [token])

    return (
        <ChatContext.Provider value={{ fetchChatHistory, loadConversations }}>
            {children}
        </ChatContext.Provider>
    )
}
