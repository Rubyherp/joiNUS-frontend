import { View, Text, TouchableOpacity, ScrollView, ViewBase } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useState } from "react";

//Custom imports
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import Spacer from "@/components/themedComponents/spacer";
import { Divider } from "@/components/ui/divider";
import { UserContext } from "@/context/userContext";
import ThemedProfileSection from "@/components/themedComponents/themedProfileSection";
import { Colors } from "@/assets/colors/Colors";

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

    const tabs = ['About', 'Skills & Exp', 'Posts'];

    //FIX: fix dynamically loaded avatar on registration and login
    //TODO: improve color sheme
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
        <SafeAreaView
            className="flex-1 items-center px-4"
            style={{ backgroundColor: Colors.light.uiBackground }}
        >
            <View className="flex-row items-center justify-between w-full mb-3">
                <Text
                    className="text-3xl font-bold"
                    style={{ color: Colors.light.title }}
                >
                    Profile
                </Text>
                <TouchableOpacity
                    className="px-4 py-1.5 rounded-full"
                    style={{ backgroundColor: Colors.primary }}
                >
                    <Text className="text-white font-semibold text-sm">
                        Edit
                    </Text>
                </TouchableOpacity>
            </View>

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
                                <Avatar size="xl">
                                    <AvatarFallbackText
                                        className="font-bold"
                                    >
                                        {username}
                                    </AvatarFallbackText>
                                    <AvatarImage source={{ uri: profileUri }} />
                                </Avatar>
                            </View>
                        </View>
                    </TouchableOpacity>
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

                <Divider className="mt-2" />

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
                                <View className="items-center py-10">
                                    <Text className="text-3xl mb-2">📭</Text>
                                    <Text className="font-semibold text-sm" style={{ color: Colors.light.title }}>No posts yet</Text>
                                    <Text className="text-xs mt-1" style={{ color: Colors.light.text }}>Posts you share will appear here</Text>
                                </View>
                            </ScrollView>
                    }
                </View>

            </View>

        </SafeAreaView>
    )
}
