import { createContext, useContext, useState } from 'react';
import { UserContext } from './userContext';

export const CommunityContext = createContext();

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export function CommunityProvider({ children }) {
    const { token } = useContext(UserContext);
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fetchCommunities() {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/communities`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch communities');
            }
            setCommunities(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchCommunityById(communityId) {
        const response = await fetch(`${API_URL}/fetchCommunityById/${communityId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch community details');
        }

        return data;
    }

    return (
        <CommunityContext.Provider value={{ fetchCommunities, fetchCommunityById, communities, loading, error }}>
            {children}
        </CommunityContext.Provider>
    )
}
