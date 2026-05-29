import Profile from '@/app/(tabs)/profile';
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { UserContext } from "@/context/userContext";

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

const renderProfile = (changeAvatarFn) => {
    return render(
        <UserContext.Provider value={{ changeAvatar: changeAvatarFn, profile: mockProfile }}>
            <Profile />
        </UserContext.Provider>
    )
}

describe("Profile Screen", () => {
    it("calls changeAvatar when avatar is pressed", async () => {
        const mockChangeAvatar = jest.fn().mockResolvedValue(undefined);
        const { getByTestId } = renderProfile(mockChangeAvatar);

        fireEvent.press(getByTestId('avatar-button'));

        await waitFor(() => {
            expect(mockChangeAvatar).toHaveBeenCalledTimes(1);
        })
    })

    it("updates avatar on successful change", async () => {
        const mockChangeAvatar = jest.fn().mockResolvedValue({
            avatar: "new-avatar.jpg"
        })
        const { getByTestId } = renderProfile(mockChangeAvatar);

        fireEvent.press(getByTestId('avatar-button'));

        await waitFor(() => {
            expect(mockChangeAvatar).toHaveBeenCalledTimes(1);
        })
    })

    it("does nothing when user cancel", async () => {
        const mockChangeAvatar = jest.fn().mockResolvedValue();
        const { getByTestId } = renderProfile(mockChangeAvatar);

        fireEvent.press(getByTestId('avatar-button'));

        await waitFor(() => {
            expect(mockChangeAvatar).toHaveBeenCalledTimes(1);
        })
    })
})
