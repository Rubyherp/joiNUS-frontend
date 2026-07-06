import { View, Text, Image, TouchableWithoutFeedback, Keyboard, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useContext, useState, useEffect } from "react";

import ThemedInput from "../../components/themedComponents/themedInput";
import Logo from "../../assets/images/logo-white.png";
import Spacer from "@/components/themedComponents/spacer";
import { LinearGradient } from "@/components/ui/linear-gradient";
import ThemedPost from "@/components/themedComponents/themedPost";
import { PostContext } from "@/context/postContext";
import { Home } from "lucide-react-native";
import { useFocusEffect } from "expo-router";

//1. filter logic for search query
//2. limit number of posts loaded on landing page, add pagination or infinite scroll (prob infinite)
//3. fix searchbar typing

const POST_LIMIT = 8;

const ListHeader = ({ query, setQuery, onSearch }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="justify-center">

            {/* header */}
            <View className="flex-row items-center gap-3">
                <Home size={48} color="#f97316" />
                <View className="flex-row items-center justify-between flex-1">
                    <View className="flex">
                        <Text className="text-2xl font-extrabold text-gray-800">Home</Text>
                        <Text className="text-base font-semibold text-gray-500 mt-1">Find your Team</Text>
                    </View>
                    <Image source={Logo}
                        className="h-20 w-20"
                        resizeMode="contain"
                    />
                </View>
            </View>

            {/* searchbar */}
            <View className="w-full h-12 relative justify-center">
                <LinearGradient
                    className={`p-[2px] rounded-3xl`}
                    colors={['#F97316', '#EC4899']}
                    start={[0, 1]}
                    end={[1, 0]}
                >
                    <View className="bg-white rounded-3xl h-12 justify-center">
                        {query === "" && (
                            <View className="absolute left-4 z-10 gap-8 flex-row items-center pointer-events-none">
                                <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
                                <Text className="text-black/40 text-xl">Search joiNUS</Text>
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
                            value={query}
                            onChangeText={setQuery}
                            onSubmitEditing={onSearch}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="search"
                        />
                    </View>
                </LinearGradient>
            </View>
            <Spacer height={10} />
        </View>
    </TouchableWithoutFeedback>
);

export default function Landing() {
    const { fetchPosts } = useContext(PostContext);

    const [query, setQuery] = useState("");
    const [posts, setPosts] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [loadingMorePost, setLoadingMorePost] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const loadPage = useCallback(async (postNum, replace = false, searchQuery = "") => {
        if (loadingMorePost) {
            return;
        }
        setLoadingMorePost(true);
        try {
            const newPosts = await fetchPosts(postNum, POST_LIMIT, searchQuery);
            if (newPosts.length < POST_LIMIT) {
                setHasMorePosts(false);
            }
            setPosts(prev => replace ? newPosts : [...prev, ...newPosts]);
            setPostCount(postNum);
        } catch (error) {
            console.log("Failed to load posts", error);
        } finally {
            setLoadingMorePost(false);
            setInitialLoading(false);
        }
    }, [fetchPosts]);

    useEffect(() => {
        const loadInitialPosts = async () => {
            if (!isSearching) {
                setPosts([]);
                setPostCount(0);
                setHasMorePosts(true);
                setInitialLoading(true);
                loadPage(0, true);
            }
        };
        loadInitialPosts();
    }, []); // Empty dependency = runs once

    useFocusEffect(
        useCallback(() => {
            setQuery("");
            setIsSearching(false);
            setPosts([]);
            setPostCount(0);
            setHasMorePosts(true);
            setInitialLoading(true);
            loadPage(0, true);
        }, [loadPage])
    );


    const handleSearch = async () => {
        if (query.trim() === "") {
            setIsSearching(false);
            setPosts([]);
            setPostCount(0);
            setHasMorePosts(true);
            setInitialLoading(true);
            loadPage(0, true, "");
            return;
        }

        setIsSearching(true);
        setInitialLoading(true);
        setPosts([]);
        setPostCount(0);

        try {
            const result = await fetchPosts(0, 50, query.trim());
            setPosts(result);
            setHasMorePosts(result.length < 50 ? false : true);
        } catch (error) {
            console.log("Search failed: ", error);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (!hasMorePosts || loadingMorePost) {
            return;
        }
        const searchQuery = isSearching ? query.trim() : "";
        loadPage(postCount + 1, false, searchQuery);
    };

    const ListFooter = (
        loadingMorePost ? (
            <ActivityIndicator size="small" color="#f97316" style={{ marginVertical: 16 }} />
        ) : !hasMorePosts && posts.length > 0 && !isSearching
            ? (
                <Text className="text-center text-gray-400 py-4">You're all caught up!</Text>
            ) : null
    );

    if (initialLoading) {
        return (
            <SafeAreaView className="flex-1 px-4" edges={['top', 'left', 'right']}>
                <ListHeader query={query} setQuery={setQuery} onSearch={handleSearch} />
                <Text className="text-center text-gray-500 mt-10">Loading posts...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 px-4" edges={['top', 'left', 'right']}>

            <ListHeader query={query} setQuery={setQuery} onSearch={handleSearch} />

            <FlatList
                data={posts}
                keyExtractor={post => post.id.toString()}
                renderItem={({ item }) => <ThemedPost data={item} />}
                ListFooterComponent={ListFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3}
                keyboardShouldPersistTaps="handled"

                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-10">
                        {isSearching ? "No posts found" : "No posts yet"}
                    </Text>
                }
            />
        </SafeAreaView >
    )

}
