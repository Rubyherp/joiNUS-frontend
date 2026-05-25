import { createContext, useState } from "react";
import EmptyPasswordError from "@/customError/emptyPasswordError";
import EmailError from "@/customError/emailError";

export const UserContext = createContext();

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const initialState = {
    email: '',
    password: '',
}

const validEmail = (email) => {
    const nusRegex = /^e\d{7}@u\.nus\.edu$/i;
    return nusRegex.test(email);
}

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [showProfileSetup, setShowProfileSetup] = useState(false);
    const [profile, setProfile] = useState(null);

    async function register(details = initialState) {
        const { email, password } = details;

        if (!validEmail(email)) {
            throw new EmailError();
        }
        if (!password) {
            throw new EmptyPasswordError();
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details)
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }
            return data;
        } catch (error) {
            throw error;
        }

    }

    async function login(details = initialState) {
        const { email, password } = details;

        if (!validEmail(email)) {
            throw new EmailError();
        }
        if (!password) {
            throw new EmptyPasswordError();
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details)
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            setUser(data.user);
            setToken(data.token);

            //FIX: fixed fetch only when profile exists
            if (!data.hasProfile) {
                setShowProfileSetup(true);
            } else {
                await fetchProfile(data.token);

            }

            return data;
        } catch (error) {
            throw error;
        }

    }

    const logout = () => {
        setUser(null);
        setToken(null);
    }

    async function profileCreation(payload) {
        try {
            const response = await fetch(`${API_URL}/profileCreation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload)
            })
            console.log('token from creation: ', token);

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Profile creation failed')
            }
            await fetchProfile();
            setShowProfileSetup(false);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async function fetchProfile(access_token) {
        try {
            //fking hell this header pural took me 30 mins to find
            const response = await fetch(`${API_URL}/profile`, {
                headers: { 'Authorization': `Bearer ${access_token ?? token}` }
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch User Profile');
            }

            console.log(data);
            setProfile(data);
        } catch (error) {
            throw error;
        }
    }

    return (
        <UserContext.Provider
            value={{
                user,
                token,
                register,
                login,
                logout,
                showProfileSetup,
                profileCreation,
                fetchProfile,
                profile,
            }}>
            {children}
        </UserContext.Provider>
    )
}


