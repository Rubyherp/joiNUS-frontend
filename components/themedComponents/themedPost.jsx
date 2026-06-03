import { View, Text, Image } from "react-native";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContext";

//TODO: fix text overflow
//TODO: Link to actual post
export default function ThemedPost({ data }) {

    const [author, setAuthor] = useState(null);
    const { author_id, title, description, image_url } = data || {};
    const communityName = data?.communities?.name ?? 'Unknown Community';
    const { fetchUserDetails } = useContext(UserContext);

    const getInitials = (name) => name.slice(0, 2).toUpperCase();

    const getColor = (name) => {
        const colors = ['#8637CF', '#F97316', '#EC4899', '#06B6D4', '#10B981'];
        return colors[name.charCodeAt(0) % colors.length];
    }

    useEffect(() => {
        if (author_id) {
            fetchUserDetails(author_id).then(setAuthor).catch(error => { throw error });
        }
    }, [author_id])

    const { username, avatar } = author || {};

    console.log("Author ID:", author_id);
    console.log("Avatar URL:", avatar);
    console.log("Username:", username);
    console.log("Post data:", data);

    return (
        <View className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden mb-3 shadow-sm">

            <View className="flex-row items-center w-full gap-2 px-4 pt-4 pb-2">
                <View className="rounded-full w-8 h-8 items-center justify-center" style={{ backgroundColor: getColor(communityName) }}>
                    <Text className="text-white text-base font-bold">{getInitials(communityName)}</Text>
                </View>
                <Text className="text-base font-semibold text-purple-600 flex-shrink-0">{communityName}</Text>

                <Text className="text-base text-gray-500 flex-shrink-0">• posted by</Text>
                <Image
                    source={{ uri: avatar }}
                    style={{
                        width: 30,
                        height: 30,
                        borderWidth: 1,
                        borderColor: 'pink',
                        borderRadius: 100,
                    }}
                    className="flex-shrink-0"
                />
                <Text
                    className="text-base text-gray-800 font-medium flex-1"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {username}
                </Text>

            </View>
            <Text className="text-lg font-bold text-gray-900 px-4 pb-2">{title}</Text>
            {description ? (
                <Text className="text-base text-gray-600 px-4 pb-3 leading-5" numberOfLines={3}>
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
