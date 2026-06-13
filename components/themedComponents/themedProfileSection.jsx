
import { View, Text } from "react-native";

export default function ThemedProfileSection({ title, children }) {
    return (
        <View className="mb-6">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                {title}
            </Text>
            <View className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                <Text className="text-base text-gray-800 leading-relaxed">
                    {children}
                </Text>
            </View>
        </View>
    )
}
