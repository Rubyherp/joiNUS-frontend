import Register from "@/app/(auth)/register";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { UserContext } from "@/context/userContext";
import { Alert } from "react-native";

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
    useRouter: () => ({ replace: mockReplace }),
    Link: ({ children }) => children,
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => { });

const renderRegister = (contextValues) => {
    return render(
        <UserContext.Provider value={contextValues}>
            <Register />
        </UserContext.Provider>
    );
};

describe("Register Screen", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("shows Send OTP button initially", () => {
        const { getByText } = renderRegister({ register: jest.fn(), sendOtp: jest.fn() });
        expect(getByText('Send OTP')).toBeTruthy();
    });

    it("calls sendOtp with email and shows OTP input on success", async () => {
        const mockSendOtp = jest.fn().mockResolvedValue(true);
        const { getByText, getByTestId, queryByTestId } = renderRegister({
            register: jest.fn(),
            sendOtp: mockSendOtp,
        });

        expect(queryByTestId('otp-input')).toBeNull();

        fireEvent.changeText(getByTestId('email-input'), 'test@u.nus.edu');
        fireEvent.press(getByText('Send OTP'));

        await waitFor(() => {
            expect(mockSendOtp).toHaveBeenCalledWith('test@u.nus.edu');
            expect(getByTestId('otp-input')).toBeTruthy();
        });
    });

    it("shows password input and Create Account after OTP entered", async () => {
        const { getByText, getByTestId, queryByTestId } = renderRegister({
            register: jest.fn(),
            sendOtp: jest.fn().mockResolvedValue(true),
        });

        fireEvent.changeText(getByTestId('email-input'), 'test@u.nus.edu');
        fireEvent.press(getByText('Send OTP'));

        await waitFor(() => {
            expect(getByTestId('otp-input')).toBeTruthy();
        });

        fireEvent.changeText(getByTestId('otp-input'), '12345678');

        await waitFor(() => {
            expect(getByTestId('password-input')).toBeTruthy();
            expect(getByText('Create Account')).toBeTruthy();
        });
    });

    it("calls register with email, otp, and password on submit", async () => {
        const mockRegister = jest.fn().mockResolvedValue(true);
        const { getByText, getByTestId } = renderRegister({
            register: mockRegister,
            sendOtp: jest.fn().mockResolvedValue(true),
        });

        fireEvent.changeText(getByTestId('email-input'), 'test@u.nus.edu');
        fireEvent.press(getByText('Send OTP'));

        await waitFor(() => {
            expect(getByTestId('otp-input')).toBeTruthy();
        });

        fireEvent.changeText(getByTestId('otp-input'), '12345678');

        await waitFor(() => {
            expect(getByTestId('password-input')).toBeTruthy();
        });

        fireEvent.changeText(getByTestId('password-input'), 'secret123');
        fireEvent.press(getByText('Create Account'));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                email: 'test@u.nus.edu',
                otp: '12345678',
                password: 'secret123'
            });
        });
    });

    it("redirects to /login on success", async () => {
        const mockRegister = jest.fn().mockResolvedValue(true);
        const { getByText, getByTestId } = renderRegister({
            register: mockRegister,
            sendOtp: jest.fn().mockResolvedValue(true),
        });

        fireEvent.changeText(getByTestId('email-input'), 'test@u.nus.edu');
        fireEvent.press(getByText('Send OTP'));

        await waitFor(() => expect(getByTestId('otp-input')).toBeTruthy());
        fireEvent.changeText(getByTestId('otp-input'), '12345678');

        await waitFor(() => expect(getByTestId('password-input')).toBeTruthy());
        fireEvent.changeText(getByTestId('password-input'), 'secret123');
        fireEvent.press(getByText('Create Account'));

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/login');
        });
    });
})










