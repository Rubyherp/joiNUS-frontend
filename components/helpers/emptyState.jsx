import { View, Text } from 'react-native';

export default function EmptyState({ icon = "📭", title, subtitle }) {
    return (
        <View className="items-center mt-20 px-8">
            <Text className="text-4xl mb-3">{icon}</Text>
            <Text className="font-semibold text-base text-gray-600 text-center">{title}</Text>
            {subtitle && <Text className="text-sm mt-1 text-gray-400 text-center">{subtitle}</Text>}
        </View>
    )
}
