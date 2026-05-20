import { Screen } from "react-native-screens";
import "../global.css";
import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";
import { Colors } from "@/assets/colors/Colors";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;

    return (
        <>
            <StatusBar value="auto"></StatusBar>

            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: theme.navBackground },
                    headerTintColor: theme.title,
                }}
            >
                <Stack.Screen name="index" options={
                    {
                        title: "Home",
                        headerShown: false,
                    }
                } />

            </Stack>
        </>
    )
}
