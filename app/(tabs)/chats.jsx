import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, Alert, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useCallback, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import Logo from "../../assets/images/logo-white.png";

import ThemedInput from "@/components/themedComponents/themedInput";
import ThemedChatCard from "@/components/themedComponents/themedChatCard";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { ChatContext } from "@/context/chatContext";
import Spacer from "@/components/themedComponents/spacer";
import { MessageCircleCheck } from "lucide-react-native";
import { Colors } from "@/assets/colors/Colors";
import { UserContext } from "@/context/userContext";
import ThemedUserCard from "@/components/themedComponents/themedUserCard";
import EmptyState from "@/components/helpers/emptyState";

// 1, map each user as link to individual chat page, currently hardcoded for UI purposes
// 2. position absolute the search icon for user in the platform

//3. set recents as chatted users when userQuery is empty
//4. themedUserCard component
//5. fetchUserByUsername in userContext?
//6. map all possible users to themedUserCard

//TODO: inifinite scroll for users, and conversations, and search results

export default function Chats() {
    const { loadConversations } = useContext(ChatContext);
    const { fetchUserByUsername } = useContext(UserContext);

    const [query, setQuery] = useState("");
    const [userQuery, setUserQuery] = useState("");
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);
    const [users, setUsers] = useState([]);

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

    useEffect(() => {
        if (!userQuery.trim()) {
            setUsers([]);
            return;
        }
        const timeOut = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await fetchUserByUsername(userQuery);
                setUsers(data);
            } catch (error) {
                console.error(error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        }, 300)
        return () => {
            clearTimeout(timeOut)
        };
    }, [userQuery])

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
                            <Text className="text-gray-700 text-xl font-bold">💬 Chats</Text>
                        ) : !userQuery ? (
                            <Text className="text-gray-700 text-xl font-bold">🔄 Recent Conversations</Text>
                        ) : (
                            <Text className="text-gray-700 text-xl font-bold">✨ New Conversations</Text>
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
                                <EmptyState icon="💬" title="No Conversations" subtitle="Chat with other Users" />
                            }
                            renderItem={({ item }) => (
                                <ThemedChatCard item={item} />
                            )}
                        />

                    ) : (

                        !userQuery ? (
                            <FlatList
                                data={filtered}
                                keyExtractor={(item) => item.room_id}
                                ListEmptyComponent={
                                    <EmptyState icon="💬" title="No Recent Conversations" subtitle="Connect and chat with new Users!" />
                                }
                                renderItem={({ item }) => (
                                    <ThemedChatCard item={item} />
                                )}
                            />
                        ) : (

                            loading ? (
                                <ActivityIndicator color={"black"} />
                            ) : (
                                <FlatList
                                    data={users}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <ThemedUserCard item={item} />
                                    )}
                                />
                            )
                        )
                    )}

                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView >
    )

}
