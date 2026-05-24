import { View, Text, Button, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

//Custom imports
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import Spacer from "@/components/themedComponents/spacer";
import { Divider } from "@/components/ui/divider";

export default function Profile() {
    const [tab, setTab] = useState(0);

    return (
        <SafeAreaView className="flex-1 items-center px-4">
            <Text>Profile Page</Text>
            <Spacer />

            <View className="w-full justify-center items-center">
                <View className="flex flex-row border border-black rounded-lg p-4 w-full">
                    <View className="border border-black rounded-full">
                        <Avatar size="lg">
                            <AvatarFallbackText className="font-bold">
                                Xiang Neng
                            </AvatarFallbackText>
                            <AvatarImage
                                source={{
                                    uri: ''
                                }}
                            />
                        </Avatar>
                    </View>
                    <Spacer width={20} height={0} />

                    <View className="flex justify-center">
                        <Text className="text-2xl font-bold">Xiang Neng</Text>
                        <Text className="text-xl">Bachelor of Computer Science</Text>
                    </View>
                </View>
            </View>
            <Spacer height={20} />
            <Divider />
            <Spacer height={20} />

            <View className="flex-1 w-full border border-black rounded-lg">

                <View className="flex-row ">
                    <TouchableOpacity
                        className="flex-1 items-center py-3 justify-center"
                        onPress={() => setTab(0)}
                    >
                        <Text
                            className="text-xl text-black font-bold text-center"
                            style={{ color: tab === 0 ? 'red' : 'black' }}
                        >
                            About
                        </Text>
                    </TouchableOpacity>
                    <View className="w-px bg-gray-300 my-2" />

                    <TouchableOpacity
                        className="flex-1 items-center py-3 justify-center"
                        onPress={() => setTab(1)}
                    >
                        <Text
                            className="text-xl text-black font-bold text-center"
                            style={{ color: tab === 1 ? 'red' : 'black' }}
                        >
                            Skills & Experiences
                        </Text>
                    </TouchableOpacity>
                    <View className="w-px bg-gray-300 my-2" />

                    <TouchableOpacity
                        className="flex-1 items-center py-3 justify-center"
                        onPress={() => setTab(2)}
                    >
                        <Text
                            className="text-xl text-black font-bold text-center"
                            style={{ color: tab === 2 ? 'red' : 'black' }}
                        >
                            Posts
                        </Text>
                    </TouchableOpacity>
                </View>
                <Divider />
                <Spacer height={20} />

                {tab === 0
                    ?
                    <>
                        <Text>Desciption</Text>
                    </>
                    : tab === 1
                        ?
                        <>
                            <Text>Skills and exp</Text>
                        </>
                        :
                        <>
                            <Text>Posts</Text>
                        </>
                }
            </View>

        </SafeAreaView>
    )
}
