
import { View, Text } from "react-native";

export default function ThemedProfileSection({ title, children }) {
    return (
        <View className="mb-6">
            <Text className="text-lg font-medium text-slate-800 uppercase tracking-wide">
                {title}
            </Text>
            <View>
                <Text className="text-base text-gray-900 mt-1">
                    {children}
                </Text>
            </View>
        </View>
    )
}
