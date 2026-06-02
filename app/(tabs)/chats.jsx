import { View, Text, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import Logo from "../../assets/images/logo-white.png";

import ThemedInput from "@/components/themedComponents/themedInput";
import { Divider } from "@/components/ui/divider";
import { Colors } from "@/assets/colors/Colors";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";

//TODO: map each user as link to individual chat page, currently hardcoded for UI purposes
//TODO: position absolute the search icon for user in the platform

// Temp users
const users = [
    { id: 1, username: "John Doe", profileUri: "" },
    { id: 2, username: "Xiang Neng", profileUri: "" },
    { id: 3, username: "Random Dude", profileUri: "" },
]

export default function Chats() {
    const [query, setQuery] = useState("");

    return (
        <SafeAreaView className="flex-1 px-4">

            <View className="flex-1">
                <View className="items-center">

                    {/* searchbar */}
                    <View className="w-[80%] h-14 justify-center">
                        <LinearGradient
                            className={`p-[2px] rounded-3xl`}
                            colors={['#F97316', '#EC4899']}
                            start={[0, 1]}
                            end={[1, 0]}
                        >
                            <View className="bg-white rounded-3xl h-14 justify-center">
                                {query === "" && (
                                    <View className="absolute left-4 z-10 gap-4 flex-row items-center pointer-events-none">
                                        <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
                                        <Text className="text-black/40 text-xl">Search your Chats</Text>
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
                </View>
                <Divider className="my-4" />

                <Text className="text-2xl font-semibold text-gray-800 uppercase tracking-widest mb-1 px-1">
                    Your Chats
                </Text>

                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
                            <View className="flex-row items-center gap-4 py-2">
                                <View
                                    className="rounded-full p-[3px]"
                                    style={{ backgroundColor: Colors.primary }}
                                >
                                    <View className="border-black rounded-full p-[2px] bg-white">
                                        <Avatar size="lg">
                                            <AvatarFallbackText className="font-bold">
                                                {item.username}
                                            </AvatarFallbackText>
                                            <AvatarImage source={{ uri: item.profileUri }} />
                                        </Avatar>
                                    </View>
                                </View>

                                <Text className="text-lg font-medium">
                                    {item.username}
                                </Text>
                            </View>
                        </View>
                    )}
                />

            </View>

        </SafeAreaView >
    )

}
