import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, Alert, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useCallback } from "react";
import { useFocusEffect, router } from "expo-router";
import Logo from "../../assets/images/logo-white.png";

import ThemedInput from "@/components/themedComponents/themedInput";
import ThemedChatCard from "@/components/themedComponents/themedChatCard";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { ChatContext } from "@/context/chatContext";
import Spacer from "@/components/themedComponents/spacer";
import { MessageCircleCheck } from "lucide-react-native";
import { Colors } from "@/assets/colors/Colors";

//TODO: map each user as link to individual chat page, currently hardcoded for UI purposes
//TODO: position absolute the search icon for user in the platform

export default function Chats() {
    const { loadConversations } = useContext(ChatContext);

    const [query, setQuery] = useState("");
    const [userQuery, setUserQuery] = useState("");
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);

    const tabs = ['Chats', 'People'];

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

    return (
        <SafeAreaView className="flex-1 px-4">
            <TouchableWithoutFeedback className="flex-1">
                <View className="flex-1">

                    {/* header */}
                    <View className="flex-row items-center gap-3">
                        <MessageCircleCheck size={48} color="#f97316" />
                        <View className="flex-row items-center justify-between flex-1">
                            <View className="flex">
                                <Text className="text-2xl font-extrabold text-gray-800">Messages</Text>
                                <Text className="text-base font-semibold text-gray-500 mt-1">Your Conversations</Text>
                            </View>
                            <Image source={Logo}
                                className="h-20 w-20"
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    <View className="flex-row p-1 pb-4 rounded-xl" style={{ backgroundColor: Colors.light.uiBackground }}>
                        {tabs.map((label, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => setTab(i)}
                                className="flex-1 items-center py-2 rounded-lg border-gray-400"
                                style={tab === i
                                    ? { backgroundColor: "#fff", shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 }
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

                    {/* searchbar */}
                    {tab === 0 ?

                        (
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
                                            className="text-black bg-white border border-black/10 rounded-3xl w-full px-4"
                                            style={{
                                                height: 42,
                                                fontSize: 16,
                                                lineHeight: 20,
                                                textAlignVertical: 'center',
                                                paddingTop: 0,
                                                paddingBottom: 0,
                                            }}
                                            value={query}
                                            onChangeText={setQuery}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                        />
                                    </View>
                                </LinearGradient>
                            </View>
                        ) : (
                            <View className="w-full h-14 justify-center">
                                <LinearGradient
                                    className={`p-[2px] rounded-3xl`}
                                    colors={['#F97316', '#EC4899']}
                                    start={[0, 1]}
                                    end={[1, 0]}
                                >
                                    <View className="bg-white rounded-3xl h-12 justify-center">
                                        {userQuery === "" && (
                                            <View className="absolute left-4 z-10 gap-8 flex-row items-center pointer-events-none">
                                                <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
                                                <Text className="text-black/40 text-xl">Search Users</Text>
                                            </View>
                                        )}

                                        <ThemedInput
                                            className="text-black bg-white border border-black/10 rounded-3xl w-full px-4"
                                            style={{
                                                height: 42,
                                                fontSize: 16,
                                                lineHeight: 20,
                                                textAlignVertical: 'center',
                                                paddingTop: 0,
                                                paddingBottom: 0,
                                            }}
                                            value={userQuery}
                                            onChangeText={setUserQuery}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                        />
                                    </View>
                                </LinearGradient>
                            </View>

                        )}

                    <Spacer height={20} />
                    {
                        tab === 0 ? (
                            <Text className="text-gray-700 text-xl font-bold">Chats</Text>
                        ) : (
                            <Text className="text-gray-700 text-xl font-bold">People</Text>
                        )
                    }

                    {loading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator />
                        </View>
                    ) : tab === 0 ? (

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
                                <ThemedChatCard item={item} />
                            )}
                        />

                    ) : (
                        <View>
                            <Text>
                                New Conversations
                            </Text>
                        </View>
                    )}

                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView >
    )

}
