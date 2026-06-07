import { View } from "react-native";
import { Tabs } from "expo-router";

import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false
            }}
        >
            <Tabs.Screen
                name="landing"
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color='black' />
                    )
                }}
            />

            <Tabs.Screen
                name="saved"
                options={{
                    title: "Saved",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} size={24} color='black' />
                    )
                }}
            />

            <Tabs.Screen
                name="create"
                options={{
                    title: "Create",
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            width: 48,
                            height: 48,
                            borderRadius: 26,
                            borderWidth: 1,
                            borderColor: focused ? 'red' : 'black',
                            backgroundColor: focused ? 'black' : 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 20,
                        }}>
                            <Ionicons name="add" size={30} color={focused ? 'white' : 'black'} />
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="chats"
                options={{
                    title: "Chats",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={24} color='black' />
                    )
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color='black' />
                    )
                }}
            />

            <Tabs.Screen name="profileSetup" options={{ href: null }} />
        </Tabs>
    )
}
