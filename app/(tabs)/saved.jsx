import { View, Text, Image, FlatList } from "react-native";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { useState } from "react";
import Logo from "../../assets/images/logo-white.png";
import { SafeAreaView } from "react-native-safe-area-context";

import ThemedInput from "@/components/themedComponents/themedInput";
import { Divider } from "@/components/ui/divider";

//TODO: flatlist mapped as linked to backend data, currently hardcoded for UI purposes
//TODO: link each card to the community page, and add a button to leave the community (or remove from saved)

const communities = [
    { id: '1', name: 'SGExams', description: 'A community for all students in Singapore' },
    { id: '2', name: 'NUS', description: 'A community for all NUS students' },
    { id: '3', name: 'joiNUS', description: 'A community for all NUS students who want to joiNUS' },
];

export default function Saved() {
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
                                        <Text className="text-black/40 text-xl">Search your Communities</Text>
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
                    Your Communities
                </Text>

                <FlatList
                    data={communities}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
                            <Text className="text-lg font-bold text-gray-800">
                                c/ {item.name}
                            </Text>
                            <Text className="text-lg text-gray-800">
                                {item.description}
                            </Text>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView >
    )
}
