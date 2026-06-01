import { View, Text, Image, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../assets/images/logo-white.png";
import { useState } from "react";

import ThemedInput from "../../components/themedComponents/themedInput";
import Spacer from "@/components/themedComponents/spacer";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Divider } from "@/components/ui/divider";
import ThemedPost from "@/components/themedComponents/themedPost";

export default function Landing() {
    const [query, setQuery] = useState("");

    return (
        <SafeAreaView className="flex-1">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="justify-center items-center">

                    <View className="w-[80%] h-14 relative justify-center">

                        <LinearGradient
                            className={`p-[2px] rounded-3xl`}
                            colors={['#F97316', '#EC4899']}
                            start={[0, 1]}
                            end={[1, 0]}
                        >
                            <View className="bg-white rounded-3xl h-14 justify-center">
                                {query === "" && (
                                    <View className="absolute left-4 z-10 gap-8 flex-row items-center pointer-events-none">
                                        <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
                                        <Text className="text-black/40 text-xl">Search joiNUS</Text>
                                    </View>
                                )}

                                <ThemedInput
                                    className="text-xl text-black bg-white border border-black/10 rounded-3xl w-full h-14 px-4"
                                    value={query}
                                    onChangeText={setQuery}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </LinearGradient>
                    </View>
                    <Spacer height={10} />
                    <Divider className="w-full" />
                </View>
            </TouchableWithoutFeedback>

            <ScrollView
                className="flex-1 w-full"
                keybourdShouldPersistTaps="handled"
            >
                <ThemedPost />
                <ThemedPost />
                <ThemedPost />
            </ScrollView>
        </SafeAreaView >
    )
}
