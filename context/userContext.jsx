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

            if (!data.hasProfile) {
                setShowProfileSetup(true);
            }

            setUser(data.user);
            setToken(data.token);
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
            console.log('token: ', token);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Profile creation failed')
            }

            setShowProfileSetup(false);
            return true;
        } catch (error) {
            throw error;
        }
    }

    return (
        <UserContext.Provider value={{ user, token, register, login, logout, showProfileSetup, profileCreation }}>
            {children}
        </UserContext.Provider>
    )
}


