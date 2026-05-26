import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useState } from "react";

//Custom imports
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import Spacer from "@/components/themedComponents/spacer";
import { Divider } from "@/components/ui/divider";
import { UserContext } from "@/context/userContext";
import ThemedProfileSection from "@/components/themedComponents/themedProfileSection";

export default function Profile() {
    const [tab, setTab] = useState(0);
    const { profile, changeAvatar } = useContext(UserContext);
    const [profileUri, setProfileUri] = useState('');

    const username = profile.username ?? '';
    const year = profile.year ?? '';
    const major = profile.major ?? '';
    const modules = profile.modules ?? '';
    const contact = profile.contact ?? '';
    const email = profile.email ?? '';
    const about = profile.about ?? '';
    const skills = profile.skills ?? '';
    const experiences = profile.experiences ?? '';

    //FIX: fix dynamically loaded avatar on registration and login
    useEffect(() => {
        if (profile?.avatar) {
            setProfileUri(`${profile.avatar}?t=${Date.now()}`);
        } else {
            setProfileUri('');
        }
    }, [profile?.avatar]);

    const handleAvatarChange = async () => {
        const newAvatar = await changeAvatar();
        if (newAvatar?.avatar) {
            setProfileUri(`${newAvatar.avatar}?t=${Date.now()}`);
        }
    }

    return (
        <SafeAreaView className="flex-1 items-center px-4 bg-slate-400">
            <Text className="text-3xl font-bold self-start">Profile</Text>
            <Spacer height={10} />

            <View className="w-full justify-center items-center">
                <View className="flex border border-slate-500 bg-white shadow-sm rounded-2xl px-5 py-5 w-full">
                    <View className="flex flex-row">
                        <TouchableOpacity
                            onPress={handleAvatarChange}
                            className="flex justify-center"
                        >
                            <View className="rounded-full bg-slate-500 p-1 self-center">
                                <Avatar size="xl">
                                    <AvatarFallbackText className="font-bold">
                                        {username}
                                    </AvatarFallbackText>
                                    <AvatarImage
                                        source={{
                                            uri: profileUri
                                        }}
                                    />
                                </Avatar>
                            </View>
                        </TouchableOpacity>
                        <Spacer width={20} height={0} />

                        <View className="flex flex-1 justify-center">
                            <Text className="text-2xl font-bold text-slate-700">{username}</Text>
                            <Text className="text-base text-slate-500 mt-1">{major}</Text>
                        </View>
                    </View>
                    <Spacer height={10} />

                    <View className="flex ">
                        <View className="gap-1 px-4 w-full">
                            <View className="flex-row items-center">
                                <Text className="text-xl font-meduim text-slate-800 w-28">Contacts</Text>
                                <Text className="text-base text-gray-700 flex-1">{contact}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Text className="text-xl font-medium text-slate-800 w-28">Email</Text>
                                <Text className="text-base text-gray-700 flex-1">{email}</Text>
                            </View>
                        </View>

                    </View>
                </View>
            </View>
            <Spacer height={10} />


            <View className="flex-1 w-full border border-black rounded-lg bg-white">
                <View className="flex-row ">
                    <TouchableOpacity
                        className={`flex-1 items-center py-3 border-b-2 justify-center ${tab === 0 ? "border-red-500" : "border-transparent"}`}
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
                        className={`flex-1 items-center py-3 border-b-2 justify-center ${tab === 1 ? "border-red-500" : "border-transparent"}`}
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
                        className={`flex-1 items-center py-3 border-b-2 justify-center ${tab === 2 ? "border-red-500" : "border-transparent"}`}
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
                            <ThemedProfileSection title="Major">
                                {major}
                            </ThemedProfileSection>

                            <ThemedProfileSection title="Year of Study">
                                {year}
                            </ThemedProfileSection>

                            <ThemedProfileSection title="Modules">
                                {modules}
                            </ThemedProfileSection>

                            <ThemedProfileSection title="Description">
                                {about}
                            </ThemedProfileSection>

                        </ScrollView>
                        : tab === 1
                            ?
                            <ScrollView>
                                <ThemedProfileSection title="Skills">
                                    {skills}
                                </ThemedProfileSection>

                                <ThemedProfileSection title="Experiences">
                                    {experiences}
                                </ThemedProfileSection>
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
