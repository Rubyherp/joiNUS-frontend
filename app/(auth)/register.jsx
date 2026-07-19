import { Text, Image, TouchableOpacity, ActivityIndicator, Alert, useColorScheme, KeyboardAvoidingView, Platform } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import LogoLight from '../../assets/images/logo-white.png';
import LogoDark from '../../assets/images/logo-gold.png';
import { Link, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import EmailError from "@/customError/emailError";
import EmptyPasswordError from "@/customError/emptyPasswordError";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Colors } from "@/assets/colors/Colors";

// themed imports
import Spacer from "@/components/themedComponents/spacer";
import ThemedInput from "@/components/themedComponents/themedInput";
import { Keyboard } from "react-native";


export default function Register() {
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const Logo = theme === 'light' ? LogoLight : LogoDark;
    const colors = Colors[theme].gradient;
    const BWColor = theme === 'dark' ? 'white' : 'black';
    const inputBGColor = theme == 'dark' ? 'bg-sky-900' : 'bg-white';

    const { register, sendOtp } = useContext(UserContext);
    const [registerDetail, setRegisterDetail] = useState({ email: '', otp: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [step, setStep] = useState('email');
    const router = useRouter();
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const handleError = (error) => {
        if (error instanceof EmailError) {
            setEmailError(true);
        }
        if (error instanceof EmptyPasswordError) {
            setPasswordError(true);
        }
    }

    const handleSendOtp = async () => {
        if (!registerDetail.email) return;
        setOtpLoading(true);
        setEmailError(null);

        try {
            await sendOtp(registerDetail.email);
            setStep('otp');
        } catch (error) {
            Alert.alert(error.message);
        }
        setOtpLoading(false);
    }

    const handleSubmit = async () => {
        setLoading(true);
        setEmailError(null);
        setPasswordError(null);

        try {
            await register(registerDetail);
            router.replace('/login');
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
                    >Sign Up!</Text>
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
                        value={registerDetail.email}
                        onChangeText={(text) => setRegisterDetail(prev => ({ ...prev, email: text }))}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoCorrect={false}
                    />
                    <Spacer height={10} />

                    <TouchableOpacity
                        onPress={handleSendOtp}
                        disabled={otpLoading}
                        activeOpacity={0.7}
                        className="w-[80%]"
                    >
                        <LinearGradient
                            className="py-3 rounded-xl justify-center items-center"
                            colors={['#8637CF', '#0F55A1']}
                            start={[0, 1]}
                            end={[1, 0]}
                        >
                            {otpLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-lg text-white font-semibold">Send OTP</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                    <Spacer height={10} />

                    {step === 'otp' || step === 'password' ? (
                        <>
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
                                testID="otp-input"
                                placeholder="Enter OTP"
                                value={registerDetail.otp}
                                onChangeText={(text) => {
                                    setRegisterDetail(prev => ({ ...prev, otp: text }));
                                    if (text.length === 8) {
                                        setStep('password');
                                    }
                                }}
                                autoCapitalize="none"
                                keyboardType="number-pad"
                                maxLength={8}
                            />
                            <Spacer height={10} />
                        </>
                    ) : null}

                    {step === 'password' ? (
                        <>
                            <ThemedInput
                                className={`text-base text-${BWColor} ${inputBGColor} border-black/10 rounded-2xl w-[80%] h-14 px-4`}
                                style={{
                                    height: 42,
                                    fontSize: 16,
                                    lineHeight: 20,
                                    textAlignVertical: 'center',
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    ...(passwordError ? { borderColor: 'red', borderWidth: 2 } : null)
                                }}
                                testID="password-input"
                                placeholder="password"
                                secureTextEntry={true}
                                value={registerDetail.password}
                                onChangeText={(text) => setRegisterDetail(prev => ({ ...prev, password: text }))}
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
                                    className="py-3 rounded-xl justify-center items-center"
                                    colors={['#8637CF', '#0F55A1']}
                                    start={[0, 1]}
                                    end={[1, 0]}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text className="text-lg text-white font-semibold">Create Account</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </>
                    ) : null}

                    <Spacer height={10} />

                    <Text className={`text-${BWColor}`}>
                        Already have an Account?
                        <Link href={'/login'} className="font-bold text-red-500">
                            <Spacer height={0} width="4" />
                            Log In!
                        </Link>
                    </Text>
                    <Spacer />

                </KeyboardAvoidingView>
            </LinearGradient>
        </TouchableWithoutFeedback>
    )
}
