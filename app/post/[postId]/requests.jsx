import { View, Text, ScrollView, Pressable, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router'

import { PostContext } from "@/context/postContext";
import ThemedRequestCard from '@/components/themedComponents/themedRequestCard';
import Logo from "../../../assets/images/logo-white.png";
import { Handshake } from "lucide-react-native";

//1. fetch pending req and accepted req
//2. map each req to their req card
//3. in each card, retrieve status of the req, render if accepted 
//4. think about this logic tomorrow =p

//TODO: Add placeholder if there are no requests

export default function Requests() {

    const [post, setPost] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);

    const { fetchPostById, fetchPendingRequests, fetchAcceptedRequests } = useContext(PostContext);

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
                <View className="flex-row items-center gap-3 px-4">
                    <Handshake size={48} color="#f97316" />
                    <View className="flex-row items-center justify-between flex-1">
                        <View className="flex">
                            <Text className="text-2xl font-extrabold text-gray-800">Requests</Text>
                            <Text className="text-base font-semibold text-gray-500 mt-1">Manage your requests</Text>
                        </View>
                        <Image source={Logo}
                            className="h-20 w-20"
                            resizeMode="contain"
                        />
                    </View>

                </View>

                {/* accepted */}
                <View>
                    <View className="px-4 py-2 bg-gray-50 border-b border-t border-gray-300">
                        <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide text-center">Accepted</Text>
                    </View>
                    {acceptedRequests && acceptedRequests.length > 0 ? (acceptedRequests?.map(req =>
                        <ThemedRequestCard key={req.id} data={req} onUpdate={loadData} />
                    )) : (
                        <View className="items-center justify-center pb-4 px-8">
                            <Text className="text-gray-700 font-bold text-lg mt-4 text-center">No accepted requests yet</Text>
                            <Text className="text-gray-500 text-sm mt-1 text-center">Once you accept someone, they'll show up here 🙌</Text>
                        </View>
                    )}
                </View>

                {/* pending */}
                <View>
                    <View className="px-4 py-2 bg-gray-50 border-b border-t border-gray-300">
                        <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide text-center">Pending</Text>
                    </View>
                    {pendingRequests && pendingRequests.length > 0 ? (
                        pendingRequests?.map(req =>
                            <ThemedRequestCard key={req.id} data={req} onUpdate={loadData} />
                        )) : (
                        <View className="items-center justify-center px-8">
                            <Text className="text-gray-700 font-bold text-lg mt-4 text-center">No pending requests</Text>
                            <Text className="text-gray-500 text-sm mt-1 text-center">Requests to join your project will show up here 👀</Text>
                        </View>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}
