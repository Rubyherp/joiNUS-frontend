import { createContext, useEffect, useState } from "react";
import EmptyPasswordError from "@/customError/emptyPasswordError";
import EmailError from "@/customError/emailError";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

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

    useEffect(() => {
        const restoreSession = async () => {
            try {

                const storedToken = await AsyncStorage.getItem('token');
                const storedUser = await AsyncStorage.getItem('user');

                if (!storedToken) {
                    return;
                }

                await fetchProfile(storedToken);

                setToken(storedToken);
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {

                setToken(null);
                setUser(null);
                setProfile(null);
                await AsyncStorage.multiRemove(['token', 'user']);
            }
        };
        restoreSession();
    }, []);

    async function sendOtp(email) {
        try {
            const response = await fetch(`${API_URL}/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to send OTP');
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

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
                throw new Error(data.error?.message || 'Registration failed');
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
                throw new Error(data.error?.message || 'Login failed');
            }

            setUser(data.user);
            setToken(data.token);
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));

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

    const logout = async () => {
        setToken(null);
        setUser(null);
        setProfile(null);
        await AsyncStorage.multiRemove(['token', 'user']);
    }

    // rename to profileSave
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
                throw new Error(data.error?.message || 'Profile creation failed')
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
                throw new Error(data.error?.message || 'Failed to fetch User Profile');
            }
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
                throw new Error(data.error?.message || "Failed to change Avatar");
            }
            const newProfile = await fetchProfile();
            return newProfile;
        } catch (error) {
            throw error;
        }
    }

    async function fetchUserDetails(userId) {
        try {
            const response = await fetch(`${API_URL}/fetchUserDetails/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Failed to fetch User Details");
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    async function fetchUserByUsername(username) {
        try {
            const response = await fetch(`${API_URL}/fetchUserByUsername/${username}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Failed to fetch User by Username");
            }

            return data;

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
                sendOtp,
                showProfileSetup,
                profileCreation,
                fetchProfile,
                profile,
                changeAvatar,
                fetchUserDetails,
                fetchUserByUsername,
            }}>
            {children}
        </UserContext.Provider>
    )
}


