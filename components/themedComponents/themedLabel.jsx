import { View, Text } from "react-native";
import { LinearGradient } from "@/components/ui/linear-gradient";

export default function ThemedLabel({ icon: IconComp, label, optional }) {
    return (
        <View className="flex-row items-center gap-2 mb-2">
            <View className="w-5 h-5 rounded-full overflow-hidden items-center justify-center">
                <LinearGradient
                    colors={['#F97316', '#EC4899']}
                    start={[0, 0]} end={[1, 1]}
                    className="flex-1 w-full items-center justify-center"
                >
                    <IconComp size={11} color="#fff" strokeWidth={2.5} />
                </LinearGradient>
            </View>
            <Text className="text-xs font-bold tracking-widest uppercase text-gray-700">
                {label}
                {optional && (
                    <Text className="text-gray-500 font-normal normal-case tracking-normal"> · optional</Text>
                )}
            </Text>
        </View>
    );
}
