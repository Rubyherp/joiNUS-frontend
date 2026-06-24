import Requests from "@/app/post/[postId]/requests";
import { render, waitFor } from "@testing-library/react-native"
import { PostContext } from "@/context/postContext";
import { Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";

jest.mock('expo-router', () => ({
    router: { back: jest.fn() },
    useLocalSearchParams: () => ({ postId: 'post-1' })
}));

jest.mock('@/components/themedComponents/themedRequestCard', () => {
    const React = require('react');
    const { Text } = require('react-native');

    return function MockRequestCard({ data }) {
        return (
            <Text
                testID={`request-card-${data.id}`}
            >
                {data.profiles?.username}
            </Text>
        );
    };
});

jest.spyOn(Alert, 'alert').mockImplementation(() => { });

const mockPost = { id: 'post-1', title: 'title' };
const mockPending = [
    { id: 'req-1', requester_id: 'user-1', profiles: { username: 'xn' }, status: 'pending' },
]
const mockAccepted = [
    { id: 'req-2', requester_id: 'user-2', profiles: { username: 'xn-2' }, status: 'accepted' },
]

const renderRequests = (contextOverride = {}) => {
    const defaultContext = {
        fetchPostById: jest.fn().mockResolvedValue(mockPost),
        fetchPendingRequests: jest.fn().mockResolvedValue(mockPending),
        fetchAcceptedRequests: jest.fn().mockResolvedValue(mockAccepted),
        ...contextOverride,
    };

    return render(
        <PostContext.Provider value={defaultContext}>
            <Requests />
        </PostContext.Provider>
    );
};

describe("Requests Screen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("loads post, pending and accepted requests on mount", async () => {
        const mockFetchPost = jest.fn().mockResolvedValue(mockPost);
        const mockFetchPending = jest.fn().mockResolvedValue(mockPending);
        const mockFetchAccepted = jest.fn().mockResolvedValue(mockAccepted);

        renderRequests({
            fetchPostById: mockFetchPost,
            fetchPendingRequests: mockFetchPending,
            fetchAcceptedRequests: mockFetchAccepted,
        });

        await waitFor(() => {
            expect(mockFetchPost).toHaveBeenCalledWith('post-1');
            expect(mockFetchPending).toHaveBeenCalledWith('post-1');
            expect(mockFetchAccepted).toHaveBeenCalledWith('post-1');
        });
    });

    it("renders pending and accepted request cards", async () => {
        const { findByTestId } = renderRequests();

        expect(await findByTestId('request-card-req-1')).toBeTruthy();
        expect(await findByTestId('request-card-req-2')).toBeTruthy();
    });

    it("shows empty state when there are no pending requests", async () => {
        const { findByText } = renderRequests({ fetchPendingRequests: jest.fn().mockResolvedValue([]) });

        expect(await findByText('No pending requests')).toBeTruthy();
    });

    it("shows empty state when there are no pending requests", async () => {
        const { findByText } = renderRequests({ fetchAcceptedRequests: jest.fn().mockResolvedValue([]) });

        expect(await findByText('No accepted requests yet')).toBeTruthy();
    });

})
