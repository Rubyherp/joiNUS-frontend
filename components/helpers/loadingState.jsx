import { View, Text, ActivityIndicator } from "react-native";

export default function LoadingState({ message = "Loading" }) {
    return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#F97316" />
            <Text className="text-slate-400 text-sm pt-2">{message}</Text>
        </View>
    )
}
