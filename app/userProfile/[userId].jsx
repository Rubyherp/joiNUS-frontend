import { View, Text, TouchableOpacity, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useState } from "react";

//Custom imports
import Spacer from "@/components/themedComponents/spacer";
import { UserContext } from "@/context/userContext";
import ThemedProfileSection from "@/components/themedComponents/themedProfileSection";
import { Colors } from "@/assets/colors/Colors";
import { PostContext } from "@/context/postContext";
import ThemedPost from "@/components/themedComponents/themedPost";
import { Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

export default function UserProfile() {
    const { userId } = useLocalSearchParams();
    const { user: viewer, fetchUserDetails } = useContext(UserContext);
    const { fetchPostsByUserId } = useContext(PostContext);
    const [tab, setTab] = useState(0);
    const [user, setUser] = useState(null);
    const [profileUri, setProfileUri] = useState('');
    const [posts, setPosts] = useState(null);

    const { username, avatar, year, major, modules, contact, email, about, skills, experiences } = user || {};

    const tabs = ['About', 'Skills & Exp', 'Posts'];

    const loadData = async (userId) => {
        try {
            const [postsData, userData] = await Promise.all([
                fetchPostsByUserId(userId),
                fetchUserDetails(userId)
            ])
            setPosts(postsData ?? []);
            setUser(userData);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', error.message || 'Failed to load data');
        }
    }

    useEffect(() => {
        if (userId) {
            loadData(userId);
        }
        if (avatar) {
            setProfileUri(`${avatar}?t=${Date.now()}`);
        } else {
            setProfileUri('');
        }
    }, [userId, user]);

    if (!user) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <Text>Loading profile...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            className="flex-1 items-center px-4"
            style={{ backgroundColor: Colors.light.uiBackground }}
            edges={['top']}
        >
            <View className="flex-row items-center justify-between w-full mb-3">

                <View className="flex-1 ">
                    <Pressable onPress={() => router.back()} className="mr-3 p-1 gap-2 flex-row justify-center items-center">
                        <Text className="text-2xl text-gray-500">←</Text>
                        <Text className="text-base font-semibold text-gray-800 flex-1 justify-center">Back</Text>
                    </Pressable>
                </View>


                {/* check if viewing own profile */}
                {userId !== viewer?.id && (
                    <TouchableOpacity
                        className="px-4 py-1.5 rounded-full bg-green-800"
                        onPress={() => router.push({
                            pathname: `/dm/${userId}`,
                            params: { username }
                        })}
                    >
                        <Text className="text-white font-semibold text-sm">
                            Chat
                        </Text>
                    </TouchableOpacity>
                )}

            </View>

            <View
                className="w-full bg-white rounded-2xl px-5 py-5 mb-3"
                style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.07)' }}
            >
                <View className="flex-row items-center">
                    <View
                        className="rounded-full p-[3px]"
                        style={{ backgroundColor: Colors.primary }}
                    >
                        <View className="rounded-full p-[2px] bg-white">

                            <Image
                                source={{ uri: profileUri }}
                                style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: 100,
                                }}
                            />

                        </View>
                    </View>
                    <Spacer width={16} height={0} />

                    <View className="flex-1">
                        <Text
                            className="text-xl font-bold"
                            style={{ color: Colors.light.title }}
                        >
                            {username}
                        </Text>
                        <Text
                            className="text-sm mt-0.5"
                            style={{ color: Colors.light.text }}
                        >
                            {major}
                        </Text>

                        {!!year && (
                            <View
                                className="self-start mt-1.5 px-2.5 py-0.5 rounded-full"
                                style={{ backgroundColor: '#e8f4fd' }}
                            >
                                <Text
                                    className="text-xs font-semibold"
                                    style={{ color: Colors.primary }}
                                >Year {year}</Text>
                            </View>
                        )}
                    </View>
                </View>

                <Spacer height={14} />

                <View className="flex-row gap-2">
                    <View
                        className="flex-1 flex-row items-center gap-2 rounded-xl px-3 py-2.5"
                        style={{ backgroundColor: Colors.light.uiBackground }}
                    >
                        <View className="w-7 h-7 rounded-lg items-center justify-center" style={{ backgroundColor: '#e8f4fd' }}>
                            <Text style={{ color: Colors.primary, fontSize: 13 }}>📱</Text>
                        </View>

                        <View style={{ flex: 1, minWidth: 0 }}>
                            <Text
                                className="text-[10px] font-semibold uppercase tracking-widest"
                                style={{ color: Colors.light.text }}
                            >Contacts</Text>
                            <Text
                                className="text-xs font-semibold"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{ color: Colors.light.title }}
                            >{contact}</Text>
                        </View>
                    </View>


                    <View className="flex-1 flex-row items-center gap-2 rounded-xl px-3 py-2.5"
                        style={{ backgroundColor: Colors.light.uiBackground }}>
                        <View className="w-7 h-7 rounded-lg items-center justify-center" style={{ backgroundColor: '#e8f4fd' }}>
                            <Text style={{ color: Colors.primary, fontSize: 13 }}>✉️</Text>
                        </View>

                        <View style={{ flex: 1, minWidth: 0 }}>
                            <Text
                                className="text-[10px] font-semibold uppercase tracking-widest"
                                style={{ color: Colors.light.text }}
                            >Email</Text>
                            <Text
                                className="text-xs font-semibold"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{ color: Colors.light.title }}
                            >{email}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View className="flex-1 w-full bg-white rounded-2xl overflow-hidden" style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.07)' }}>
                <View className="flex-row mx-3 mt-3 mb-0 p-1 rounded-xl" style={{ backgroundColor: Colors.light.uiBackground }}>
                    {tabs.map((label, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => setTab(i)}
                            className="flex-1 items-center py-2 rounded-lg"
                            style={tab === i
                                ? { backgroundColor: '#ffffff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 }
                                : {}
                            }
                        >
                            <Text
                                className="text-xs font-bold"
                                style={{ color: tab === i ? Colors.light.title : Colors.light.text }}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>


                <View className="flex-1 ">

                    {tab === 0 && (
                        <ScrollView
                            showsVerticalScrollIndicator={true}
                            className="p-4"
                        >
                            <ThemedProfileSection title="Major">
                                {major}
                            </ThemedProfileSection>

                            <ThemedProfileSection title="Year of Study">
                                {year}
                            </ThemedProfileSection>

                            <ThemedProfileSection title="Modules">
                                <View className="flex-row flex-wrap gap-1.5 mt-1">
                                    {modules.split(' ').filter(Boolean).map((mod, i) => (
                                        <View key={i} className="px-2.5 py-1 rounded-lg" style={{ backgroundColor: Colors.light.uiBackground }}>
                                            <Text className="text-xs font-semibold" style={{ color: Colors.light.title }}>{mod}</Text>
                                        </View>
                                    ))}
                                </View>
                            </ThemedProfileSection>

                            <ThemedProfileSection title="Description">
                                {about}
                            </ThemedProfileSection>

                        </ScrollView>
                    )}

                    {tab === 1 && (
                        <ScrollView
                            showsVerticalScrollIndicator={true}
                            className="p-4"
                        >
                            <ThemedProfileSection title="Skills">
                                {skills}
                            </ThemedProfileSection>

                            <ThemedProfileSection title="Experiences">
                                {experiences}
                            </ThemedProfileSection>
                        </ScrollView>
                    )}

                    {tab === 2 && (
                        posts === null ? (
                            <View className="flex-1 items-center justify-center py-10">
                                <Text style={{ color: Colors.light.text }}>Loading posts...</Text>
                            </View>
                        ) : posts.length > 0 ? (
                            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={true}>
                                <View className="pt-2 pb-6">
                                    {posts.map(post => (
                                        <ThemedPost key={post.id} data={post} />
                                    ))}
                                </View>
                            </ScrollView>
                        ) : (
                            <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                                <View className="items-center py-10">
                                    <Text className="text-3xl mb-2">📭</Text>
                                    <Text className="font-semibold text-sm" style={{ color: Colors.light.title }}>No posts yet</Text>
                                    <Text className="text-xs mt-1" style={{ color: Colors.light.text }}>Posts you share will appear here</Text>
                                </View>
                            </ScrollView>
                        )
                    )}
                </View>

            </View>

        </SafeAreaView >
    )
}
