import { View, Text, Image, Pressable } from "react-native";
import { useContext, useEffect, useState } from "react";
import { router } from "expo-router";

import { CommunityContext } from "@/context/communityContext";
import { UserContext } from "@/context/userContext";
import { EyeOff } from "lucide-react-native";

export default function ThemedPost({ data }) {

    const [author, setAuthor] = useState(null);
    const [community, setCommunity] = useState(null);
    const [imageDimensions, setImageDimensions] = useState(null);
    const [imgContainerWidth, setImgContainerWidth] = useState(0);
    const { author_id, title, description, image_url, community_id } = data || {};
    const { fetchUserDetails } = useContext(UserContext);
    const { fetchCommunityById } = useContext(CommunityContext);

    useEffect(() => {
        if (!image_url) return;
        let cancelled = false;
        Image.getSize(image_url, (w, h) => {
            if (!cancelled) {
                setImageDimensions({ w, h });
            }
        }, () => {
            if (!cancelled) {
                setImageDimensions(null);
            }
        });
        return () => { cancelled = true; };
    }, [image_url]);

    const MAX_IMAGE_HEIGHT = 450;
    const displayHeight = imageDimensions && imgContainerWidth > 0
        ? Math.min(imgContainerWidth * imageDimensions.h / imageDimensions.w, MAX_IMAGE_HEIGHT)
        : null;

    useEffect(() => {
        const loadData = async () => {
            try {
                const [author, community] = await Promise.all([
                    fetchUserDetails(author_id),
                    fetchCommunityById(community_id)
                ]);
                setAuthor(author);
                setCommunity(community);
            } catch (error) {
                setAuthor(null);
                setCommunity(null);
            }
        }
        loadData();
    }, [author_id, community_id])

    const getInitials = (name) => name?.slice(0, 2).toUpperCase() ?? '??';
    const getColor = (name) => {
        const colors = ['#8637CF', '#F97316', '#EC4899', '#06B6D4', '#10B981'];
        return name ? colors[name.charCodeAt(0) % colors.length] : '#8637CF';
    }
    const { username, avatar } = author || {};
    const { name: communityName, } = community || {};
    const isAnonymous = data.is_anonymous;

    return (
        <Pressable onPress={() => router.push(`post/${data.id}`)}>
            <View className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden mb-3 shadow-sm">

                <View className="flex-row items-center w-full gap-2 px-4 pt-4 pb-2">

                    <Pressable
                        onPress={() => router.push(`/community/${community_id}`)}
                        className="flex-row items-center gap-2"
                    >
                        <View className="rounded-full w-8 h-8 items-center justify-center" style={{ backgroundColor: getColor(communityName) }}>
                            <Text className="text-white text-base font-bold">{getInitials(communityName)}</Text>
                        </View>
                        <Text className="text-base font-semibold text-purple-600 flex-shrink-0">{communityName}</Text>

                    </Pressable>

                    <Text className="text-base text-gray-500 flex-shrink-0">• posted by</Text>

                    <Pressable
                        onPress={() => !isAnonymous && router.push(`userProfile/${author_id}`)}
                        className="flex-row items-center gap-2 flex-1"
                    >
                        {!isAnonymous && avatar ? (
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
                        ) : (
                            <View style={{ width: 30, height: 30, borderRadius: 100, backgroundColor: '#d1d5db', justifyContent: 'center', alignItems: 'center' }}>
                                <EyeOff size={16} color="#6b7280" />
                            </View>
                        )}
                        <Text className="text-base text-gray-800 font-medium flex-1"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {!isAnonymous ? username : 'Hidden'}
                        </Text>
                    </Pressable>

                </View>
                <Text className="text-lg font-bold text-gray-900 px-4 pb-2">{title}</Text>
                {description ? (
                    <Text className="text-base text-gray-600 px-4 pb-3 leading-5" numberOfLines={3}>
                        {description}
                    </Text>
                ) : null}

                {image_url ? (

                    <View
                        onLayout={(e) => setImgContainerWidth(e.nativeEvent.layout.width)}
                    >
                        <Image
                            source={{ uri: image_url }}
                            style={{
                                width: '100%',
                                height: displayHeight ?? undefined,
                                aspectRatio: displayHeight ? undefined : 16 / 9,
                            }}
                            resizeMode="cover"
                        />
                    </View>
                ) : null}

            </View>
        </Pressable >
    )
}
