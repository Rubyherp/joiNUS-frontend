import { Text, TouchableOpacity, ActivityIndicator, Alert, useColorScheme, KeyboardAvoidingView, Platform } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Colors } from "@/assets/colors/Colors";
import Spacer from "@/components/themedComponents/spacer";
import ThemedInput from "@/components/themedComponents/themedInput";
import { Keyboard } from "react-native";
import { ArrowLeft } from "lucide-react-native";

export default function ChangePassword() {
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const colors = Colors[theme].gradient;
    const BWColor = theme === 'dark' ? 'white' : 'black';
    const inputBGColor = theme == 'dark' ? 'bg-sky-900' : 'bg-white';

    const { changePassword, logout } = useContext(UserContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) return;
        if (newPassword.length < 6) {
            Alert.alert("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            await changePassword(currentPassword, newPassword);
            await logout();
            Alert.alert("Success", "Your password has been changed. Please log in again.", [
                { text: "OK", onPress: () => router.replace('/login') }
            ]);
        } catch (error) {
            Alert.alert(error.message);
        }
        setLoading(false);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <LinearGradient
                className="flex-1 items-center justify-center px-8 py-12"
                colors={colors}
                start={[0, 0]}
                end={[1, 1]}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="w-full items-center justify-center"
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute top-0 left-0 p-1 rounded-full"
                    >
                        <ArrowLeft size={24} color={BWColor === 'white' ? '#fff' : '#000'} />
                    </TouchableOpacity>

                    <Text
                        className={`text-4xl font-extrabold text-center text-${BWColor}`}
                    >Change Password</Text>
                    <Spacer />

                    <ThemedInput
                        className={`text-base text-${BWColor} ${inputBGColor} border-black/10 rounded-2xl w-[80%] h-14 px-4`}
                        style={{
                            height: 42,
                            fontSize: 16,
                            lineHeight: 20,
                            textAlignVertical: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                        testID="current-password-input"
                        placeholder="current password"
                        secureTextEntry={true}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        autoCapitalize="none"
                    />
                    <Spacer height={10} />

                    <ThemedInput
                        className={`text-base text-${BWColor} ${inputBGColor} border-black/10 rounded-2xl w-[80%] h-14 px-4`}
                        style={{
                            height: 42,
                            fontSize: 16,
                            lineHeight: 20,
                            textAlignVertical: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                        testID="new-password-input"
                        placeholder="new password (min 6 chars)"
                        secureTextEntry={true}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        autoCapitalize="none"
                    />
                    <Spacer height={20} />

                    <TouchableOpacity
                        onPress={handleChangePassword}
                        disabled={loading}
                        activeOpacity={0.7}
                        className="w-[80%]"
                        testID="change-password-button"
                    >
                        <LinearGradient
                            className="py-3 rounded-xl justify-center items-center"
                            colors={['#8637CF', '#0F55A1']}
                            start={[0, 1]}
                            end={[1, 0]}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-lg text-white font-semibold">Change Password</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    <Spacer />
                </KeyboardAvoidingView>
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
}
