import ThemedCommunity from "@/components/themedComponents/themedCommunity";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { CommunityContext } from "@/context/communityContext";
import { Alert } from "react-native";

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
    router: { push: (...args) => mockPush(...args) },
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => { });

const mockCommunityData = { id: 'com-1', name: 'xn-com', category: 'module' };

const renderCommunity = (props = {}, contextOverride = {}) => {
    const defaultContext = {
        followCommunity: jest.fn().mockResolvedValue({ success: true }),
        unfollowCommunity: jest.fn().mockResolvedValue({ success: true }),
        ...contextOverride,
    };

    return render(
        <CommunityContext.Provider value={defaultContext}>
            <ThemedCommunity data={mockCommunityData} {...props} />
        </CommunityContext.Provider>
    );
};

describe('ThemedCommunity', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("shows 'follow' label by default when unfollowed", () => {
        const { getByText } = renderCommunity({ isFollowed: false });

        expect(getByText('follow')).toBeTruthy();
    });

    it("shows 'unfollow' label by default when followed", () => {
        const { getByText } = renderCommunity({ isFollowed: true });

        expect(getByText('following')).toBeTruthy();
    });

    it("calls followCommunity and onFollowChange when not yet followed", async () => {
        const mockFollow = jest.fn().mockResolvedValue({ success: true });
        const mockOnFollowChange = jest.fn();
        const { getByText } = renderCommunity(
            { isFollowed: false, onFollowChange: mockOnFollowChange },
            { followCommunity: mockFollow },
        );

        fireEvent.press(getByText('follow'));

        await waitFor(() => {
            expect(mockFollow).toHaveBeenCalledWith('com-1');
            expect(mockOnFollowChange).toHaveBeenCalled();
        });
    });

    it("calls unfollowCommunity and onFollowChange when already following", async () => {
        const mockUnfollow = jest.fn().mockResolvedValue({ success: true });
        const mockOnFollowChange = jest.fn();
        const { getByText } = renderCommunity(
            { isFollowed: true, onFollowChange: mockOnFollowChange },
            { unfollowCommunity: mockUnfollow },
        );

        fireEvent.press(getByText('following'));

        await waitFor(() => {
            expect(mockUnfollow).toHaveBeenCalledWith('com-1');
            expect(mockOnFollowChange).toHaveBeenCalled();
        });
    });

    it("navigates to the community page when pressed", () => {
        const { getByText } = renderCommunity();

        fireEvent.press(getByText('xn-com'));

        expect(mockPush).toHaveBeenCalledWith('/community/com-1');
    });

});
