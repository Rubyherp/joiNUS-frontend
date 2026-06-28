import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
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
import { router } from "expo-router";
import ProfileSettingPicker from "@/components/helpers/profileSettingPicker";
import { User } from "lucide-react-native";

//TODO: use actionsheet for settings - logout, change password, etc
//TODO: improve color sheme
//TODO: add change password logic
//TODO: add zoom for contacts and email?
//TODO: abstract profile section into reusable component? this one prob ms3

export default function Profile() {
    const { user, profile, changeAvatar, logout } = useContext(UserContext);
    const { fetchPostsByUserId } = useContext(PostContext);
    const [tab, setTab] = useState(0);
    const [profileUri, setProfileUri] = useState('');
    const [posts, setPosts] = useState(null);
    const [selectedSetting, setSelectedSetting] = useState(null);

    const { username, year, major, modules, contact, email, about, skills, experiences } = profile || {};

    const displayUsername = username || 'Anonymous User';
    const displayMajor = major || 'No major set';
    const displayYear = year ? `Year ${year}` : 'Year not set';
    const displayContact = contact || 'No contact added';
    const displayEmail = email || 'No email added';
    const displayAbout = about?.trim() ? about : 'No description yet — tell others about yourself!';
    const displaySkills = skills?.trim() ? skills : 'No skills listed yet';
    const displayExperiences = experiences?.trim() ? experiences : 'No experience listed yet';

    // Modules needs special handling since you .split(' ') on it
    const moduleList = modules?.trim() ? modules.split(' ').filter(Boolean) : [];

    const tabs = ['About', 'Skills & Exp', 'Posts'];

    const loadPosts = async (userId) => {
        try {
            const fetched = await fetchPostsByUserId(userId);
            setPosts(fetched ?? []);
        } catch (error) {
            console.log('Error: Profile', error.message);
            Alert.alert('Error', error.message || 'Failed to load Posts');
        }
    }

    // handle selected setting
    useEffect(() => {
        if (!selectedSetting) {
            return;
        }

        if (selectedSetting === 'EditProfile') {
            console.log('edit profile');
            router.push(`/profileSetup`);
            setSelectedSetting(null);
        }

        if (selectedSetting === 'ChangePassword') {
            console.log('change password');
            setSelectedSetting(null);
        }

        if (selectedSetting === 'Logout') {
            console.log('logout');
            logout();
            router.push(`/login`);
            setSelectedSetting(null);
        }
    }, [selectedSetting]);

    useEffect(() => {
        if (user?.id) {
            loadPosts(user.id);
        }
        if (profile?.avatar) {
            setProfileUri(`${profile.avatar}?t=${Date.now()}`);
        } else {
            setProfileUri('');
        }
    }, [profile?.avatar, user?.id]);

    const handleAvatarChange = async () => {
        const newAvatar = await changeAvatar();
        if (newAvatar?.avatar) {
            setProfileUri(`${newAvatar.avatar}?t=${Date.now()}`);
        }
    }

    if (!profile) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <Text>Loading profile...</Text>
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView
            className="flex-1 items-center px-4 mb-8"
            style={{ backgroundColor: Colors.light.uiBackground }}
            edges={['top']}
        >

            {/* Header */}

            <View className="flex-row my-2 items-center gap-3">
                <User size={48} color="#f97316" />
                <View className="flex-row items-center justify-between flex-1">
                    <View className="flex">
                        <Text className="text-2xl font-extrabold text-gray-800">Profile</Text>
                        <Text className="text-base font-semibold text-gray-500 mt-1">Personalise what others see</Text>
                    </View>

                    <ProfileSettingPicker onSelect={c => setSelectedSetting(c)} />
                </View>
            </View>

            {/* profile card */}
            <View
                className="w-full bg-white rounded-2xl px-5 py-5 mb-3"
                style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.07)' }}
            >
                <View className="flex-row items-center">
                    <TouchableOpacity
                        testID="avatar-button"
                        onPress={handleAvatarChange}
                    >
                        <View
                            className="rounded-full p-[3px]"
                            style={{ backgroundColor: Colors.primary }}
                        >
                            <View className="rounded-full p-[2px] bg-white">

                                <Image
                                    testID="avatar-image"
                                    source={{ uri: profileUri }}
                                    style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 100,
                                    }}
                                />

                            </View>
                        </View>
                    </TouchableOpacity>
                    <Spacer width={16} height={0} />

                    <View className="flex-1">
                        <Text
                            className="text-xl font-bold"
                            style={{ color: Colors.light.title }}
                        >
                            {displayUsername}
                        </Text>
                        <Text
                            className="text-sm mt-0.5"
                            style={{ color: Colors.light.text }}
                        >
                            {displayMajor}
                        </Text>

                        {!!year && (
                            <View
                                className="self-start mt-1.5 px-2.5 py-0.5 rounded-full"
                                style={{ backgroundColor: '#e8f4fd' }}
                            >
                                <Text
                                    className="text-xs font-semibold"
                                    style={{ color: Colors.primary }}
                                >{displayYear}</Text>
                            </View>
                        )}
                    </View>
                </View>

                <Spacer height={14} />

                {/* contacts */}
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
                            >
                                Contacts
                            </Text>
                            <Text
                                className="text-xs font-semibold"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{ color: Colors.light.title }}
                            >
                                {displayContact}
                            </Text>
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
                            >
                                Email
                            </Text>
                            <Text
                                className="text-xs font-semibold"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{ color: Colors.light.title }}
                            >
                                {displayEmail}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* content-tab */}
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


                {/* content */}
                <View className="flex-1 bg-white rounded-b-2xl">

                    {tab === 0 && (
                        <ScrollView
                            showsVerticalScrollIndicator={true}
                            className="p-4"
                        >
                            <ThemedProfileSection title="Major">
                                {displayMajor}
                            </ThemedProfileSection>

                            <ThemedProfileSection title="Year of Study">
                                {String(displayYear)}
                            </ThemedProfileSection>

                            <ThemedProfileSection title="Modules">
                                <View className="flex-row flex-wrap gap-1.5 mt-1">
                                    {moduleList.length > 0 ? (
                                        <View className="flex-row flex-wrap gap-1.5 mt-1">
                                            {moduleList.map((mod, i) => (
                                                <View key={i} className="px-2.5 py-1 rounded-lg" style={{ backgroundColor: Colors.light.uiBackground }}>
                                                    <Text className="text-xs font-semibold" style={{ color: Colors.light.title }}>{mod}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    ) : (
                                        <Text className="text-xs italic mt-1" style={{ color: Colors.light.text }}>
                                            No modules added yet
                                        </Text>
                                    )}
                                </View>
                            </ThemedProfileSection>

                            <ThemedProfileSection title="Description">
                                {displayAbout}
                            </ThemedProfileSection>

                        </ScrollView>
                    )}

                    {tab === 1 && (
                        <ScrollView
                            showsVerticalScrollIndicator={true}
                            className="p-4"
                        >
                            <ThemedProfileSection title="Skills">
                                {displaySkills}
                            </ThemedProfileSection>

                            <ThemedProfileSection title="Experiences">
                                {displayExperiences}
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
