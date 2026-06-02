import "../global.css";
import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";
import { Colors } from "@/assets/colors/Colors";
import { UserProvider } from "@/context/userContext";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { PostProvider } from "@/context/postContext";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;

    return (
        <GluestackUIProvider>
            <UserProvider>
                <PostProvider>
                    <StatusBar value="auto"></StatusBar>
                    <Stack
                        screenOptions={{
                            headerShown: false
                        }}
                    >
                        <Stack.Screen name="index" options={{
                            title: "Home"
                        }}
                        />

                    </Stack>
                </PostProvider>
            </UserProvider>
        </GluestackUIProvider>
    )
}
