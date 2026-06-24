import DMChat from "@/app/dm/[userId]";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { UserContext } from "@/context/userContext";
import { ChatContext } from "@/context/chatContext";
import { SocketContext } from "@/context/socketContext";
import { Alert } from "react-native";

const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
    router: {
        back: (...args) => mockBack(...args),
        push: (...args) => mockPush(...args),
    },
    useLocalSearchParams: () => ({ userId: 'u-1', username: 'xn' }),
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => { });

const mockHistory = [
    { id: 'm-1', sender_id: 'u-1', content: 'Hello', timestamp: '2026-01-01T00:00:00Z' },
    { id: 'm-2', sender_id: 'viewer-1', content: 'Hi', timestamp: '2026-01-01T00:01:00Z' },
];

const renderDMChat = ({ userOverride = {}, chatOverride = {}, socketOverride = {} } = {}) => {

    const userContext = {
        user: { id: 'viewer-1' },
        fetchUserDetails: jest.fn().mockResolvedValue({ id: 'u-1', username: 'xn', avatar: null }),
        ...userOverride,
    };

    const chatContext = {
        fetchChatHistory: jest.fn().mockResolvedValue(mockHistory),
        ...chatOverride,
    };

    const dmListeners = [];
    const socketContext = {
        joinDM: jest.fn(),
        leaveDM: jest.fn(),
        sendDM: jest.fn(),
        onDM: jest.fn((cb) => {
            dmListeners.push(cb);
            return () => { };
        }),
        ...socketOverride,
    };

    const utils = render(
        <UserContext.Provider value={userContext}>
            <SocketContext.Provider value={socketContext}>
                <ChatContext.Provider value={chatContext}>
                    <DMChat />
                </ChatContext.Provider>
            </SocketContext.Provider>
        </UserContext.Provider>
    );

    return { ...utils, userContext, chatContext, socketContext, dmListeners };
};

describe('DMChat', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("loads and displays chat history on mount", async () => {
        const { findByText } = renderDMChat();

        expect(await findByText('Hello')).toBeTruthy();
        expect(await findByText('Hi')).toBeTruthy();
    });

    it("joins the DM room on mount with the other user's id", async () => {
        const { socketContext } = renderDMChat();

        await waitFor(() => {
            expect(socketContext.joinDM).toHaveBeenCalledWith('u-1');
        });
    });

    it("sends a message via sendDM and clears the input", async () => {
        const { findByPlaceholderText, getByText, socketContext } = renderDMChat();

        await findByPlaceholderText('Message...');
        const input = await findByPlaceholderText('Message...');
        fireEvent.changeText(input, 'Hello xn');
        fireEvent.press(getByText('↑'));

        expect(socketContext.sendDM).toHaveBeenCalledWith('u-1', 'Hello xn');
        expect(input.props.value).toBe('');
    });

    it("leaves the DM room on unmount", async () => {
        const { unmount, socketContext } = renderDMChat();

        await waitFor(() => expect(socketContext.joinDM).toHaveBeenCalled());

        unmount();

        expect(socketContext.leaveDM).toHaveBeenCalledWith('u-1');
    });

});
