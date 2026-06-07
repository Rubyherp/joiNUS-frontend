import { createContext, useContext, useCallback } from 'react';
import { UserContext } from './userContext';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
export const PostContext = createContext();

export function PostProvider({ children }) {
    const { token } = useContext(UserContext);

    const fetchPosts = useCallback(async function () {
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
    }, [token])

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

    async function fetchPostById(postId) {
        const response = await fetch(`${API_URL}/fetchPostById/${postId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch Post");
        }

        return data;
    }

    async function fetchSavedPosts() {
        const response = await fetch(`${API_URL}/posts/saved`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch saved Post");
        }

        return data;
    }

    async function savePost(postId) {
        const response = await fetch(`${API_URL}/posts/${postId}/save`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to save Post");
        }

        return data;
    }

    async function unsavePost(postId) {
        const response = await fetch(`${API_URL}/posts/${postId}/save`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to unsave Post");
        }

        return data;
    }


    return (
        <PostContext.Provider value={{ fetchPosts, createPost, uploadPostImage, fetchPostById, fetchSavedPosts, savePost, unsavePost }}>
            {children}
        </PostContext.Provider>
    )
}


