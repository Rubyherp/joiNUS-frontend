import "../global.css";
import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";
import { Colors } from "@/assets/colors/Colors";
import { UserProvider } from "@/context/userContext";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;

    return (
        <GluestackUIProvider>
            <UserProvider>
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
            </UserProvider>
        </GluestackUIProvider>
    )
}
