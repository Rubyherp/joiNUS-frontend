import { useLocalSearchParams, router } from "expo-router";
import { View, Text, Image, Pressable, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useState } from "react";

import { PostContext } from "@/context/postContext";
import { UserContext } from "@/context/userContext";
import { CommunityContext } from "@/context/communityContext";
import { Ionicons } from '@expo/vector-icons';

//TODO: add edit button for author?
//TODO: finish save and unsave post logic

export default function PostPage() {
    const { postId } = useLocalSearchParams();
    const { fetchPostById, savePost, unsavePost } = useContext(PostContext);
    const { fetchUserDetails } = useContext(UserContext);
    const { fetchCommunityById } = useContext(CommunityContext);

    const [post, setPost] = useState(null);
    const [author, setAuthor] = useState(null);
    const [community, setCommunity] = useState(null);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const postData = await fetchPostById(postId);
            setPost(postData);
            setCommunity(postData.communities);
            setSaved(postData.post_saves?.length > 0);

            const communityData = await fetchCommunityById(postData.community_id);
            setCommunity(communityData);

            const authorData = await fetchUserDetails(postData.author_id);
            setAuthor(authorData);
        }
        getData();
    }, [])

    const handleSavePost = async () => {
        setLoading(true);
        try {
            saved ? await unsavePost(postId) : await savePost(postId);
            setSaved(!saved);
        } catch (error) {
            Alert.alert('Error', `Failed to ${saved ? 'unsave Post' : 'save Post'}`)
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

    const {
        title,
        description,
        image_url,
        more_details,
        requirements,
        member_limit,
        deadline,
        created_at,
    } = post || {};
    const { username: authorName, avatar } = author || {};
    const { name: communityName, category, tags } = community || {};

    return (
        <SafeAreaView className="flex-1 bg-gray-100">

            {/* Header */}
            <View className="flex-row h-16 py-3 bg-white border-b border-gray-200">

                <View className="flex-1 ">
                    <Pressable onPress={() => router.back()} className="mr-3 p-1 gap-2 flex-row justify-center items-center">
                        <Text className="text-2xl text-gray-500">←</Text>
                        <Text className="text-base font-semibold text-gray-800 flex-1 justify-center">{title ?? "Post"}</Text>
                    </Pressable>
                </View>

                {/* save button */}
                <View className="w-16 flex items-center">
                    <TouchableOpacity
                        onPress={handleSavePost}
                        disabled={loading}
                        activeOpacity={0.7}
                        style={{ opacity: loading ? 0.7 : 1 }}
                        className="flex justify-center items-center"
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white font-semibold text-lg">
                                <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={24} color='black' />
                            </Text>
                        )}
                    </TouchableOpacity>
                    <Text className="text-sm text-gray-500 " >{saved ? 'unsave' : 'save'}</Text>

                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>

                {/* Main card */}
                <View className="bg-white mb-2">

                    {/* Community + author row */}
                    <View className="flex-row items-center px-4 pt-4 pb-2 gap-2">
                        <View className="rounded-full w-7 h-7 items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: getColor(communityName) }}>
                            <Text className="text-white text-xs font-bold">{getInitials(communityName)}</Text>
                        </View>
                        <Text className="text-sm font-bold text-purple-600 flex-shrink-0">{communityName}</Text>
                        <Text className="text-sm text-gray-400 flex-shrink-0">•</Text>
                        {avatar ? (
                            <Image source={{ uri: avatar }} style={{ width: 20, height: 20, borderRadius: 10 }} className="flex-shrink-0" />
                        ) : null}
                        <Text className="text-sm text-gray-500 flex-1" numberOfLines={1}>u/{authorName}</Text>
                        <Text className="text-xs text-gray-400">{formatDate(created_at)}</Text>
                    </View>

                    {/* Title */}
                    <Text className="text-xl font-bold text-gray-900 px-4 pb-2 leading-7">{title}</Text>

                    {/* Tags */}
                    {tags?.length > 0 && (
                        <View className="flex-row flex-wrap gap-1 px-4 pb-3">
                            {tags.map((tag) => (
                                <View key={tag} className="bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5">
                                    <Text className="text-purple-600 text-xs font-medium">{tag}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Description */}
                    {description ? (
                        <Text className="text-lg text-gray-700 px-4 pb-4 leading-6">{description}</Text>
                    ) : null}

                    {/* Image */}
                    {image_url ? (
                        <Image source={{ uri: image_url }} className="w-full" style={{ height: 240 }} resizeMode="cover" />
                    ) : null}
                </View>

                {/* Details card */}
                {(more_details || requirements || member_limit || deadline) ? (
                    <View className="bg-white mb-2 px-4 py-4 gap-4">
                        <Text className="text-xl font-bold text-gray-500 uppercase tracking-wider">Details</Text>

                        {more_details ? (
                            <View>
                                <Text className="text-lg font-semibold text-gray-400 uppercase mb-1">About</Text>
                                <Text className="text-base text-gray-700 leading-5">{more_details}</Text>
                            </View>
                        ) : null}

                        {requirements ? (
                            <View>
                                <Text className="text-lg font-semibold text-gray-400 uppercase mb-1">Requirements</Text>
                                <Text className="text-base text-gray-700 leading-5">{requirements}</Text>
                            </View>
                        ) : null}

                        <View className="flex-row gap-4">
                            {member_limit ? (
                                <View className="flex-1 bg-gray-50 rounded-xl p-3">
                                    <Text className="text-base text-gray-400 mb-1">👥 Team size</Text>
                                    <Text className="text-lg font-bold text-gray-800">{member_limit} members</Text>
                                </View>
                            ) : null}
                            {deadline ? (
                                <View className="flex-1 bg-gray-50 rounded-xl p-3">
                                    <Text className="text-base text-gray-400 mb-1">📅 Deadline</Text>
                                    <Text className="text-lg font-bold text-gray-800">{formatDate(deadline)}</Text>
                                </View>
                            ) : null}
                        </View>
                    </View>
                ) : null}
            </ScrollView>

            {/* Join button */}
            <View className="flex-row bg-white border-t border-gray-200 px-4 py-3 gap-2">
                <Pressable className="flex-1 bg-purple-600 rounded-full py-2 items-center">
                    <Text className="text-white font-bold text-base">Request to Join</Text>
                </Pressable>
            </View>
        </SafeAreaView >
    );
}

