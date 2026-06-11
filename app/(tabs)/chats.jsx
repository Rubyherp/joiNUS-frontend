import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, Alert, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useCallback } from "react";
import { useFocusEffect, router } from "expo-router";
import Logo from "../../assets/images/logo-white.png";

import ThemedInput from "@/components/themedComponents/themedInput";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { ChatContext } from "@/context/chatContext";
import Spacer from "@/components/themedComponents/spacer";

//TODO: map each user as link to individual chat page, currently hardcoded for UI purposes
//TODO: position absolute the search icon for user in the platform

export default function Chats() {
    const { loadConversations } = useContext(ChatContext);
    const [query, setQuery] = useState("");
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadConvo = async () => {
        try {
            const conversations = await loadConversations();
            setConversations(conversations);
        } catch (error) {
            console.log(error.message);
            Alert.alert('Error', 'Failed to load Conversations');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadConvo();
        }, [loadConvo])
    );

    const filtered = conversations.filter(c => c.profile?.username?.toLowerCase().includes(query.toLowerCase()));

    const formatTime = iso => {
        if (!iso) {
            return '';
        }

        const date = new Date(iso);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        if (isToday) {
            return date.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' });
    }

    return (
        <SafeAreaView className="flex-1 px-4">
            <TouchableWithoutFeedback className="flex-1">
                <View className="flex-1">

                    {/* header */}
                    <View className="mb-3">
                        <Text className="text-2xl font-extrabold text-gray-800">Messages</Text>
                        <Text className="text-base font-semibold text-gray-500 mt-1">Your Conversations</Text>
                    </View>

                    <Spacer height={10} />

                    {/* searchbar */}
                    <View className="w-full h-14 justify-center">
                        <LinearGradient
                            className={`p-[2px] rounded-3xl`}
                            colors={['#F97316', '#EC4899']}
                            start={[0, 1]}
                            end={[1, 0]}
                        >
                            <View className="bg-white rounded-3xl h-12 justify-center">
                                {query === "" && (
                                    <View className="absolute left-4 z-10 gap-8 flex-row items-center pointer-events-none">
                                        <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
                                        <Text className="text-black/40 text-xl">Search your Chats</Text>
                                    </View>
                                )}

                                <ThemedInput
                                    className="text-xl text-black bg-white border border-black/10 rounded-3xl w-full h-12 px-4"
                                    value={query}
                                    onChangeText={setQuery}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </LinearGradient>
                    </View>

                    <Text className="text-2xl font-semibold text-gray-800 uppercase tracking-widest mb-1 px-1">
                        Your Chats
                    </Text>

                    {loading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator />
                        </View>
                    ) : (

                        <FlatList
                            data={filtered}
                            keyExtractor={(item) => item.room_id}
                            ListEmptyComponent={
                                <View className="items-center mt-20">
                                    <Text className="text-3xl mb-2">💬</Text>
                                    <Text className="font-semibold text-sm text-gray-600">No Conversations</Text>
                                    <Text className="text-xs mt-1 text-gray-400">Chat with other Users</Text>
                                </View>
                            }
                            renderItem={({ item }) => (

                                <TouchableOpacity
                                    className="flex-row items-center py-3 border-b border-gray-100 gap-3 "
                                    onPress={() => router.push({
                                        pathname: `/dm/${item.other_user_id}`,
                                        params: { username: item.profile?.username }
                                    })}
                                    activeOpacity={0.7}
                                >

                                    {/* avatar */}
                                    {item.profile?.avatar ? (
                                        <Image
                                            source={{ uri: item.profile.avatar }}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderWidth: 1,
                                                borderColor: 'pink',
                                                borderRadius: 100,
                                            }}
                                            className="flex-shrink-0"
                                        />
                                    ) : (
                                        <View style={{ width: 30, height: 30, borderRadius: 100, backgroundColor: '#e5e7eb' }} />
                                    )}


                                    {/* message preview */}
                                    <View className="flex-1">
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-base font-semibold text-gray-800">
                                                u/{item.profile?.username ?? 'Unknown'}
                                            </Text>
                                            <Text className="text-sm text-gray-400">
                                                {formatTime(item.last_message_at)}
                                            </Text>
                                        </View>
                                        <Text
                                            className="text-sm text-gray-500 mt-0.5"
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {item.last_message}
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            )}
                        />

                    )}

                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView >
    )

}
