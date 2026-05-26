import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useState } from "react";

//Custom imports
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import Spacer from "@/components/themedComponents/spacer";
import { Divider } from "@/components/ui/divider";
import { UserContext } from "@/context/userContext";

export default function Profile() {
    const [tab, setTab] = useState(0);
    const { profile, changeAvatar } = useContext(UserContext);

    const username = profile.username ?? '';
    const year = profile.year ?? '';
    const major = profile.major ?? '';
    const modules = profile.modules ?? '';
    const contact = profile.contact ?? '';
    const email = profile.email ?? '';
    const about = profile.about ?? '';
    const skills = profile.skills ?? '';
    const experiences = profile.experiences ?? '';

    return (
        <SafeAreaView className="flex-1 items-center px-4">
            <Text className="text-3xl font-bold self-start">Profile</Text>
            <Spacer height={10} />

            <View className="w-full justify-center items-center">
                <View className="flex border border-black rounded-lg p-4 w-full">
                    <View className="flex flex-row border">
                        <TouchableOpacity
                            onPress={changeAvatar}
                            className="flex justify-center"
                        >
                            <View className="border border-black rounded-full self-center">
                                <Avatar size="lg">
                                    <AvatarFallbackText className="font-bold">
                                        {username}
                                    </AvatarFallbackText>
                                    <AvatarImage
                                        source={{
                                            uri: profile.avatar ? `${profile.avatar}?t=${Date.now()}` : ''
                                        }}
                                    />
                                </Avatar>
                            </View>
                        </TouchableOpacity>
                        <Spacer width={20} height={0} />

                        <View className="flex flex-1 justify-center">
                            <Text className="text-2xl font-bold">{username}</Text>
                            <Text className="text-xl">{major}</Text>
                        </View>
                    </View>

                    <Spacer height={20} />
                    <View className="flex ">
                        <View className="gap-1 px-4 w-full">
                            <View className="flex-row items-center">
                                <Text className="text-xl font-bold w-28">Contacts</Text>
                                <Text className="text-lg text-gray-700">{contact}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Text className="text-xl font-bold w-28">Email</Text>
                                <Text className="text-lg text-gray-700">{email}</Text>
                            </View>
                        </View>
                        <Spacer height={10} />

                    </View>
                </View>
            </View>
            <Spacer height={10} />

            <Divider />

            <Spacer height={10} />

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

                <View className="flex-1 p-4">
                    {tab === 0
                        ?
                        <ScrollView
                            showsVerticalScrollIndicator={true}
                            indicatorStyle="black"
                        >
                            <Text className="text-xl font-semibold">Major: </Text>
                            <Text className="text-lg">{major}</Text>
                            <Spacer height={20} />

                            <Text className="text-xl font-semibold">Year of Study: </Text>
                            <Text className="text-lg">{year}</Text>
                            <Spacer height={20} />

                            <Text className="text-xl font-semibold">Modules: </Text>
                            <Text className="text-lg">{modules}</Text>
                            <Spacer height={20} />

                            <Text className="text-xl font-semibold">Desciption: </Text>
                            <Text className="text-lg">{about}</Text>

                            <Spacer height={20} />


                        </ScrollView>
                        : tab === 1
                            ?
                            <ScrollView>
                                <Text className="text-xl font-semibold">Skills: </Text>
                                <Text className="text-lg">{skills}</Text>
                                <Spacer height={20} />

                                <Text className="text-xl font-semibold">Experiences: </Text>
                                <Text className="text-lg">{experiences}</Text>
                            </ScrollView>
                            :
                            <ScrollView>
                                <Text>Posts</Text>
                            </ScrollView>
                    }
                </View>
            </View>

        </SafeAreaView>
    )
}
