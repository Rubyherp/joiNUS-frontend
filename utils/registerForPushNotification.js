import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export async function registerForPushNotifications(authToken) {
    if (!Device.isDevice) {
        console.log('Must use a physical device to receive push notifications');
        return;
    }

    // check if user has granted permissions for push notifications
    const { status: exitingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = exitingStatus;

    if (exitingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification');
        return null;
    }

    try {
        const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId: '46ff4ceb-894f-4e15-880f-c94d98f03893'
        });

        const token = tokenData.data;
        await fetch(`${API_URL}/posts/push-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ token }),
        });

        return token;
    } catch (error) {
        console.error('Error registering for push notifications:', error);
        return null;
    }
}

