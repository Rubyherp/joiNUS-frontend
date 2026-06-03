import { useLocalSearchParams } from "expo-router";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useState } from "react";
import { PostContext } from "@/context/postContext";
import { UserContext } from "@/context/userContext";
import { CommunityContext } from "@/context/communityContext";

//TODO: add edit button for author?
export default function PostPage() {
    const { postId } = useLocalSearchParams();
    const { fetchPostById } = useContext(PostContext);
    const { fetchUserDetails } = useContext(UserContext);
    const { fetchCommunityById } = useContext(CommunityContext);

    const [post, setPost] = useState(null);
    const [author, setAuthor] = useState(null);
    const [community, setCommunity] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const postData = await fetchPostById(postId);
            setPost(postData);
            setCommunity(postData.communities);

            const communityData = await fetchCommunityById(postData.community_id);
            setCommunity(communityData);

            const authorData = await fetchUserDetails(postData.author_id);
            setAuthor(authorData);

            console.log("postData:", postData);
            console.log("authorData:", authorData);
            console.log("communityData:", postData.communities);
        }
        getData();
    }, [])

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
        <SafeAreaView className="flex-1 items-center p-4">
            <View className="flex-row gap-2 w-full max-w-2xl bg-white border border-gray-200 rounded-2xl overflow-hidden mb-3 shadow-sm p-4">
                <Text>Community</Text>
                <Text>User</Text>
            </View>

            <View className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl overflow-hidden mb-3 shadow-sm p-4">
                <Text>Title</Text>
                <Text>Description</Text>
            </View>

            {image_url && (
                <View className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl overflow-hidden mb-3 shadow-sm p-4">
                    <Image source={{ uri: image_url }} className="w-full h-64 rounded-lg" resizeMode="cover" />
                </View>
            )}

            {more_details && (
                <View className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl overflow-hidden mb-3 shadow-sm p-4">
                    <Text>More Details</Text>
                </View>
            )}

            {member_limit && (
                <View className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl overflow-hidden mb-3 shadow-sm p-4">
                    <Text>Member Limit</Text>
                </View>
            )}

            {deadline && (
                <View className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl overflow-hidden mb-3 shadow-sm p-4">
                    <Text>Deadline</Text>
                </View>
            )}

        </SafeAreaView>
    )
}

