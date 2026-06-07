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
            return data;
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

    async function fetchFollowedCommunities() {
        const response = await fetch(`${API_URL}/communities/following`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch following Communities');
        }

        return data;
    }

    async function followCommunity(communityId) {
        const response = await fetch(`${API_URL}/communities/${communityId}/follow`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to follow Community');
        }

        return data;
    }

    async function unfollowCommunity(communityId) {
        const response = await fetch(`${API_URL}/communities/${communityId}/follow`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to unfollow Community');
        }

        return data;
    }

    return (
        <CommunityContext.Provider value={{ fetchCommunities, fetchCommunityById, communities, loading, error, fetchFollowedCommunities, followCommunity, unfollowCommunity }}>
            {children}
        </CommunityContext.Provider>
    )
}
