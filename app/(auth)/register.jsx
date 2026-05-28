import { Text, Image, TouchableOpacity, ActivityIndicator, Alert, useColorScheme } from "react-native";
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

    const { register } = useContext(UserContext);
    const [registerDetail, setRegisterDetail] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
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
                    testID="email-input"
                    placeholder="e_______@u.nus.edu"
                    value={registerDetail.email}
                    onChangeText={(text) => setRegisterDetail(prev => ({ ...prev, email: text }))}
                    style={!emailError ? null : { borderColor: 'red', borderWidth: 2 }}
                    autoCapitalize="none"
                    KeyboardType="email-address"
                    autoCorrect={false}
                />
                <Spacer height={10} />

                <ThemedInput
                    className={`text-base text-${BWColor} ${inputBGColor} border-black/10 rounded-2xl w-[80%] h-14 px-4`}
                    testID="password-input"
                    placeholder="PASSWORD"
                    secureTextEntry={true}
                    value={registerDetail.password}
                    onChangeText={(text) => setRegisterDetail(prev => ({ ...prev, password: text }))}
                    style={!passwordError ? null : { borderColor: 'red', borderWidth: 2 }}
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
                            <Text className="text-lg text-white font-semibold ">Register</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
                <Spacer height={10} />

                <Text className={`text-${BWColor}`}>
                    Already have an Account?
                    <Link href={'/login'} className="font-bold text-red-500">
                        <Spacer height={0} width="4" />
                        Log In!
                    </Link>
                </Text>
                <Spacer />

            </LinearGradient>
        </TouchableWithoutFeedback>
    )
}
