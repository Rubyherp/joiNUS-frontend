import { View, Text, Image } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import Logo from '../../assets/images/logo2.png';
import { Link } from "expo-router";

// themed imports
import Spacer from "@/components/themedComponents/spacer";
import ThemedInput from "@/components/themedComponents/themedInput";
import ThemedLink from "@/components/themedComponents/themedLink";


export default function Login() {
    return (
        <TouchableWithoutFeedback>
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
                />
                <Spacer height={10} />

                <ThemedInput
                    className="text-lg border border-black rounded-2xl p-4 w-[80%]"
                    placeholder="PASSWORD"
                />
                <Spacer height={20} />


                <ThemedLink href={'/register'} text={'Register'} style={{ width: "60px" }} />
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
