import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, TouchableWithoutFeedback, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useContext, useState, useRef, useCallback, useEffect } from 'react';
import { SocketContext } from '@/context/socketContext';
import { UserContext } from '@/context/userContext';
import { ChatContext } from '@/context/chatContext';

export default function DMChat() {
    const { userId: otherUserId, username } = useLocalSearchParams();
    const { user, fetchUserDetails } = useContext(UserContext)
    const { joinDM, leaveDM, sendDM, onDM } = useContext(SocketContext);
    const { fetchChatHistory } = useContext(ChatContext);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    const { avatar } = userData || {};

    const flatListRef = useRef(null);

    // socket and load history
    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            try {
                const userData = await fetchUserDetails(otherUserId);
                const history = await fetchChatHistory(otherUserId);
                setUserData(userData);
                setMessages(history || []);
                setLoading(false);

            } catch (error) {
                Alert.alert('Error', error.message || 'Failed to fetch chat history');
                setLoading(false);
            }
        }
        fetchData();

        joinDM(otherUserId);

        const unsub = onDM((msg) => {
            setMessages(prev => [...prev, msg]);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        });

        return () => {
            leaveDM(otherUserId);
            unsub();
        };

    }, [otherUserId, fetchChatHistory])

    const handleSend = () => {
        if (!input.trim()) {
            return;
        }
        sendDM(otherUserId, input.trim());
        setInput('');
    };

    const renderItem = useCallback(({ item }) => {
        const isMe = item.sender_id === user?.id;

        return (
            <View className={`px-4 py-1 flex-row ${isMe ? 'justify-end' : 'justify-start'}`}>
                <View className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-purple-600' : 'bg-gray-600'} flex`}>
                    <Text className='text-white'>
                        {item.content}
                    </Text>

                    <Text className='text-xs mt-0.5 text-slate-200 text-right'>
                        {new Date(item.created_at).toLocaleTimeString('en-SG', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}

                    </Text>
                </View>
            </View>
        )
    }, [user]);

    return (
        <SafeAreaView className='flex-1 bg-gray-50'>

            {/* header */}
            <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-2xl text-gray-500 mr-3">←</Text>
                </TouchableOpacity>

                <Pressable
                    className='flex-row gap-2 items-center'
                    onPress={() => router.push(`userProfile/${otherUserId}`)}
                >
                    {avatar ? (
                        <Image
                            source={{ uri: avatar }}
                            style={{
                                width: 30,
                                height: 30,
                                borderWidth: 1,
                                borderColor: 'pink',
                                borderRadius: 100,
                            }}
                            className="flex-shrink-0"
                        />
                    ) : (
                        <View style={{ width: 30, height: 30, borderRadius: 100, backgroundColor: '#e5e7eb' }} />
                    )}

                    <Text className="text-lg font-bold text-gray-800">
                        {username ?? 'Chat'}
                    </Text>
                </Pressable>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: false })
                    }
                    contentContainerStyle={{ paddingVertical: 12 }}
                    ListEmptyComponent={
                        <View className="items-center mt-20">
                            <Text className="text-gray-400">No messages yet. Say hi!</Text>
                        </View>
                    }
                />
            )}

            <TouchableWithoutFeedback className='flex-1'>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View className="flex-row justify-center items-center px-4 py-3 bg-white border-t border-gray-200 gap-2">
                        <TextInput
                            className="flex-1 bg-gray-400 rounded-full px-4 py-2 text-lg justify-center"
                            placeholder="Message..."
                            placeholderTextColor={'purple'}
                            value={input}
                            onChangeText={setInput}
                            onSubmitEditing={handleSend}
                            returnKeyType="send"
                            autoCorrect={false}
                        />
                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={!input.trim()}
                            className="bg-purple-600 rounded-full w-10 h-10 items-center justify-center"
                            style={{ opacity: input.trim() ? 1 : 0.4 }}
                        >
                            <Text className="text-white font-bold text-lg">↑</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )

}
