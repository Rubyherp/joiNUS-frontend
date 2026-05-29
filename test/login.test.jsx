
import Login from "@/app/(auth)/login";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { UserContext } from "@/context/userContext";
import { Alert } from "react-native";
import EmailError from "@/customError/emailError";
import EmptyPasswordError from "@/customError/emptyPasswordError";

// Mock functions
// Mock expo-router
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
    useRouter: () => ({ replace: mockReplace }),
    Link: ({ children }) => children,
}));

//Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => { });

//Helper to render fake context
const renderLogin = (loginFn) => {
    return render(
        // replace register function in UserContext with mock function
        <UserContext.Provider value={{ login: loginFn }}>
            <Login />
        </UserContext.Provider>
    );
};

describe("Login Screen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("calls login with email and password on submit", async () => {
        const mockLogin = jest.fn().mockResolvedValue(true);
        const { getByTestId, getByText } = renderLogin(mockLogin);

        fireEvent.changeText(getByTestId('email-input'), "e1234567@u.nus.edu");
        fireEvent.changeText(getByTestId('password-input'), "test123");
        fireEvent.press(getByText("Log In"));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: "e1234567@u.nus.edu",
                password: "test123"
            });
        });
    });

    it("redirects to /profile when hasProfile is true", async () => {
        const mockLogin = jest.fn().mockResolvedValue({ hasProfile: true });
        const { getByText } = renderLogin(mockLogin);

        fireEvent.press(getByText("Log In"));

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/profile');
        });
    });

    it("redirects to /profileSetup when hasProfile is false", async () => {
        const mockLogin = jest.fn().mockResolvedValue({ hasProfile: false });
        const { getByText } = renderLogin(mockLogin);

        fireEvent.press(getByText("Log In"));

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/profileSetup');
        });
    });

    it("shows alert on error", async () => {
        const mockLogin = jest.fn().mockRejectedValue(new Error("Login failed"));
        const { getByText } = renderLogin(mockLogin);

        fireEvent.press(getByText("Log In"));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Login failed");
        })
    })

    it("highlights email field on EmailError", async () => {
        const mockLogin = jest.fn().mockRejectedValue(new EmailError("Invalid email"));
        const { getByTestId, getByText } = renderLogin(mockLogin);

        fireEvent.changeText(getByTestId('email-input'), "");
        fireEvent.changeText(getByTestId('password-input'), "test123");
        fireEvent.press(getByText("Log In"));

        await waitFor(() => {
            expect(getByTestId('email-input').props.style)
                .toEqual({ borderColor: 'red', borderWidth: 2 });
        })
    })


    it("highlights password field on EmptyPasswordError", async () => {
        const mockLogin = jest.fn().mockRejectedValue(new EmptyPasswordError());
        const { getByTestId, getByText } = renderLogin(mockLogin);

        fireEvent.changeText(getByTestId('email-input'), "idk123@u.nus.edu");
        fireEvent.changeText(getByTestId('password-input'), "");
        fireEvent.press(getByText("Log In"));

        await waitFor(() => {
            expect(getByTestId('password-input').props.style)
                .toEqual({ borderColor: 'red', borderWidth: 2 });
        })
    })
})

