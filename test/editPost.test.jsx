import EditPost from "@/app/post/[postId]/editPost";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { PostContext } from "@/context/postContext";
import { Alert } from "react-native";
import { UIImagePickerPreferredAssetRepresentationMode } from "expo-image-picker";

const mockReplace = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
    router: {
        replace: (...args) => mockReplace(...args),
        back: (...args) => mockBack(...args),
    },
    useLocalSearchParams: () => ({ postId: 'post-1' }),
}))

jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true, assets: [] }),
    MediaTypeOptions: { Images: 'Images' },
    UIImagePickerPreferredAssetRepresentationMode: { Compatible: 'Compatible' },
}));

jest.mock('@/components/helpers/deadlinePicker', () => {
    const React = require('react');
    const { TouchableOpacity, Text } = require('react-native');

    return function MockDeadlinePicker({ onSelect }) {
        return (
            <TouchableOpacity
                testId="mock-deadline-picker"
                onPress={() => onSelect(new Date('2026-01-01'))}
            >
                <Text>Select Deadline</Text>
            </TouchableOpacity>
        );
    };
});

jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
    const destructive = buttons?.find(b => b.style === 'destructive');
    destructive?.onPress?.();
});

const mockPost = {
    title: 'Title',
    description: 'Description',
    image_url: null,
    more_details: 'More details',
    requirements: 'Requirements',
    member_limit: 4,
    deadline: null,
    created_at: '2026-01-01',
    community_id: 'community-1',
}

const renderEditPost = (contextOverride = {}) => {
    const defaultContext = {
        fetchPostById: jest.fn().mockResolvedValue(mockPost),
        uploadPostImage: jest.fn(),
        createPost: jest.fn().mockResolvedValue({ id: 'post-1' }),
        deletePost: jest.fn().mockResolvedValue({ success: true }),
        ...contextOverride
    };

    return render(
        <PostContext.Provider value={defaultContext}>
            <EditPost />
        </PostContext.Provider>
    )
}

describe("Edit Post Screen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("loads and prefills all existing post data", async () => {
        const mockFetch = jest.fn().mockResolvedValue(mockPost);
        const { findByDisplayValue } = renderEditPost({ fetchPostById: mockFetch });

        expect(await findByDisplayValue('Title')).toBeTruthy();
        expect(await findByDisplayValue('Description')).toBeTruthy();
        expect(mockFetch).toHaveBeenCalledWith('post-1');
    });

    it('shows alert when title is cleared before submit', async () => {
        const { getByText, findByDisplayValue } = renderEditPost();

        const titleInput = await findByDisplayValue('Title');
        fireEvent.changeText(titleInput, '');
        fireEvent.press(getByText("Post"));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Missing Title', 'Please enter a title for your post.');
        });
    });

    it("submits updated post and redirects to /landing", async () => {
        const mockCreatePost = jest.fn().mockResolvedValue({ id: 'post-1' });
        const { getByText, findByDisplayValue } = renderEditPost({ createPost: mockCreatePost });

        const titleInput = await findByDisplayValue('Title');
        fireEvent.changeText(titleInput, 'Updated Title');
        fireEvent.press(getByText("Post"));

        await waitFor(() => {
            expect(mockCreatePost).toHaveBeenCalledWith(expect.objectContaining({
                "communityId": "community-1", "deadline": null, "description": "Description", "imageUrl": null, "memberLimit": 4, "moreDetails": "More details", "postId": "post-1", "requirements": "Requirements", "title": "Updated Title"
            }));
        });
    });

    it("shows alert on update failure", async () => {
        const mockCreatePost = jest.fn().mockRejectedValue(new Error("Failed to create post"));
        const { getByText, findByDisplayValue } = renderEditPost({ createPost: mockCreatePost });

        await findByDisplayValue('Title');
        fireEvent.press(getByText("Post"));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to create post');
        });
    });

    it("calls deletePostById and redirects to /landing on delete confirm", async () => {
        const mockDelete = jest.fn().mockResolvedValue({ success: true });
        const { getByText, findByDisplayValue } = renderEditPost({ deletePostById: mockDelete });

        await findByDisplayValue('Title');
        fireEvent.press(getByText("Delete"));

        await waitFor(() => {
            expect(mockDelete).toHaveBeenCalledWith('post-1');
            expect(mockReplace).toHaveBeenCalledWith('/landing');
        });
    });

    it("shows alert when delete fails", async () => {
        const mockDelete = jest.fn().mockRejectedValue(new Error('Failed to delete post'));
        const { getByText, findByDisplayValue } = renderEditPost({ deletePostById: mockDelete });

        await findByDisplayValue("Title");
        fireEvent.press(getByText("Delete"));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to delete post');
        });
    });

})
