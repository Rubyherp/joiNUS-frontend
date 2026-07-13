import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, TouchableWithoutFeedback, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useContext, useState, useRef, useCallback, useEffect } from 'react';
import { SocketContext } from '@/context/socketContext';
import { UserContext } from '@/context/userContext';
import { ChatContext } from '@/context/chatContext';
import ThemedItemPicker from '@/components/themedComponents/themedItemPicker';
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import {
    ImageViewer,
    ImageViewerTrigger,
    ImageViewerContent,
    ImageViewerCloseButton,
    ImageViewerCounter,
} from '@/components/ui/image-viewer';

export default function DMChat() {
    const { userId: otherUserId, username } = useLocalSearchParams();
    const { user, fetchUserDetails } = useContext(UserContext)
    const { joinDM, leaveDM, sendDM, onDM } = useContext(SocketContext);
    const { fetchChatHistory } = useContext(ChatContext);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [attachment, setAttachment] = useState(null);

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
        if (!input.trim() && !attachment) {
            return;
        }
        sendDM(otherUserId, input.trim(), attachment);

        setInput('');
        setAttachment(null)
    };

    const handleAttachment = (type) => {
        //TODO: create a function to handle the attachment based on the type (Image, Document, etc.)
        if (type == 'Image') {
            handleImageSelection();
        } else if (type == 'Document') {
            handleDocumentSelection();
        }
    }

    const handleImageSelection = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.85,
            exif: false,
            base64: false,
            preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
        })

        if (result.canceled) {
            return;
        }

        const image = result.assets[0];
        setAttachment(image)
    }

    const handleDocumentSelection = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['application/pdf', 'application/msword', 'text/plain', 'image/*'],
            copyToCacheDirectory: true,
        });

        if (result.canceled) {
            return;
        }

        const doc = result.assets[0];
        setAttachment(doc)
    }

    const renderItem = useCallback(({ item }) => {
        const isMe = item.sender_id === user?.id;

        return (
            <View className={`px-4 py-1 flex-row ${isMe ? 'justify-end' : 'justify-start'}`}>
                <View className={`max-w-[75%] rounded-2xl px-2 py-2 ${isMe ? 'bg-purple-600' : 'bg-gray-600'} flex`}>
                    {item.message_attachments?.map(att => (
                        att.mime_type?.startsWith('image/') ? (
                            <ImageViewer key={att.id} images={[{ url: att.signedUrl }]}>
                                <ImageViewerTrigger>
                                    <Image
                                        source={{ uri: att.signedUrl }}
                                        alt="Attachment"
                                        className="w-64 aspect-square rounded-lg"
                                        resizeMode="cover"
                                    />
                                </ImageViewerTrigger>
                                <ImageViewerContent>
                                    <ImageViewerCloseButton />
                                    <ImageViewerCounter />
                                </ImageViewerContent>
                            </ImageViewer>
                        ) : (
                            <View key={att.id} className="flex-row items-center gap-2 bg-gray-700 rounded-lg p-2 mt-1">
                                <Ionicons name="document-outline" size={20} color="white" />
                                <Text className="text-white text-sm flex-1" numberOfLines={1}>{att.file_name}</Text>
                            </View>
                        )
                    ))}

                    {item.content && (
                        <Text className='text-white text-md  mt-2'>
                            {item.content}
                        </Text>
                    )}

                    <Text className='text-xs text-slate-200 text-right mt-2'>
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
                    contentContainerStyle={{ paddingVertical: 0 }}
                    ListEmptyComponent={
                        <View className="items-center mt-20">
                            <Text className="text-gray-400">No messages yet. Say hi!</Text>
                        </View>
                    }
                />
            )}

            {attachment && (
                <View className="flex-row items-center bg-gray-300 py-2 px-4 rounded-lg">

                    {attachment.mimeType?.startsWith('image/') ? (
                        <Image source={{ uri: attachment.uri }} className="w-10 h-10 rounded" />
                    ) : (
                        <Ionicons name="document-outline" size={24} color="gray" />
                    )}
                    <Text className="flex-1 ml-2 text-sm font-bold">{attachment.name || 'Attached an Image'}</Text>
                    <TouchableOpacity
                        className="rounded-full w-10 h-10 items-center justify-center"
                        onPress={() => setAttachment(null)}
                    >
                        <Text className="text-red-500 text-lg font-bold">✕</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableWithoutFeedback className='flex-1'>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View className="flex-row justify-center items-center px-4 py-3 bg-white border-t border-gray-200 gap-2">

                        <ThemedItemPicker onSelect={(type) => { handleAttachment(type) }} />

                        <TextInput
                            className="flex-1 bg-gray-400 rounded-full px-4"
                            style={{
                                height: 42,
                                fontSize: 16,
                                lineHeight: 20,
                                textAlignVertical: 'center',
                                paddingTop: 0,
                                paddingBottom: 0,
                            }}
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
                            disabled={!input.trim() && !attachment}
                            className="bg-purple-600 rounded-full w-10 h-10 items-center justify-center"
                            style={{ opacity: input.trim() || attachment ? 1 : 0.4 }}
                        >
                            <Text className="text-white font-bold text-lg">↑</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )

}
