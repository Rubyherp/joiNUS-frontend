//TODO: Maybe add forget password or smt?

import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import Logo from '../../assets/images/logo-white.png';
import { Link, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import EmailError from "@/customError/emailError";
import EmptyPasswordError from "@/customError/emptyPasswordError";
import { LinearGradient } from "@/components/ui/linear-gradient";

// themed imports
import Spacer from "@/components/themedComponents/spacer";
import ThemedInput from "@/components/themedComponents/themedInput";
import { Keyboard } from "react-native";


export default function Register() {
    const { login } = useContext(UserContext);
    const [loginDetail, setLoginDetail] = useState({ email: '', password: '' });
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
            await login(loginDetail);
            router.replace('/profile');
        } catch (error) {
            Alert.alert(error.message);
            handleError(error);
        }
        setLoading(false);
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {/* <View className="flex flex-1 justify-center items-center bg"> */}

            <LinearGradient
                className="flex-1 items-center justify-center px-8 py-12"
                colors={['#FF6B6B', '#FFE66D']}
                start={[0, 0]}
                end={[1, 1]}
            >

                <Image
                    source={Logo}
                    className="w-90 h-60"
                    resizeMode="contain"
                />

                <Text className="text-4xl font-extrabold text-center">Log In to your Account</Text>
                <Spacer />

                <ThemedInput
                    className="text-lg border border-black rounded-2xl p-4 w-[80%]"
                    placeholder="EMAIL"
                    value={loginDetail.email}
                    onChangeText={(text) => setLoginDetail(prev => ({ ...prev, email: text }))}
                    style={!emailError ? null : { borderColor: 'red', borderWidth: 2 }}
                    autoCapitalize="none"
                />
                <Spacer height={10} />

                <ThemedInput
                    className="text-lg border border-black rounded-2xl p-4 w-[80%]"
                    placeholder="PASSWORD"
                    secureTextEntry={true}
                    value={loginDetail.password}
                    onChangeText={(text) => setLoginDetail(prev => ({ ...prev, password: text }))}
                    style={!passwordError ? null : { borderColor: 'red', borderWidth: 2 }}
                    autoCapitalize="none"
                />
                <Spacer height={20} />

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={0.7} // Control the fade opacity when tapped
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




                <Text>
                    Don't have an Account?
                    <Link href={'/register'} className="font-bold text-red-500">
                        <Spacer height={0} width="4" />
                        Sign Up!
                    </Link>
                </Text>
                <Spacer />


                {/* </View> */}
            </LinearGradient>
        </TouchableWithoutFeedback>
    )
}
