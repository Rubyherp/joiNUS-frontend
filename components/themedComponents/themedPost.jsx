import { View, Text, Image } from "react-native";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContext";

//TODO: add user avatar
//TODO: fix text overflow
export default function ThemedPost({ data }) {

    const [author, setAuthor] = useState(null);
    const { author_id, title, description, image_url } = data || {};
    const communityName = data?.communities?.name ?? 'Unknown Community';
    const { fetchUserDetails } = useContext(UserContext);

    useEffect(() => {
        if (author_id) {
            fetchUserDetails(author_id).then(setAuthor).catch(error => { throw error });
        }
    }, [author_id])

    const { username, avatar } = author || {};

    console.log("Author ID:", author_id);
    console.log("Username:", username);
    console.log("Post data:", data);

    return (
        //TODO: Link to actual post
        <View className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden mb-3 shadow-sm">

            <View className="flex-row items-center gap-2 px-4 pt-4 pb-2">
                <View className="bg-purple-100 rounded-full w-8 h-8 items-center justify-center">
                    <Text className="text-purple-600 text-base font-bold">c/</Text>
                </View>
                <Text className="text-base font-semibold text-purple-600">{communityName}</Text>
                <Text className="text-base text-gray-500">• posted by</Text>
                <View className="bg-purple-100 rounded-full w-8 h-8 items-center justify-center">
                    <Text className="text-orange-800 text-base font-bold">u/</Text>
                </View>
                <Text className="text-base text-gray-600 font-medium">{username}</Text>

            </View>
            <Text className="text-lg font-bold text-gray-900 px-4 pb-2">{title}</Text>
            {description ? (
                <Text className="text-sm text-gray-600 px-4 pb-3 leading-5" numberOfLines={3}>
                    {description}
                </Text>
            ) : null}

            {image_url ? (
                < Image
                    source={{ uri: image_url }}
                    className="w-full h-48"
                    resizeMode="cover"
                />
            ) : null}

        </View>
    )
}
