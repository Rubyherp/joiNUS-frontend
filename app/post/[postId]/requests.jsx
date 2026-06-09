import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router'

import { PostContext } from "@/context/postContext";
import { CommunityContext } from "@/context/communityContext";
import { setReactActEnvironment } from '@testing-library/react-native/build/act';
import ThemedRequestCard from '@/components/themedComponents/themedRequestCard';

//1. fetch pending req and accepted req
//2. map each req to their req card
//3. in each card, retrieve status of the req, render if accepted 
//4. think about this logic tomorrow =p

export default function Requests() {

    const [post, setPost] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);

    const { fetchPostById, fetchPendingRequests, fetchAcceptedRequests, handlePendingRequest, } = useContext(PostContext);

    const { postId } = useLocalSearchParams();

    const loadData = async () => {
        try {
            const [post, pendingRequests, acceptedRequests] = await Promise.all([
                fetchPostById(postId),
                fetchPendingRequests(postId),
                fetchAcceptedRequests(postId),
            ])

            setPost(post);
            setPendingRequests(pendingRequests);
            setAcceptedRequests(acceptedRequests);

        } catch (error) {
            Alert.alert("Error", "Failed to load data");
        }
    }

    useEffect(() => {
        loadData();
    }, [])

    const { title } = post || {};

    return (
        <SafeAreaView className='flex-1'>
            <ScrollView className="flex-1">
                <View className="flex-1 ">
                    <Pressable onPress={() => router.back()} className="mr-3 p-1 gap-2 flex-row justify-center items-center">
                        <Text className="text-2xl text-gray-500">←</Text>
                        <Text className="text-base font-semibold text-gray-800 flex-1 justify-center">{title ?? "Post"}</Text>
                    </Pressable>
                </View>

                {/* top bar */}
                <View className="flex justify-between px-4 py-2">
                    <View>
                        <Text className="text-2xl font-extrabold text-gray-800 tracking-light">Requests</Text>
                        <Text className="text-base font-semibold text-gray-500 mt-1">Manage your requests</Text>
                    </View>

                </View>

                {/* accepted */}
                <View>
                    <View className="flex justify-center items-center py-1.5 border-b-2 border-gray-400 bg-gray-700">
                        <Text className="text-base font-semibold text-gray-200 ">Accept</Text>
                    </View>
                    {acceptedRequests?.map(req =>
                        <ThemedRequestCard key={req.id} data={req} onUpdate={loadData} />
                    )}
                </View>

                {/* pending */}
                <View>
                    <View className="flex justify-center items-center py-1.5 border-b-2 border-gray-400 bg-gray-700">
                        <Text className="text-base font-semibold text-gray-200 ">Pending</Text>
                    </View>
                    {pendingRequests?.map(req =>
                        <ThemedRequestCard key={req.id} data={req} onUpdate={loadData} />
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}
