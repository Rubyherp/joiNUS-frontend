import { View, Text, TouchableOpacity } from "react-native";

export default function ErrorState({ message = "Something went wrong", onRetry }) {
    return (
        <View className="flex-1 items-center justify-center px-8">
            <Text className="text-4xl mb-3">⚠️</Text>
            <Text className="font-semibold text-base text-gray-600 text-center mb-4">{message}</Text>
            {onRetry && (
                <TouchableOpacity
                    onPress={onRetry}
                    className="bg-orange-500 rounded-full px-6 py-2"
                >
                    <Text className="text-white font-bold">Try Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
