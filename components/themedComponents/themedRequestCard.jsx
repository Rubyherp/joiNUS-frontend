import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
import { useState, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { PostContext } from "@/context/postContext";
import { router } from "expo-router";

//TODO: consider whether the author should have the power to un-accept users.
// Initially thinking no cuz authors can abuse it

export default function ThemedRequestCard({ data, onUpdate }) {
    const { id: requestId, post_id: postId, requester_id: requesterId, message, profiles, status, updated_at: lastUpdated } = data || {};
    const { username, avatar } = profiles || {};
    const { handlePendingRequest } = useContext(PostContext);
    const [loading, setLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(status);

    const handleAction = async (newStatus) => {
        setLoading(true);
        try {
            await handlePendingRequest(requestId, newStatus);
            setCurrentStatus(newStatus);
            onUpdate?.();
        } catch (error) {
            Alert.alert('Error', `Failed to ${newStatus === 'accepted' ? 'accept' : 'reject'} request`);
        } finally {
            setLoading(false);
        }
    }

    console.log('data', data);
    return (
        <View className="w-full border-b-2 border-gray-300 overflow-hidden shadow-base">
            <View className="flex w-full gap-2 px-4 pt-4 pb-2">

                <View className="flex-row flex-1 justify-between">
                    {/* avatar */}
                    <View className="flex-row flex-1 gap-2 items-center">
                        {avatar ? (
                            <Image
                                source={{ uri: avatar }}
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

                        <Text className="text-base text-gray-800 font-medium flex-1"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            u/{username ?? "Unknown User"}
                        </Text>

                    </View>

                    {/* Status and timestamp */}
                    <Text className="text-base text-gray-600 pb-2">
                        {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : ''}
                    </Text>
                </View>

                {/* info */}
                <View className="flex-1">
                    <Text className="text-base text-gray-700 py-1" numberOfLines={2}>
                        {message ?? 'No message provided'}
                    </Text>
                </View>

                {/* action */}
                <View className="flex-1 flex-row justify-evenly items-center gap-2">
                    {loading ? (
                        <ActivityIndicator color={"black"} />
                    ) : currentStatus === 'pending' ? (
                        <>
                            {/* accept */}
                            <TouchableOpacity
                                onPress={() => handleAction('accepted')}
                                activeOpacity={0.7}
                                className="flex-row items-center gap-1 w-20"
                            >
                                <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
                                <Text className="text-base text-gray-700">Accepted</Text>
                            </TouchableOpacity>

                            {/* reject */}
                            <TouchableOpacity
                                onPress={() => handleAction('rejected')}
                                activeOpacity={0.7}
                                className="flex-row items-center gap-1 w-20"
                            >
                                <Ionicons name="close-circle-outline" size={24} color="#EF4444" />
                                <Text className="text-base text-gray-700">Rejected</Text>
                            </TouchableOpacity>

                            {/* chat */}
                            <TouchableOpacity
                                onPress={() => router.push({
                                    pathname: `/dm/${requesterId}`,
                                    params: { username: profiles?.username }
                                })}
                                activeOpacity={0.7}
                                className="flex-row items-center gap-1 w-20"
                            >
                                <Ionicons name="chatbox-ellipses-outline" size={24} color="purple" />
                                <Text className="text-base text-gray-700">Chat</Text>
                            </TouchableOpacity>

                        </>
                    ) : currentStatus === 'accepted' ? (
                        <>
                            <View className="flex-row items-center">
                                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                                <Text className="text-base text-gray-700">Accepted</Text>
                            </View>
                            {/* chat */}
                            <TouchableOpacity
                                onPress={() => router.push({
                                    pathname: `/dm/${requesterId}`,
                                    params: { username: profiles?.username }
                                })}
                                activeOpacity={0.7}
                                className="flex-row items-center gap-1 w-20"
                            >
                                <Ionicons name="chatbox-ellipses-outline" size={24} color="purple" />
                                <Text className="text-base text-gray-700">Chat</Text>
                            </TouchableOpacity>

                        </>
                    ) : (
                        <Ionicons name="close-circle" size={24} color="#EF4444" />
                    )}
                </View>

            </View>

        </View>
    )
}
