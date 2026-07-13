import React from "react";
import { render, waitFor, act } from "@testing-library/react-native";
import { UserContext, UserProvider } from "@/context/userContext";

import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

function TestHarness({ onReady }) {
    const context = React.useContext(UserContext);
    React.useEffect(() => { onReady?.(context); }, [context]);
    return null;
}

describe("Session Persistence", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        AsyncStorage.clear();
        global.fetch = jest.fn();
    });

    it("saves token and user to AsyncStorage on successful login", async () => {
        global.fetch
            // login endpoint
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ token: "test-token", user: { id: "u1" }, hasProfile: true }),
            })
            // fetchProfile
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ username: "tester" }),
            });

        let loginFn;
        render(
            <UserProvider>
                <TestHarness onReady={({ login }) => { loginFn = login; }} />
            </UserProvider>
        );

        await act(async () => {
            await loginFn({ email: "e1234567@u.nus.edu", password: "pass" });
        });

        expect(AsyncStorage.setItem).toHaveBeenCalledWith("token", "test-token");
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            "user",
            JSON.stringify({ id: "u1" })
        );
    });

    it("clears token and user from AsyncStorage on logout", async () => {
        await AsyncStorage.setItem("token", "abc");
        await AsyncStorage.setItem("user", JSON.stringify({ id: "u1" }));

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ username: "tester" }),
        });

        let logoutFn;
        render(
            <UserProvider>
                <TestHarness
                    onReady={({ logout }) => { logoutFn = logout; }}
                />
            </UserProvider>
        );

        await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalled());

        await act(async () => {
            await logoutFn();
        });

        expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(["token", "user"]);
    });

    it("restores token and user from AsyncStorage on mount", async () => {
        await AsyncStorage.setItem("token", "saved-token");
        await AsyncStorage.setItem("user", JSON.stringify({ id: "u1", email: "t@nus.edu" }));

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ username: "restored", major: "CS" }),
        });

        let captured;
        render(
            <UserProvider>
                <TestHarness onReady={(ctx) => { captured = ctx; }} />
            </UserProvider>
        );

        await waitFor(() => {
            expect(captured.token).toBe("saved-token");
            expect(captured.user).toEqual({ id: "u1", email: "t@nus.edu" });
        });
    });

    it("clears session silently when stored token is expired", async () => {
        await AsyncStorage.setItem("token", "expired-token");
        await AsyncStorage.setItem("user", JSON.stringify({ id: "u1" }));

        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Invalid Token" }),
        });

        let captured;
        render(
            <UserProvider>
                <TestHarness onReady={(ctx) => { captured = ctx; }} />
            </UserProvider>
        );

        await waitFor(() => {
            expect(captured.token).toBeNull();
            expect(captured.user).toBeNull();
            expect(captured.profile).toBeNull();
        });

        expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(["token", "user"]);
    });

    it("starts clean when no session is stored", async () => {
        let captured;
        render(
            <UserProvider>
                <TestHarness onReady={(ctx) => { captured = ctx; }} />
            </UserProvider>
        );

        await waitFor(() => {
            expect(captured.token).toBeNull();
            expect(captured.user).toBeNull();
        });
    });
});
