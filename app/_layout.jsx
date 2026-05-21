import "../global.css";
import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";
import { Colors } from "@/assets/colors/Colors";
import { UserProvider } from "@/context/userContext";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;

    return (
        <UserProvider>
            <StatusBar value="auto"></StatusBar>

            <Stack
                screenOptions={{
                    headerShown: false,
                    // headerStyle: { backgroundColor: theme.navBackground },
                    // headerTintColor: theme.title,
                }}
            >
                <Stack.Screen name="index" options={
                    {
                        title: "Home",
                    }
                } />

            </Stack>
        </UserProvider>
    )
}
