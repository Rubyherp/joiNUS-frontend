import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

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



export default function ThemedChatCard({ item }) {

    return (

        <TouchableOpacity
            className="flex-row items-center py-3 px-4 gap-3 border-b border-gray-100"
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
                        width: 50,
                        height: 50,
                        borderWidth: 1,
                        borderColor: 'pink',
                        borderRadius: 100,
                    }}
                    className="flex-shrink-0"
                />
            ) : (
                <View style={{ width: 40, height: 40, borderRadius: 100, backgroundColor: '#e5e7eb' }} />
            )}


            {/* message preview */}
            <View className="flex-1">
                <View className="flex-row justify-between items-center">
                    <Text className="text-base font-semibold text-gray-800">
                        {item.profile?.username ?? 'Unknown'}
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

    )
}
