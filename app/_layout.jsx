import { Screen } from "react-native-screens";
import "../global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{ headerShown: false }}>
        </Stack>
    )
}
