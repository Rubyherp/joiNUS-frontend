import { createContext } from 'react';
import { useContext } from 'react';
import { UserContext } from './userContext';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
export const PostContext = createContext();

export function PostProvider({ children }) {
    const { token } = useContext(UserContext);

    async function fetchPosts() {
        try {
            const response = await fetch(`${API_URL}/posts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch posts');
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    async function createPost(content) {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(content),
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to create Post");
        }

        return data;
    }

    async function uploadPostImage(formData) {
        const response = await fetch(`${API_URL}/uploadPostImage`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to upload Image");
        }

        return data.imageUrl;
    }

    return (
        <PostContext.Provider value={{ fetchPosts, createPost, uploadPostImage }}>
            {children}
        </PostContext.Provider>
    )
}


