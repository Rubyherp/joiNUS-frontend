import { View } from "react-native";
import { LinearGradient } from "@/components/ui/linear-gradient";

export default function ThemedSectionCard({ children }) {

    return (
        <View
            className="mb-5 rounded-2xl bg-white overflow-hidden"
            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3 }}
        >

            <View className="absolute top-0 left-0 w-1 rounded-l-2xl overflow-hidden">
                <LinearGradient
                    colors={['#F97316', '#EC4899']}
                    start={[0, 0]} end={[0, 1]}
                    className="flex-1"
                />
            </View>
            <View className="pl-5 pr-4 py-4">
                {children}
            </View>
        </View >
    )
}
