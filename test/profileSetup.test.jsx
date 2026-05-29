import ProfileSetup from "@/app/(tabs)/profileSetup";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { UserContext } from "@/context/userContext";
import { Alert } from "react-native";
import { router } from "expo-router";

//Mock functions
// mock expo router
jest.mock('expo-router', () => ({
    router: { replace: jest.fn() },
    Link: ({ children }) => children,
}));

// spy on Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => { });

// render the ProfileSetup component with UserContext
const renderProfileSetup = (profileCreation) => {
    return render(
        <UserContext.Provider value={{ profileCreation: profileCreation }}>
            <ProfileSetup />
        </UserContext.Provider>
    )

}

//automate sequence of actions to fill the form
const fillForm = (getByTestId, getByText, props = {}) => {
    const data = {
        username: 'Tester',
        major: 'CS',
        year: '2',
        modules: 'CS101',
        contact: '@tester',
        email: 't@u.edu',
        about: 'hello',
        skills: 'js',
        experiences: 'none',
        ...props
    };

    fireEvent.changeText(getByTestId('username-input'), data.username);
    fireEvent.changeText(getByTestId('major-input'), data.major);
    fireEvent.changeText(getByTestId('year-input'), data.year);
    fireEvent.changeText(getByTestId('modules-input'), data.modules);
    fireEvent.press(getByText('Next →'));

    fireEvent.changeText(getByTestId('contact-input'), data.contact);
    fireEvent.changeText(getByTestId('email-input'), data.email);
    fireEvent.changeText(getByTestId('about-input'), data.about);
    fireEvent.press(getByText('Next →'));

    fireEvent.changeText(getByTestId('skills-input'), data.skills);
    fireEvent.changeText(getByTestId('experiences-input'), data.experiences);

    return data;
};

describe("Profile Setup Screen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("calls profileCreation with all fields on submit", async () => {
        const mockProfileCreation = jest.fn().mockResolvedValue(true);
        const { getByTestId, getByText } = renderProfileSetup(mockProfileCreation);

        fillForm(getByTestId, getByText);
        fireEvent.press(getByText('Finish Setup 🎉'));

        await waitFor(() => {
            expect(mockProfileCreation).toHaveBeenCalledWith({
                avatar: '',
                username: 'Tester',
                major: 'CS',
                year: 2,
                modules: 'CS101',
                contact: '@tester',
                email: 't@u.edu',
                about: 'hello',
                skills: 'js',
                experiences: 'none',
            });
        });
    });

    it("redirects user to /profile on success", async () => {
        const mockProfileCreation = jest.fn().mockResolvedValue(true);
        const { getByTestId, getByText } = renderProfileSetup(mockProfileCreation);

        fillForm(getByTestId, getByText);
        fireEvent.press(getByText('Finish Setup 🎉'));

        await waitFor(() => {
            expect(router.replace).toHaveBeenCalledWith('/profile');
        });
    })

    it("shows alert on profile creation failure", async () => {
        const mockProfileCreation = jest.fn().mockRejectedValue(new Error("Profile creation failed"));
        const { getByTestId, getByText } = renderProfileSetup(mockProfileCreation);

        fillForm(getByTestId, getByText);
        fireEvent.press(getByText('Finish Setup 🎉'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Profile creation failed');
        });
    })

})
