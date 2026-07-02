import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function ThemedUserCard({ item }) {

    return (

        <TouchableOpacity
            className="flex-row items-center py-3 gap-3 border-b border-gray-400"
            onPress={() => router.push({
                pathname: `/dm/${item.id}`,
                params: { username: item.username }
            })}
            activeOpacity={0.7}
        >

            {/* avatar */}
            {item.avatar ? (
                <Image
                    source={{ uri: item.avatar }}
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
                        {item.username ?? 'Unknown'}
                    </Text>
                </View>
                <Text className="text-sm text-gray-500 mt-0.5">
                    {item.major}
                </Text>
            </View>

        </TouchableOpacity>
    )
}
