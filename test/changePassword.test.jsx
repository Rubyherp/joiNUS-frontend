import ChangePassword from "@/app/(tabs)/changePassword";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { UserContext } from "@/context/userContext";
import { Alert } from "react-native";

// Mock expo-router
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
    useRouter: () => ({ replace: mockReplace, back: jest.fn() }),
    Link: ({ children }) => children,
}));

//Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => { });

//Helper to render fake context
const renderChangePassword = (changePasswordFn, overrides = {}) => {
    return render(
        <UserContext.Provider value={{ changePassword: changePasswordFn, logout: jest.fn().mockResolvedValue(), ...overrides }}>
            <ChangePassword />
        </UserContext.Provider>
    );
};

describe("Change Password Screen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("calls changePassword with current and new password on submit", async () => {
        const mockChangePassword = jest.fn().mockResolvedValue();
        const { getByTestId } = renderChangePassword(mockChangePassword);

        fireEvent.changeText(getByTestId('current-password-input'), "oldpass123");
        fireEvent.changeText(getByTestId('new-password-input'), "newpass456");
        fireEvent.press(getByTestId('change-password-button'));

        await waitFor(() => {
            expect(mockChangePassword).toHaveBeenCalledWith("oldpass123", "newpass456");
        });
    });

    it("calls logout and redirects to /login on success", async () => {
        const mockLogout = jest.fn().mockResolvedValue();
        const { getByTestId } = renderChangePassword(jest.fn().mockResolvedValue(), { logout: mockLogout });

        fireEvent.changeText(getByTestId('current-password-input'), "oldpass123");
        fireEvent.changeText(getByTestId('new-password-input'), "newpass456");
        fireEvent.press(getByTestId('change-password-button'));

        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                "Success",
                "Your password has been changed. Please log in again.",
                expect.arrayContaining([
                    expect.objectContaining({
                        text: "OK",
                    })
                ])
            );
        });
    });

    it("shows alert on error", async () => {
        const mockChangePassword = jest.fn().mockRejectedValue(new Error("Password update failed"));
        const { getByTestId } = renderChangePassword(mockChangePassword);

        fireEvent.changeText(getByTestId('current-password-input'), "oldpass123");
        fireEvent.changeText(getByTestId('new-password-input'), "newpass456");
        fireEvent.press(getByTestId('change-password-button'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Password update failed");
        });
    });

    it("alerts when new password is too short", async () => {
        const mockChangePassword = jest.fn();
        const { getByTestId } = renderChangePassword(mockChangePassword);

        fireEvent.changeText(getByTestId('current-password-input'), "oldpass123");
        fireEvent.changeText(getByTestId('new-password-input'), "12345");
        fireEvent.press(getByTestId('change-password-button'));

        expect(Alert.alert).toHaveBeenCalledWith("Password must be at least 6 characters");
        expect(mockChangePassword).not.toHaveBeenCalled();
    });
});
