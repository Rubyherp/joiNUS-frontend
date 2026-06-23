import Profile from '@/app/(tabs)/profile';
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { UserContext } from "@/context/userContext";
import { PostContext } from "@/context/postContext";

const mockProfile = {
    avatar: "",
    username: 'fallback',
    major: 'CS',
    year: '2',
    modules: 'CS1101S',
    contact: '@tester',
    email: 't@u.edu',
    about: 'hello',
    skills: 'js',
    experiences: 'none',
}

const mockUser = { id: 'user-123' };

const renderProfile = async (changeAvatarFn, overrides = {}) => {
    const utils = render(
        <UserContext.Provider
            value={{
                changeAvatar: changeAvatarFn,
                profile: mockProfile,
                user: mockUser,
                logout: jest.fn(),
                ...overrides,
            }}
        >
            <PostContext.Provider value={{ fetchPostsByUserId: jest.fn().mockResolvedValue([]) }}>
                <Profile />
            </PostContext.Provider>
        </UserContext.Provider>
    )

    await waitFor(() => {
        expect(utils.getByTestId('avatar-image')).toBeTruthy();
    });

    return utils;
}

describe("Profile Screen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("calls changeAvatar when avatar is pressed", async () => {
        const mockChangeAvatar = jest.fn().mockResolvedValue(undefined);
        const { getByTestId } = await renderProfile(mockChangeAvatar);

        fireEvent.press(getByTestId('avatar-button'));

        await waitFor(() => {
            expect(mockChangeAvatar).toHaveBeenCalledTimes(1);
        })
    })

    it("updates displayed avatar on successful change", async () => {
        const mockChangeAvatar = jest.fn().mockResolvedValue({
            avatar: "new-avatar.jpg"
        })
        const { getByTestId } = await renderProfile(mockChangeAvatar);

        fireEvent.press(getByTestId('avatar-button'));

        await waitFor(() => {
            expect(mockChangeAvatar).toHaveBeenCalledTimes(1);
            expect(getByTestId('avatar-image').props.source.uri).toMatch(/^new-avatar\.jpg\?t=\d+$/);
        })
    })

    it("does nothing visible when user cancels (no avatar returned)", async () => {
        const mockChangeAvatar = jest.fn().mockResolvedValue(undefined);
        const { getByTestId } = await renderProfile(mockChangeAvatar);

        const before = getByTestId('avatar-image').props.source.uri;

        fireEvent.press(getByTestId('avatar-button'));

        await waitFor(() => {
            expect(mockChangeAvatar).toHaveBeenCalledTimes(1);
        });

        expect(getByTestId('avatar-image').props.source.uri).toBe(before);
    })
})

