import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState, useContext, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Logo from "../../assets/images/logo-white.png";
import { LinearGradient } from "@/components/ui/linear-gradient";
import ThemedInput from "@/components/themedComponents/themedInput";
import { Colors } from "@/assets/colors/Colors";
import ThemedCommunity from "@/components/themedComponents/themedCommunity";
import { PostContext } from "@/context/postContext";
import { CommunityContext } from "@/context/communityContext";
import ThemedPost from "@/components/themedComponents/themedPost";
import { Star } from "lucide-react-native";
import LoadingState from "@/components/helpers/loadingState";
import EmptyState from "@/components/helpers/emptyState";

// 1.flatlist mapped as linked to backend data, currently hardcoded for UI purposes
// 2.link each card to the community page, and add a button to leave the community (or remove from saved)

export default function Saved() {
    const [communityQuery, setCommunityQuery] = useState("");
    const [postQuery, setPostQuery] = useState("");
    const [savedPosts, setSavedPosts] = useState([]);
    const [followedCommunities, setFollowedCommunities] = useState([]);
    const [allCommunities, setAllCommunities] = useState(null);
    const [loadingSaved, setLoadingSaved] = useState(true);

    const { fetchSavedPosts } = useContext(PostContext);
    const { fetchCommunities, fetchFollowedCommunities } = useContext(CommunityContext);

    const loadData = useCallback(async () => {
        try {
            const [saved, followed, all] = await Promise.all([
                fetchSavedPosts(),
                fetchFollowedCommunities(),
                fetchCommunities()
            ]);

            setSavedPosts(saved.map(s => s.posts));
            setFollowedCommunities(followed.map(f => f.communities));
            setAllCommunities(all);
        } catch (error) {
            Alert.alert('Error', 'Failed to load data')
        } finally {
            setLoadingSaved(false)
        }
    }, [fetchSavedPosts, fetchFollowedCommunities, fetchCommunities]);

    useFocusEffect(
        useCallback(() => {
            loadData()
        }, [])
    );

    const [tab, setTab] = useState(0);
    const tabs = ['Communities', 'Posts'];

    if (loadingSaved) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <LoadingState message="Loading saved items..." />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: Colors.light.uiBackground }}>
            <ScrollView className="flex-1">

                {/* header */}
                <View className="flex justify-between px-4">
                    <View className="flex-row items-center gap-3">
                        <Star size={48} color="#f97316" />
                        <View className="flex-row items-center justify-between flex-1">
                            <View className="flex">
                                <Text className="text-2xl font-extrabold text-gray-800">Saved</Text>
                                <Text className="text-base font-semibold text-gray-500 mt-1">Your bookmarks & communities</Text>
                            </View>
                            <Image source={Logo}
                                className="h-20 w-20"
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                </View>

                {/* tab bar & search card */}
                <View className="rounded-2xl mx-4 overflow-hidden">

                    <View className="flex-row p-1 pb-4 rounded-xl " style={{ backgroundColor: Colors.light.uiBackground }}>
                        {tabs.map((label, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => setTab(i)}
                                className="flex-1 items-center py-2 rounded-lg border-gray-400"
                                style={tab === i
                                    ? { backgroundColor: "#fff", shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 }
                                    : {}
                                }
                            >
                                <Text
                                    className="text-xs font-bold"
                                    style={{ color: tab === i ? Colors.light.title : Colors.light.text }}
                                >
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* searchbar */}
                    {tab === 0
                        ? (
                            <View className="w-full">
                                <View className="w-full h-14 justify-center">
                                    <LinearGradient
                                        className={`p-[2px] rounded-3xl`}
                                        colors={['#F97316', '#EC4899']}
                                        start={[0, 1]}
                                        end={[1, 0]}
                                    >
                                        <View className="rounded-3xl h-12 justify-center">
                                            {communityQuery === "" && (
                                                <View className="absolute left-4 z-10 gap-4 flex-row items-center pointer-events-none">
                                                    <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
                                                    <Text className="text-black/40 text-lg">Search all communities...</Text>
                                                </View>
                                            )}
                                            <ThemedInput
                                                className="text-black bg-white border border-black/10 rounded-3xl w-full px-4"
                                                style={{
                                                    height: 42,
                                                    fontSize: 16,
                                                    lineHeight: 20,
                                                    textAlignVertical: 'center',
                                                    paddingTop: 0,
                                                    paddingBottom: 0,
                                                }}
                                                value={communityQuery}
                                                onChangeText={setCommunityQuery}
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                            />
                                        </View>
                                    </LinearGradient>
                                </View>
                            </View>
                        )

                        : (
                            <View className="w-full">
                                <View className="w-full h-14 justify-center ">
                                    <LinearGradient
                                        className={`p-[2px] rounded-3xl`}
                                        colors={['#F97316', '#EC4899']}
                                        start={[0, 1]}
                                        end={[1, 0]}
                                    >

                                        <View className="rounded-3xl h-12 justify-center">
                                            {postQuery === "" && (
                                                <View className="absolute left-4 z-10 gap-4 flex-row items-center pointer-events-none">
                                                    <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
                                                    <Text className="text-black/40 text-xl">Search your saved posts...</Text>
                                                </View>
                                            )}

                                            <ThemedInput
                                                className="text-black bg-white border border-black/10 rounded-3xl w-full px-4"
                                                style={{
                                                    height: 42,
                                                    fontSize: 16,
                                                    lineHeight: 20,
                                                    textAlignVertical: 'center',
                                                    paddingTop: 0,
                                                    paddingBottom: 0,
                                                }}
                                                value={postQuery}
                                                onChangeText={setPostQuery}
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                            />
                                        </View>
                                    </LinearGradient>
                                </View>
                            </View>
                        )
                    }
                </View>

                {/* content */}
                {tab === 0
                    ? (
                        <View>
                            {/* Following section */}
                            <View className="bg-white rounded-2xl shadow-sm mx-4 mt-4 overflow-hidden">
                                <View className="px-4 pt-4 pb-2">
                                    <Text className="text-base font-semibold text-gray-700">Following</Text>
                                    <Text className="text-sm text-gray-400 mt-1">Browse your communities, search for opportunities</Text>
                                </View>
                                {
                                    followedCommunities && followedCommunities.length > 0 ? (
                                        followedCommunities
                                            .filter(community => community.name.toLowerCase().includes(communityQuery.toLowerCase()))
                                            .map(community => (
                                                <ThemedCommunity key={community.id} data={community} isFollowed={true} onFollowChange={loadData} />
                                            ))
                                    ) : (
                                        <View className="px-4 pb-6">
                                            <EmptyState
                                                icon="🌐"
                                                title="You're not following any communities yet"
                                                subtitle="Discover communities below and follow the ones you like"
                                            />
                                        </View>
                                    )
                                }
                            </View>

                            {/* Browse all Communities section */}
                            <View className="bg-white rounded-2xl shadow-sm mx-4 mt-4 overflow-hidden">
                                <View className="px-4 pt-4 pb-2">
                                    <Text className="text-base font-semibold text-gray-700">Browse all Communities</Text>
                                    <Text className="text-sm text-gray-400 mt-1">Discover and follow communities that interest you</Text>
                                </View>
                                {
                                    (allCommunities ?? [])
                                        .filter(community => !followedCommunities?.some(f => f.id === community.id))
                                        .filter(community => community.name.toLowerCase().includes(communityQuery.toLowerCase()))
                                        .map(community => (
                                            <ThemedCommunity key={community.id} data={community} isFollowed={followedCommunities?.some(followedCommunity => followedCommunity.id === community.id)} onFollowChange={loadData} />
                                        ))
                                }
                            </View>
                        </View>

                    ) : (

                        <View className="pt-4 px-4">
                            {savedPosts && savedPosts.length > 0 ? (
                                savedPosts
                                    .filter(post => post.title.toLowerCase().includes(postQuery.toLowerCase()))
                                    .map(post => (
                                        <ThemedPost key={post.id} data={post} />
                                    ))
                            ) : (
                                <EmptyState icon="🔖" title="No saved posts yet" subtitle="Save a post to display it here!" />
                            )}
                        </View>

                    )
                }

            </ScrollView>
        </SafeAreaView >
    )
}
