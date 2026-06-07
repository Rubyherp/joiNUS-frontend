import { View, Text, Pressable, TouchableOpacity, ActivityIndicator, Alert, } from "react-native";
import { useContext, useEffect, useState } from "react";
import { CommunityContext } from "@/context/communityContext";

import { LinearGradient } from "@/components/ui/linear-gradient";

export default function ThemedCommunity({ data, isFollowed = false, onFollowChange }) {

    const communityName = data?.name ?? 'Unknown Community';
    const { followCommunity, unfollowCommunity } = useContext(CommunityContext);
    const [followed, setFollowed] = useState(isFollowed);
    const [loading, setLoading] = useState(false);

    const getInitials = (name) => name.slice(0, 2).toUpperCase();
    const getColor = (name) => {
        const colors = ['#8637CF', '#F97316', '#EC4899', '#06B6D4', '#10B981'];
        return colors[name.charCodeAt(0) % colors.length];
    }

    const handleFollow = async () => {
        setLoading(true);
        try {
            await followCommunity(data.id);
            setFollowed(true);
            onFollowChange?.();
        } catch (error) {
            Alert.alert('Error', 'Failed to follow community')
        } finally {
            setLoading(false);
        }
    };

    const handleUnfollow = async () => {
        setLoading(true);
        try {
            await unfollowCommunity(data.id);
            setFollowed(false);
            onFollowChange?.();
        } catch (error) {
            Alert.alert('Error', 'Failed to unfollow community')
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFollowed(isFollowed);
    }, [isFollowed])


    //TODO: add onPress to link to actual community Page
    //TODO: maybe follow button as children? so i can reuse this component

    return (
        <Pressable onPress={() => { }}>
            <View className="w-full border-b-2 border-gray-300 overflow-hidden shadow-sm">
                <View className="flex-row items-center w-full gap-2 px-4 pt-4 pb-2">

                    <View
                        className="rounded-full w-16 h-16 items-center justify-center"
                        style={{ backgroundColor: getColor(communityName) }}
                    >
                        <Text className="text-white text-base font-bold"
                        >
                            {getInitials(communityName)}
                        </Text>
                    </View>

                    <View className="flex-1">
                        <Text
                            className="flex-1 text-xl font-semibold text-purple-600"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            c/{communityName}
                        </Text>
                        <Text
                            className="py-1 text-base text-gray-500"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {data?.category ?? "General"} • {data?.tags?.length ?? 0} tags
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={followed ? handleUnfollow : handleFollow}
                        disabled={loading}
                        activeOpacity={0.7}
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        <LinearGradient
                            className={`py-2 px-2 rounded-3xl justify-center items-center`}
                            colors={['#F97316', '#EC4899']}
                            start={[0, 1]}
                            end={[1, 0]}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white font-semibold text-lg"
                                >
                                    {followed ? '− Unfollow' : '+ Follow'}
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                </View>
            </View>
        </Pressable>
    )
}
