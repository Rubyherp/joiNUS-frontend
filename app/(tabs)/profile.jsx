import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//GlueStack imports
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import Spacer from "@/components/themedComponents/spacer";

export default function Profile() {
    return (
        <SafeAreaView className="flex-1 items-center px-4">
            <Text>Profile Page</Text>
            <Spacer />

            <View className="w-full justify-center items-center">
                <View className="flex flex-row border border-black rounded-lg p-4 w-full">
                    <View className="border border-black rounded-full">
                        <Avatar size="lg">
                            <AvatarFallbackText className="font-bold">
                                Xiang Neng
                            </AvatarFallbackText>
                            <AvatarImage
                                source={{
                                    uri: ''
                                }}
                            />
                        </Avatar>
                    </View>
                    <Spacer width={20} height={0} />

                    <View className="flex justify-center">
                        <Text className="text-2xl font-bold">Xiang Neng</Text>
                        <Text className="text-xl">Bachelor of Computer Science</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
