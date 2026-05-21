import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import Logo from '../../assets/images/logo2.png';
import { Link, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";

// themed imports
import Spacer from "@/components/themedComponents/spacer";
import ThemedInput from "@/components/themedComponents/themedInput";
import { Keyboard } from "react-native";


export default function Register() {
    const { register } = useContext(UserContext);
    const [registerDetail, setRegisterDetail] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        setLoading(true);

        try {
            await register(registerDetail);
            router.replace('/login');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
        setLoading(false);
    }


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex flex-1 justify-center items-center">

                <View
                    className="rounded-2xl overflow-hidden border border-red-500 self-center bg-black px-6 py-3"
                >
                    <Image
                        source={Logo}
                        className="w-80 h-40"
                        resizeMode="contain"
                    />
                </View>
                <Spacer height={60} />
                <Text className="text-4xl font-extrabold text-center">Sign Up!</Text>
                <Spacer />

                <ThemedInput
                    className="text-lg border border-black rounded-2xl p-4 w-[80%]"
                    placeholder="EMAIL"
                    value={registerDetail.email}
                    onChangeText={(text) => setRegisterDetail(prev => ({ ...prev, email: text }))}
                />
                <Spacer height={10} />

                <ThemedInput
                    className="text-lg border border-black rounded-2xl p-4 w-[80%]"
                    placeholder="PASSWORD"
                    secureTextEntry={true}
                    value={registerDetail.password}
                    onChangeText={(text) => setRegisterDetail(prev => ({ ...prev, password: text }))}
                />
                <Spacer height={20} />

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={0.7} // Control the fade opacity when tapped
                    className={`w-[80%] py-3 rounded-xl justify-center items-center ${loading ? 'bg-blue-400' : 'bg-blue-600'
                        }`}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white font-semibold text-sm">Submit</Text>
                    )}
                </TouchableOpacity>
                <Spacer height={10} />

                <Text>
                    Already have an Account?
                    <Link href={'/login'} className="font-bold text-red-500">
                        <Spacer height={0} width="4" />
                        Log In!
                    </Link>
                </Text>
                <Spacer />


            </View>
        </TouchableWithoutFeedback>
    )
}
