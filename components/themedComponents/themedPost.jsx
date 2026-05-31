import { View, Text, Image } from "react-native";
import Logo from "../../assets/images/logo-gold.png";

export default function ThemedPost({ data, children }) {
    const user = "Xiang Neng"
    const community = "Projects"
    const title = "Looking for Orbital teammates"
    const text = "Hey everyone! I'm looking for teammates to join my Orbital project. If you're interested in working on an exciting project and want to collaborate, please reach out to me. Let's create something amazing together!"
    const image = Logo

    return (
        //TODO: Link to actual post
        <View className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden mb-3 shadow-sm">

            <View className="flex-row items-center gap-2 px-4 pt-4 pb-2">
                <View className="bg-purple-100 rounded-full w-8 h-8 items-center justify-center">
                    <Text className="text-purple-600 text-base font-bold">c/</Text>
                </View>
                <Text className="text-base font-semibold text-purple-600">{community}</Text>
                <Text className="text-base text-gray-500">• posted by</Text>
                <View className="bg-purple-100 rounded-full w-8 h-8 items-center justify-center">
                    <Text className="text-orange-800 text-base font-bold">u/</Text>
                </View>
                <Text className="text-base text-gray-600 font-medium">{user}</Text>

            </View>
            <Text className="text-lg font-bold text-gray-900 px-4 pb-2">{title}</Text>
            {text ? (
                <Text className="text-sm text-gray-600 px-4 pb-3 leading-5" numberOfLines={3}>
                    {text}
                </Text>
            ) : null}

            {image ? (
                < Image
                    source={image}
                    className="w-full h-48"
                    resizeMode="cover"
                />
            ) : null}

        </View>
    )
}
