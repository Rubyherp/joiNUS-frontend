import Register from "@/app/(auth)/register";
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
const renderRegister = (registerFn) => {
    return render(
        // replace register function in UserContext with mock function
        <UserContext.Provider value={{ register: registerFn }}>
            <Register />
        </UserContext.Provider>
    );
};

// Test cases
describe("Register Screen", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("calls register with email and password on submit", async () => {
        // Mock successful registration
        const mockRegister = jest.fn().mockResolvedValue(true);
        const { getByText, getByTestId } = renderRegister(mockRegister);

        // Mock User
        fireEvent.changeText(getByTestId('email-input'), 'test@u.nus.edu');
        fireEvent.changeText(getByTestId('password-input'), 'secret123');
        fireEvent.press(getByText('Register'));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                email: 'test@u.nus.edu',
                password: 'secret123'
            });
        });
    });

    it("redirects to /login on success", async () => {
        const mockRegister = jest.fn().mockResolvedValue(true);
        const { getByText } = renderRegister(mockRegister);

        fireEvent.press(getByText('Register'));

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/login');
        });
    });

    it("shows alert and highlights email field on EmailError", async () => {
        const mockRegister = jest.fn().mockRejectedValue(new EmailError("Invalid email"));
        const { getByText, getByTestId } = renderRegister(mockRegister);

        fireEvent.press(getByText('Register'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Invalid email");
            expect(getByTestId('email-input').props.style)
                .toEqual({
                    borderColor: 'red',
                    borderWidth: 2,
                    fontSize: 16,
                    height: 42,
                    lineHeight: 20,
                    paddingBottom: 0,
                    paddingTop: 0,
                    textAlignVertical: "center",
                });
        });
    });

    it("shows alert and highlights password field on EmptyPasswordError", async () => {
        const mockRegister = jest.fn().mockRejectedValue(new EmptyPasswordError("Password cannot be empty"));
        const { getByText, getByTestId } = renderRegister(mockRegister);

        fireEvent.press(getByText("Register"));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Password cannot be empty");
            expect(getByTestId('password-input').props.style)
                .toEqual({
                    fontSize: 16,
                    height: 42,
                    lineHeight: 20,
                    paddingBottom: 0,
                    paddingTop: 0,
                    textAlignVertical: "center",
                });
        })
    })

})










