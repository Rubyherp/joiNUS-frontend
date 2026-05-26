import { createContext, useState } from "react";
import EmptyPasswordError from "@/customError/emptyPasswordError";
import EmailError from "@/customError/emailError";
import * as ImagePicker from "expo-image-picker";

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
            const response = await fetch(`${API_URL}/profile`, {
                headers: { 'Authorization': `Bearer ${access_token ?? token}` }
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch User Profile');
            }
            console.log(data);
            setProfile(data);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async function changeAvatar() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled) {
            return;
        }

        console.log('Image Picker: ', result);
        const image = result.assets[0];
        const formData = new FormData();
        formData.append("avatar", {
            uri: image.uri,
            name: `${user.id}.jpg`,
            type: "image/jpeg"
        });

        try {
            const response = await fetch(`${API_URL}/changeAvatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            })

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to change Avatar");
            }
            const newProfile = await fetchProfile();
            return newProfile;
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
                changeAvatar,
            }}>
            {children}
        </UserContext.Provider>
    )
}


