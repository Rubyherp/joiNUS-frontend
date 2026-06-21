import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { UserContext } from './userContext';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
export const PostContext = createContext();

export function PostProvider({ children }) {
    const { token } = useContext(UserContext);
    const [savedPostIds, setSavedPostIds] = useState(new Set());

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
        const response = await fetch(`${API_URL}/posts/uploadPostImage`, {
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
        const response = await fetch(`${API_URL}/posts/fetchPostById/${postId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch Post");
        }

        return data;
    }

    async function fetchPostsByUserId(userId) {
        const response = await fetch(`${API_URL}/posts/fetchPostsByUserId/${userId}`, {
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

    useEffect(() => {
        if (!token) {
            return;
        }
        fetchSavedPosts()
            .then(data => {
                setSavedPostIds(new Set(data.map(row => row.post_id)));
            });
    }, [token]);

    async function savePost(postId) {
        const response = await fetch(`${API_URL}/posts/${postId}/save`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to save Post");
        }

        setSavedPostIds(prev => new Set(prev).add(postId))
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

        setSavedPostIds(prev => {
            const saved = new Set(prev);
            saved.delete(postId);
            return saved;
        })
        return data;
    }

    async function requestJoin(postId, message) {
        const response = await fetch(`${API_URL}/posts/${postId}/request`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to send join request");
        }

        return data;
    }

    async function requestStatus(postId) {
        const response = await fetch(`${API_URL}/posts/${postId}/request/status`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch request status");
        }

        return data;
    }

    async function fetchPendingRequests(postId) {
        const response = await fetch(`${API_URL}/posts/${postId}/requests/pending`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch pending requests ");
        }

        return data;
    }

    async function fetchAcceptedRequests(postId) {
        const response = await fetch(`${API_URL}/posts/${postId}/requests/accepted`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch accepted requests ");
        }

        return data;
    }


    //TODO: Possible to add rejection message to user
    async function handlePendingRequest(requestId, status) {
        const response = await fetch(`${API_URL}/posts/requests/${requestId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Failed to ${status == "accepted" ? "accept" : "reject"} request`);
        }

        return data;
    }

    async function deletePostById(postId) {
        console.log('Deleting post:', postId);
        console.log('DELETE URL:', `${API_URL}/posts/delete/${postId}`);
        const response = await fetch(`${API_URL}/posts/delete/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const text = await response.text();
        console.log('Delete response status:', response.status);
        console.log('Delete response body:', text);

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            throw new Error(`Server returned non-JSON response (status ${response.status})`);
        }

        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete Post');
        }

        return data;

        // const data = await response.json();
        //
        // if (!response.ok) {
        //     throw new Error(data.error || 'Failed to delete Post');
        // }
        //
        // return data;
    }

    return (
        <PostContext.Provider value={{
            fetchPosts,
            createPost,
            uploadPostImage,
            fetchPostById,
            fetchPostsByUserId,
            fetchSavedPosts,
            savePost,
            unsavePost,
            requestJoin,
            requestStatus,
            fetchPendingRequests,
            fetchAcceptedRequests,
            handlePendingRequest,
            deletePostById,
            savedPostIds,
        }}>
            {children}
        </PostContext.Provider>
    )
}


