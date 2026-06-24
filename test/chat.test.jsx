import Chats from "@/app/(tabs)/chats";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { ChatContext } from "@/context/chatContext";
import { Alert } from "react-native";

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
    router: { push: (...args) => mockPush(...args) },
    useFocusEffect: (cb) => {
        const React = require('react');
        React.useEffect(() => { cb(); }, []);
    },
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => { });

const mockConversations = [
    {
        room_id: 'room-1',
        other_user_id: 'user-1',
        last_message: 'See you soon',
        last_message_at: '2026-06-01T10:00:00Z',
        profile: { username: 'xn', avatar: null },
    },
    {
        room_id: 'room-2',
        other_user_id: 'user-2',
        last_message: 'Sounds good',
        last_message_at: '2026-06-02T10:00:00Z',
        profile: { username: 'xn-2', avatar: null },
    },
];

const renderChats = (contextOverrides = {}) => {
    const defaultContext = {
        loadConversations: jest.fn().mockResolvedValue(mockConversations),
        ...contextOverrides,
    };
    return render(
        <ChatContext.Provider value={defaultContext}>
            <Chats />
        </ChatContext.Provider>
    );
};

describe("Chats Screen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("loads conversations on mount and renders them", async () => {
        const { findByText } = renderChats();

        expect(await findByText('xn')).toBeTruthy();
        expect(await findByText('xn-2')).toBeTruthy();
    });

    it("shows empty state when there are no conversations", async () => {
        const { findByText } = renderChats({ loadConversations: jest.fn().mockResolvedValue([]) });

        expect(await findByText('No Conversations')).toBeTruthy();
    });

    it("shows alert when loading conversations fails", async () => {
        renderChats({ loadConversations: jest.fn().mockRejectedValue(new Error('fail')) });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to load Conversations');
        });
    });

    it("filters conversations by username search query", async () => {
        const { findByText, getByDisplayValue, queryByText, UNSAFE_getAllByType } = renderChats();
        await findByText('xn');

        const { TextInput } = require('react-native');
        const searchInput = UNSAFE_getAllByType(TextInput)[0];
        fireEvent.changeText(searchInput, 'xn-3');

        await waitFor(() => {
            expect(queryByText('xn-2')).toBeNull();
        });
        expect(getByDisplayValue('xn-3')).toBeTruthy();
    });

    it("navigates to the DM screen when a conversation is pressed", async () => {
        const { findByText } = renderChats();

        const xnRow = await findByText('xn');
        fireEvent.press(xnRow);

        expect(mockPush).toHaveBeenCalledWith({
            pathname: '/dm/user-1',
            params: { username: 'xn' },
        });
    });
});
