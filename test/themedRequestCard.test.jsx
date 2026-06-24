import ThemedRequestCard from "@/components/themedComponents/themedRequestCard";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { PostContext } from "@/context/postContext";
import { Alert } from "react-native";

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
    router: { push: (...args) => mockPush(...args) }
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => { });

const payload = {
    id: 'req-1',
    post_id: 'post-1',
    requester_id: 'user-1',
    message: 'I will pay the $50',
    profiles: { username: 'xn', avatar: null },
    status: 'pending',
    updated_at: '2026-06-01T00:00:00Z',
};

const renderCard = (data = payload, contextOverride = {}, onUpdate = jest.fn()) => {
    const defaultContext = {
        handlePendingRequest: jest.fn().mockResolvedValue({ success: true }),
        ...contextOverride,
    };

    return {
        onUpdate,
        ...render(
            <PostContext.Provider value={defaultContext}>
                <ThemedRequestCard data={data} onUpdate={onUpdate} />
            </PostContext.Provider>
        ),
    };
};

describe("ThemedRequestCard", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders request username and message", () => {
        const { getByText } = renderCard();

        expect(getByText('xn')).toBeTruthy();
        expect(getByText('I will pay the $50')).toBeTruthy();
    });

    it("shows fallback text when message is no provided", () => {
        const { getByText } = renderCard({ payload, message: null });

        expect(getByText('No message provided')).toBeTruthy();
    });

    it("calls handlePendingRequest with accepted status and trigger onUpdate", async () => {
        const mockHandle = jest.fn().mockResolvedValue({ success: true });
        const mockOnUpdate = jest.fn();
        const { getByText } = renderCard(payload, { handlePendingRequest: mockHandle }, mockOnUpdate);

        fireEvent.press(getByText('Accepted'));

        await waitFor(() => {
            expect(mockHandle).toHaveBeenCalledWith('req-1', 'accepted');
            expect(mockOnUpdate).toHaveBeenCalled();
        });
    });

    it("calls handlePendingRequest with rejected status", async () => {
        const mockHandle = jest.fn().mockResolvedValue({ success: true });
        const { getByText } = renderCard(payload, { handlePendingRequest: mockHandle });

        fireEvent.press(getByText('Rejected'));

        await waitFor(() => {
            expect(mockHandle).toHaveBeenCalledWith('req-1', 'rejected');
        });
    });

    it("navigates to chat with request on chat press", () => {
        const { getByText } = renderCard();

        fireEvent.press(getByText('Chat'));

        expect(mockPush).toHaveBeenCalledWith({
            pathname: '/dm/user-1',
            params: { username: 'xn' },
        });
    });

})
