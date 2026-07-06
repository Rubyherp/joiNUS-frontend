import Create from "@/app/(tabs)/create";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { PostContext } from "@/context/postContext";
import { CommunityContext } from "@/context/communityContext";
import { Alert } from "react-native"

//Mocks
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
    router: { replace: (...args) => mockReplace(...args) },
}));

jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true, assets: [] }),
    MediaTypeOptions: { Images: 'Images' },
    UIImagePickerPreferredAssetRepresentationMode: { Compatible: 'Compatible' },
}));

jest.mock('@/components/ui/actionsheet', () => {
    const { View, Text, Pressable } = require('react-native');
    return {
        Actionsheet: ({ isOpen, children }) => (isOpen ? <View>{children}</View> : null),
        ActionsheetBackdrop: () => null,
        ActionsheetContent: ({ children }) => <View>{children}</View>,
        ActionsheetDragIndicator: () => null,
        ActionsheetDragIndicatorWrapper: ({ children }) => <View>{children}</View>,
    };
});

jest.mock('@/components/helpers/communityPicker', () => {
    const React = require('react');
    const { TouchableOpacity, Text } = require('react-native');
    return function MockCommunityPicker({ onSelect }) {
        return (
            <TouchableOpacity testID="mock-community-picker" onPress={() => onSelect({ id: 'community-1', name: 'Test Community' })}>
                <Text>Select Community</Text>
            </TouchableOpacity>
        );
    };
});

jest.mock('@/components/helpers/deadlinePicker', () => {
    const React = require('react');
    const { TouchableOpacity, Text } = require('react-native');
    return function MockDeadlinePicker({ onSelect }) {
        return (
            <TouchableOpacity testID="mock-deadline-picker" onPress={() => onSelect(new Date('2026-01-01'))}>
                <Text>Select Deadline</Text>
            </TouchableOpacity>
        );
    };
});

jest.spyOn(Alert, 'alert').mockImplementation(() => { });

const renderCreate = (contextOverride = {}) => {
    const defaultPostContext = {
        uploadPostImage: jest.fn(),
        createPost: jest.fn().mockResolvedValue({ id: 'post-1' }),
        ...contextOverride
    };

    const defaultCommunityContext = {
        requestNewCommunity: jest.fn(),
    };

    return render(
        <CommunityContext.Provider value={defaultCommunityContext}>
            <PostContext.Provider value={defaultPostContext}>
                <Create />
            </PostContext.Provider>
        </CommunityContext.Provider>
    )
}

describe("Create Post Screen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("shows alert when title is missing", async () => {
        const { getByText, getByPlaceholderText } = renderCreate();

        fireEvent.changeText(getByPlaceholderText("Tell people what this is about..."), "A description");
        fireEvent.press(getByText("Post"));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Missing Title', 'Please enter a title for your post.');
        });
    })

    it("shows alert when description is missing", async () => {
        const { getByText, getByPlaceholderText } = renderCreate();

        fireEvent.changeText(getByPlaceholderText("What's your idea?"), "A title");
        fireEvent.press(getByText("Post"));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Missing Description', 'Please enter a description for your post.');
        });
    });

    it("shows alert when no community is selected", async () => {
        const { getByText, getByPlaceholderText } = renderCreate();

        fireEvent.changeText(getByPlaceholderText("What's your idea?"), "A title");
        fireEvent.changeText(getByPlaceholderText("Tell people what this is about..."), "A description");
        fireEvent.press(getByText("Post"));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('No Community Selected', 'Please select a community for your post.');
        });
    });

    it("calls createPost with form data and redirects to /landing on success", async () => {
        const mockCreatePost = jest.fn().mockResolvedValue({ id: 'post-1' });
        const { getByText, getByPlaceholderText, getByTestId } = renderCreate({ createPost: mockCreatePost });

        fireEvent.changeText(getByPlaceholderText("What's your idea?"), "A title");
        fireEvent.changeText(getByPlaceholderText("Tell people what this is about..."), "A description");
        fireEvent.press(getByTestId('mock-community-picker'));
        fireEvent.press(getByText("Post"));

        await waitFor(() => {
            expect(mockCreatePost).toHaveBeenCalledWith(expect.objectContaining({
                "communityId": "community-1", "deadline": null, "description": "A description", "imageUrl": null, "memberLimit": null, "moreDetails": "", "requirements": "", "title": "A title"
            }));
        });

        expect(mockReplace).toHaveBeenCalledWith('/landing');
    });

    it("uploads image and includes imageUrl when an image is selected", async () => {
        const ImagePicker = require('expo-image-picker');
        ImagePicker.launchImageLibraryAsync.mockResolvedValue({
            canceled: false,
            assets: [{ uri: 'file://test-image.jpg' }],
        });

        const mockUploadPostImage = jest.fn().mockResolvedValue('https://cdn.test/image.jpg');
        const mockCreatePost = jest.fn().mockResolvedValue({ id: 'post-1' });

        const { getByText, getByPlaceholderText, getByTestId } = renderCreate({
            uploadPostImage: mockUploadPostImage,
            createPost: mockCreatePost
        });

        fireEvent.changeText(getByPlaceholderText("What's your idea?"), "A title");
        fireEvent.changeText(getByPlaceholderText("Tell people what this is about..."), "A description");
        fireEvent.press(getByTestId('mock-community-picker'));

        fireEvent.press(getByText("Upload Image"));
        fireEvent.press(getByText("Browse Files"));

        await waitFor(() => {
            expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
        })

        fireEvent.press(getByText("Post"));

        await waitFor(() => {
            expect(mockUploadPostImage).toHaveBeenCalled();
            expect(mockCreatePost).toHaveBeenCalledWith({
                "communityId": "community-1", "deadline": null, "description": "A description", "imageUrl": "https://cdn.test/image.jpg", "memberLimit": null,
                "moreDetails": "", "requirements": "", "title": "A title"
            });
        });
    });

    it("shows alert on createPost failure", async () => {
        const mockCreatePost = jest.fn().mockRejectedValue(new Error("Failed to create post"))
        const { getByText, getByPlaceholderText, getByTestId } = renderCreate({ createPost: mockCreatePost });

        fireEvent.changeText(getByPlaceholderText("What's your idea?"), "A title");
        fireEvent.changeText(getByPlaceholderText("Tell people what this is about..."), "A description");
        fireEvent.press(getByTestId('mock-community-picker'));
        fireEvent.press(getByText("Post"));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to create post');
        })
    })

});
