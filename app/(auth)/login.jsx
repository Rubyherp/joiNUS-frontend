import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, useColorScheme, KeyboardAvoidingView, Platform } from "react-native";
import { useEffect } from "react";
import { TouchableWithoutFeedback } from "react-native";
import LogoLight from '../../assets/images/logo-white.png';
import LogoDark from '../../assets/images/logo-gold.png';
import { Link, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import EmailError from "@/customError/emailError";
import EmptyPasswordError from "@/customError/emptyPasswordError";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Colors } from "@/assets/colors/Colors.js";

// themed imports
import Spacer from "@/components/themedComponents/spacer";
import ThemedInput from "@/components/themedComponents/themedInput";
import { Keyboard } from "react-native";

export default function Login() {
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const Logo = theme === 'light' ? LogoLight : LogoDark;
    const colors = Colors[theme].gradient;
    const BWColor = theme === 'dark' ? 'white' : 'black';
    const inputBGColor = theme == 'dark' ? 'bg-sky-900' : 'bg-white';

    const { login, user, token } = useContext(UserContext);
    const [loginDetail, setLoginDetail] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    //TODO: use gluestack alert instead of default alert and add error handling for wrong password and email not found

    useEffect(() => {
        if (token && user) {
            router.replace('/landing');
        }
    }, [token])


    const handleError = (error) => {
        if (error instanceof EmailError) {
            setEmailError(true);
        }
        if (error instanceof EmptyPasswordError) {
            setPasswordError(true);
        }
    }

    const handleSubmit = async () => {
        setLoading(true);
        setEmailError(null);
        setPasswordError(null);
        try {
            const data = await login(loginDetail);
            if (!data.hasProfile) {
                router.replace('/profileSetup');
            } else {
                router.replace('/landing');
            }
        } catch (error) {
            Alert.alert(error.message);
            handleError(error);
        }
        setLoading(false);
    }

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
                    <Image
                        source={Logo}
                        className="w-90 h-60"
                        resizeMode="contain"
                    />

                    <Text
                        className={`text-4xl font-extrabold text-center text-${BWColor}`}
                    >Log In to your Account</Text>
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
                            ...(emailError ? { borderColor: 'red', borderWidth: 2 } : null)
                        }}
                        testID="email-input"
                        placeholder="e_ _ _ _ _ _ _@u.nus.edu"
                        value={loginDetail.email}
                        onChangeText={(text) => setLoginDetail(prev => ({ ...prev, email: text }))}
                        autoCapitalize="none"
                        KeyboardType="email-address"
                        autoCorrect={false}
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
                            ...(emailError ? { borderColor: 'red', borderWidth: 2 } : null)
                        }}
                        testID="password-input"
                        placeholder="password"
                        secureTextEntry={true}
                        value={loginDetail.password}
                        onChangeText={(text) => setLoginDetail(prev => ({ ...prev, password: text }))}
                        autoCapitalize="none"
                    />
                    <Spacer height={20} />

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.7}
                        className="w-[80%]"
                    >
                        <LinearGradient
                            className={`py-3 rounded-xl justify-center items-center ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
                            colors={['#8637CF', '#0F55A1']}
                            start={[0, 1]}
                            end={[1, 0]}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white font-semibold text-lg">Log In</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                    <Spacer height={10} />

                    <Text className={`text-${BWColor}`}>
                        Don't have an Account?
                        <Link href={'/register'} className="font-bold text-red-500">
                            <Spacer height={0} width="4" />
                            Sign Up!
                        </Link>
                    </Text>
                    <Spacer />

                </KeyboardAvoidingView>
            </LinearGradient>
        </TouchableWithoutFeedback >
    )
}
