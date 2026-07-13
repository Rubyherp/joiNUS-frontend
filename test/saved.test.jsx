import Saved from "@/app/(tabs)/saved";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { PostContext } from "@/context/postContext";
import { CommunityContext } from "@/context/communityContext";
import { Alert } from "react-native";

jest.mock('expo-router', () => ({
    useFocusEffect: (cb) => {
        const React = require('react');
        React.useEffect(() => { cb(); }, []);
    },
}));

jest.mock('@/components/themedComponents/themedCommunity', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return function MockThemedCommunity({ data }) {
        return <Text testID={`community-${data.id}`}>{data.name}</Text>;
    };
});

jest.mock('@/components/themedComponents/themedPost', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return function MockThemedPost({ data }) {
        return <Text testID={`post-${data.id}`}>{data.title}</Text>;
    };
});

jest.spyOn(Alert, 'alert').mockImplementation(() => { });

const mockSavedPostsRaw = [{ posts: { id: 'post-1', title: 'Saved Post One' } }];
const mockFollowedRaw = [{ communities: { id: 'community-1', name: 'Followed Community' } }];
const mockAllCommunities = [
    { id: 'community-1', name: 'Followed Community' },
    { id: 'community-2', name: 'Other Community' },
];

const renderSaved = ({ postOverrides = {}, communityOverrides = {} } = {}) => {
    const postContext = {
        fetchSavedPosts: jest.fn().mockResolvedValue(mockSavedPostsRaw),
        ...postOverrides,
    };
    const communityContext = {
        fetchCommunities: jest.fn().mockResolvedValue(mockAllCommunities),
        fetchFollowedCommunities: jest.fn().mockResolvedValue(mockFollowedRaw),
        ...communityOverrides,
    };
    return render(
        <PostContext.Provider value={postContext}>
            <CommunityContext.Provider value={communityContext}>
                <Saved />
            </CommunityContext.Provider>
        </PostContext.Provider>
    );
};

describe("Saved Screen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("shows followed and browsable communities on the Communities tab by default", async () => {
        const { findByTestId } = renderSaved();

        expect(await findByTestId('community-community-1')).toBeTruthy();
        expect(await findByTestId('community-community-2')).toBeTruthy();
    });

    it("does not duplicate a followed community under 'Browse all'", async () => {
        const { findByText, getAllByTestId } = renderSaved();

        await findByText('Followed Community');

        await waitFor(() => {
            expect(getAllByTestId('community-community-1')).toHaveLength(1);
        });
    });

    it("shows empty state when there are no followed communities", async () => {
        const { findByText } = renderSaved({ communityOverrides: { fetchFollowedCommunities: jest.fn().mockResolvedValue([]) } });

        expect(await findByText("You're not following any communities yet")).toBeTruthy();
    });

    it("switches to Posts tab and shows saved posts", async () => {
        const { getByText, findByTestId, findByText } = renderSaved();

        // Wait for loading to complete
        await findByText('Following');

        fireEvent.press(getByText('Posts'));

        expect(await findByTestId('post-post-1')).toBeTruthy();
    });

    it("shows empty state on Posts tab when there are no saved posts", async () => {
        const { getByText, findByText } = renderSaved({ postOverrides: { fetchSavedPosts: jest.fn().mockResolvedValue([]) } });

        // Wait for loading to complete
        await findByText('Following');

        fireEvent.press(getByText('Posts'));

        expect(await findByText('No saved posts yet')).toBeTruthy();
    });

    it("shows alert when loading data fails", async () => {
        renderSaved({ postOverrides: { fetchSavedPosts: jest.fn().mockRejectedValue(new Error('fail')) } });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to load data');
        });
    });
});
