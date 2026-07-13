import { View, Text, Image, Pressable, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useState } from "react";

import { CommunityContext } from "@/context/communityContext";
import { PostContext } from "@/context/postContext";
import { Ionicons } from '@expo/vector-icons';
import ThemedPost from "@/components/themedComponents/themedPost";
import LoadingState from "@/components/helpers/loadingState";

export default function CommunityPage() {
    const { communityId } = useLocalSearchParams();
    const { fetchCommunityById, followCommunity, unfollowCommunity } = useContext(CommunityContext);
    const { fetchPosts } = useContext(PostContext);

    const [community, setCommunity] = useState(null);
    const [posts, setPosts] = useState([]);
    const [followed, setFollowed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingCommunity, setLoadingCommunity] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const [communityData, allPosts] = await Promise.all([
                    fetchCommunityById(communityId),
                    fetchPosts()
                ])
                const communityPosts = allPosts.filter(p => p.community_id === communityId);
                setCommunity(communityData);
                setPosts(communityPosts);
                setFollowed(communityData?.community_follows.length > 0)
            } catch (error) {
                Alert.alert('Error', 'Failed to load community');
            } finally {
                setLoadingCommunity(false);
            }
        }
        getData();
    }, []);

    const handleFollow = async () => {
        setLoading(true);
        try {
            followed ? await unfollowCommunity(communityId) : await followCommunity(communityId);
            setFollowed(!followed);
        } catch (error) {
            Alert.alert('Error', `Failed to ${followed ? 'unfollow' : 'follow'} community`);
        } finally {
            setLoading(false);
        }
    }

    const getInitials = (name) => name?.slice(0, 2).toUpperCase() ?? "??";
    const getColor = (name) => {
        const colors = ['#8637CF', '#F97316', '#EC4899', '#06B6D4', '#10B981'];
        return name ? colors[name.charCodeAt(0) % colors.length] : '#8637CF';
    };
    const formatDate = (iso) => {
        if (!iso) return null;
        return new Date(iso).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const { name, description, category, tags, created_at, created_by } = community || {};

    if (loadingCommunity) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <LoadingState message="Loading community..." />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100">

            {/* Header */}
            <View className="flex-row h-16 py-3 bg-white border-b border-gray-200">
                <View className="flex-1">
                    <Pressable onPress={() => router.back()} className="mr-3 p-1 gap-2 flex-row justify-center items-center">
                        <Text className="text-2xl text-gray-500">←</Text>
                        <Text className="text-base font-semibold text-gray-800 flex-1 justify-center" numberOfLines={1}>
                            {name ? `${name}` : 'Community'}
                        </Text>
                    </Pressable>
                </View>

                {/* Follow button */}
                <View className="w-20 flex items-center justify-center">
                    <TouchableOpacity
                        onPress={handleFollow}
                        disabled={loading}
                        activeOpacity={0.7}
                        style={{ opacity: loading ? 0.7 : 1 }}
                        className="flex justify-center items-center"
                    >
                        {loading ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <Ionicons
                                name={followed ? 'heart' : 'heart-outline'}
                                size={24}
                                color={followed ? '#EC4899' : 'black'}
                            />
                        )}
                    </TouchableOpacity>
                    <Text className="text-sm text-gray-500">{followed ? 'following' : 'follow'}</Text>
                </View>
            </View>

            {/* Main card */}
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>

                <View className="bg-white mb-2">

                    {/* Name */}
                    <View className="flex-row items-center px-4 pt-4 pb-2 gap-3">
                        <View
                            className="rounded-full w-14 h-14 items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: getColor(name) }}
                        >
                            <Text className="text-white text-lg font-bold">{getInitials(name)}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-xl font-bold text-purple-600">{name}</Text>
                            <Text className="text-sm text-gray-400">{category} · since {formatDate(created_at)}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    {description ? (
                        <Text className="text-base text-gray-700 px-4 pb-4 leading-6">{description}</Text>
                    ) : null}

                    {/* Tags */}
                    {tags?.length > 0 && (
                        <View className="flex-row flex-wrap gap-1 px-4 pb-4">
                            {tags.map((tag) => (
                                <View key={tag} className="bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5">
                                    <Text className="text-purple-600 text-xs font-medium">{tag}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Stats */}
                    <View className="flex-row gap-4 px-4 pb-4">
                        <View className="flex-1 bg-gray-50 rounded-xl p-3">
                            <Text className="text-base text-gray-400 mb-1">📬 Posts</Text>
                            <Text className="text-lg font-bold text-gray-800">{posts.length}</Text>
                        </View>
                        <View className="flex-1 bg-gray-50 rounded-xl p-3">
                            <Text className="text-base text-gray-400 mb-1">🏷️ Category</Text>
                            <Text className="text-lg font-bold text-gray-800">{category ?? '—'}</Text>
                        </View>
                    </View>
                </View>

                {/* Posts */}
                <View className="bg-white mb-2 px-4 pt-4">
                    <Text className="text-xl font-bold text-gray-500 uppercase tracking-wider mb-2">Posts</Text>

                    {posts.length === 0 ? (
                        <View className="bg-white px-4 py-8 items-center">
                            <Text className="text-gray-400 text-base">No posts in this community yet.</Text>
                        </View>
                    ) : (
                        posts.map(post => (
                            <ThemedPost key={post.id} data={post} />
                        ))
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
