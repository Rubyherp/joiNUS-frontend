import { View, Text, Image, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useContext, useState } from "react";
import { useFocusEffect } from "expo-router";

import ThemedInput from "../../components/themedComponents/themedInput";
import Logo from "../../assets/images/logo-white.png";
import Spacer from "@/components/themedComponents/spacer";
import { LinearGradient } from "@/components/ui/linear-gradient";
import ThemedPost from "@/components/themedComponents/themedPost";
import { PostContext } from "@/context/postContext";
import { Home } from "lucide-react-native";

//TODO: filter logic for search query
//TODO: limit number of posts loaded on landing page, add pagination or infinite scroll (prob infinite)

export default function Landing() {
    const [query, setQuery] = useState("");
    const [posts, setPosts] = useState([]);
    const { fetchPosts } = useContext(PostContext);

    useFocusEffect(
        useCallback(() => {
            const loadPosts = async () => {
                try {
                    const getPosts = await fetchPosts();
                    setPosts(getPosts);
                } catch (error) {
                    console.log("Error", "Failed to load posts. Please try again later.");
                } finally {
                }
            }
            loadPosts();
        }, [fetchPosts])
    );

    if (posts.length === 0) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center" edges={['top']}>
                <Text className="text-center text-gray-500 mt-10">Loading posts...</Text>
            </SafeAreaView>
        )
    }

    const filteredPosts = posts.filter(post => {
        if (!query) {
            console.log('Post:', post);
            return true;
        };

        const q = query.toLowerCase();

        return (
            post.title?.toLowerCase().includes(q) ||
            post.communities?.name?.toLowerCase().includes(q)
        );
    })

    //TODO: Fix placeholder not centering
    return (
        <SafeAreaView className="flex-1 px-4" edges={['top', 'left', 'right']}>
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
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </LinearGradient>
                    </View>
                    <Spacer height={10} />
                </View>
            </TouchableWithoutFeedback>

            <ScrollView
                className="flex-1 w-full"
                keyboardShouldPersistTaps="handled"
            >
                {filteredPosts.map(post => (
                    < ThemedPost key={post.id} data={post} />
                ))}
            </ScrollView>
        </SafeAreaView >
    )
}
