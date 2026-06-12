import "../global.css";
import { Stack, useRouter } from "expo-router";
import { StatusBar, useColorScheme, Platform } from "react-native";
import { useEffect, useRef } from "react";
import * as Notifications from 'expo-notifications';

import { Colors } from "@/assets/colors/Colors";
import { UserProvider } from "@/context/userContext";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { PostProvider } from "@/context/postContext";
import { CommunityProvider } from "@/context/communityContext";
import { registerForPushNotifications } from "@/utils/registerForPushNotification";
import { SocketProvider } from "@/context/socketContext";
import { ChatProvider } from "@/context/chatContext";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    })
})

if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
    });
}

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;
    const router = useRouter();
    const responseListener = useRef();

    useEffect(() => {
        // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const { type, postId } = response.notification.request.content.data;

            console.log(`User tapped a notification of type ${type} for post ${postId}`);

            if (postId) {
                router.push(`/post/${postId}`);
            }
        });

        return () => {
            if (responseListener.current) {
                responseListener.current.remove();
                // Notifications.removeNotificationSubscription(responseListener.current);
            }
        }
    }, []);

    return (
        <GluestackUIProvider>
            <UserProvider>
                <ChatProvider>
                    <SocketProvider>
                        <CommunityProvider>
                            <PostProvider>
                                <StatusBar value="auto" />
                                <Stack
                                    screenOptions={{
                                        headerShown: false
                                    }}
                                >
                                    <Stack.Screen name="index" options={{
                                        title: "Home"
                                    }}
                                    />
                                    <Stack.Screen name="post/[postId]" options={{
                                        headerShown: false,
                                    }}
                                    />
                                    <Stack.Screen name="dm/[userId]" options={{
                                        headerShown: false,
                                    }}
                                    />
                                    <Stack.Screen name="userProfile/[userId]" options={{
                                        headerShown: false,
                                    }}
                                    />

                                </Stack>
                            </PostProvider>
                        </CommunityProvider>
                    </SocketProvider>
                </ChatProvider>
            </UserProvider>
        </GluestackUIProvider>
    )
}
