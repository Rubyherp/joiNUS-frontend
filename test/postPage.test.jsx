import PostPage from "@/app/post/[postId]";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { PostContext } from "@/context/postContext";
import { UserContext } from "@/context/userContext";
import { CommunityContext } from "@/context/communityContext";
import { Alert } from "react-native";

const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
    router: {
        push: (...args) => mockPush(...args),
        back: (...args) => mockBack(...args),
    },
    useLocalSearchParams: () => ({ postId: 'post-1' }),
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => { });

const mockPost = {
    id: 'post-1',
    title: 'title',
    description: 'description',
    image_url: null,
    more_details: null,
    requirements: null,
    memeber_lmit: null,
    deadeline: null,
    created_at: '2026-01-01',
    community_id: 'com-1',
    author_id: 'u-1',
};

const mockCommunity = { id: 'com-1', name: 'com-1', category: 'module' };
const mockAuthor = { id: 'u-1', name: 'xn' };

const renderPostPage = ({
    userId = 'viewer-1',
    post = mockPost,
    requestStatus = { status: null },
    savedPostIds = new Set(),
    contextOverride = {},
} = {}) => {
    const postContext = {
        savedPostIds,
        fetchPostById: jest.fn().mockResolvedValue(post),
        savePost: jest.fn().mockResolvedValue({ success: true }),
        unsavePost: jest.fn().mockResolvedValue({ success: true }),
        requestJoin: jest.fn().mockResolvedValue({ success: true }),
        handlePendingRequest: jest.fn(),
        requestStatus: jest.fn().mockResolvedValue(requestStatus),
        ...contextOverride,
    };

    const userContext = {
        user: { id: userId },
        fetchUserDetails: jest.fn().mockResolvedValue(mockAuthor),
    }

    const communityContext = {
        fetchCommunityById: jest.fn().mockResolvedValue(mockCommunity),
    }

    const utils = render(
        <UserContext.Provider value={userContext}>
            <CommunityContext.Provider value={communityContext}>
                <PostContext.Provider value={postContext}>
                    <PostPage />
                </PostContext.Provider>
            </CommunityContext.Provider>
        </UserContext.Provider>
    );

    return { ...utils, postContext, userContext, communityContext };
};

describe("Post Detail Screen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("shows 'Request to Join' when viewer has no existing request", async () => {
        const { findByText } = renderPostPage({ requestStatus: { status: null } });

        expect(await findByText("Request to Join")).toBeTruthy();
    });

    it("shows 'View Requests' when the viewer is the author", async () => {
        const { findByText, queryByText } = renderPostPage({ userId: 'u-1' });

        expect(await findByText("View Requests")).toBeTruthy();
        expect(queryByText("Request to Join")).toBeNull();
    });

    it("shows 'Pending...' when the existing request is already pending", async () => {
        const { findByText } = renderPostPage({ requestStatus: { status: 'pending' } });

        expect(await findByText("Pending...")).toBeTruthy();
    });


    it("shows 'Joined ✓' when an existing request is accepted", async () => {
        const { findByText } = renderPostPage({ requestStatus: { status: 'accepted' } });

        expect(await findByText('Joined ✓')).toBeTruthy();
    });

    // it("shows 'Request Again' and re-sends a request when previously rejected", async () => {
    //     const { findByText, postContext } = renderPostPage({ requestStatus: { status: 'rejected' } });
    //
    //     const retryButton = await findByText('Request Again');
    //     fireEvent.press(retryButton);
    //
    //     await waitFor(() => {
    //         expect(postContext.requestJoin).toHaveBeenCalled();
    //     });
    // });
    //
    // it("Calls requestJoin on Request to Join press", async () => {
    //     const { findByText, postContext } = renderPostPage({
    //         requestStatus: { status: null },
    //     });
    //
    //     const joinButton = await findByText("Request to Join");
    //     fireEvent.press(joinButton);
    //
    //     await waitFor(() => {
    //         expect(postContext.requestJoin).toHaveBeenCalled();
    //     });
    // });

    it("navigates to requests screen when View Requests is pressed by author", async () => {
        const { findByText } = renderPostPage({ userId: 'u-1' });

        const viewRequestsButton = await findByText("View Requests");
        fireEvent.press(viewRequestsButton);

        expect(mockPush).toHaveBeenCalledWith("post/post-1/requests");
    })

});
