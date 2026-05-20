// Testing react native functionality
// rename file to index.jsx to use testing file

import { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    TextInput, Alert, Platform, Dimensions,
    useColorScheme, ActivityIndicator,
    StyleSheet, Switch, Image
} from 'react-native';
import * as Device from 'expo-device';
import * as Network from 'expo-network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL
    ?? 'http://localhost:3000';

export default function TestScreen() {
    const colorScheme = useColorScheme();
    const { width, height } = Dimensions.get('window');

    const [networkStatus, setNetworkStatus] = useState(null);
    const [backendStatus, setBackendStatus] = useState('idle');
    const [storageTest, setStorageTest] = useState('');
    const [switchVal, setSwitchVal] = useState(false);
    const [inputVal, setInputVal] = useState('');
    const [loading, setLoading] = useState(false);

    // 1. Network check
    useEffect(() => {
        Network.getNetworkStateAsync().then(setNetworkStatus);
    }, []);

    // 2. AsyncStorage test
    async function testStorage() {
        // FIX: Wrapped AsyncStorage operations in a try/catch block to prevent unhandled promise rejections
        try {
            await AsyncStorage.setItem('test_key', 'hello_expo');
            const val = await AsyncStorage.getItem('test_key');
            setStorageTest(val ?? 'failed');
        } catch (e) {
            setStorageTest('error');
        }
    }

    // 3. Backend ping (Node.js)
    async function pingBackend() {
        setBackendStatus('loading');
        setLoading(true);
        try {
            // FIX: Corrected a syntax typo. Removed the rogue backslash (`\`) at the end of the template literal string.
            // Original line: const res = await fetch(`${BACKEND_URL}/ping\`);
            const res = await fetch(`${BACKEND_URL}/ping`);
            const data = await res.json();
            setBackendStatus(data.message ?? 'ok');
        } catch (e) {
            setBackendStatus('error: ' + e.message);
        } finally {
            setLoading(false);
        }
    }

    // 4. Alert test
    function testAlert() {
        Alert.alert('Alert works!', 'Native alert is functional.', [
            { text: 'OK' }
        ]);
    }

    const isDark = colorScheme === 'dark';
    const s = styles(isDark);

    // FIX: Fully restored the missing JSX tree inside this return statement
    return (
        <SafeAreaView style={s.safe}>
            <ScrollView style={s.scroll} contentContainerStyle={s.container}>
                <Text style={s.title}>RN + Expo Test</Text>

                {/* Device info */}
                {/* ENHANCEMENT: Passed 'isDark' into sub-components so they can dynamically adjust colors */}
                <Section label="Device Info" isDark={isDark}>
                    <Row label="OS" value={Platform.OS} isDark={isDark} />
                    <Row label="OS Version" value={Device.osVersion} isDark={isDark} />
                    <Row label="Device Name" value={Device.deviceName} isDark={isDark} />
                    <Row label="Dimensions" value={`${Math.round(width)}x${Math.round(height)}`} isDark={isDark} />
                </Section>

                {/* Network */}
                <Section label="Network" isDark={isDark}>
                    <Row label="Connected" value={networkStatus?.isConnected ? 'Yes' : 'No'} isDark={isDark} />
                    <Row label="Type" value={networkStatus?.type ?? 'Unknown'} isDark={isDark} />
                </Section>

                {/* AsyncStorage */}
                <Section label="AsyncStorage" isDark={isDark}>
                    <Row label="Stored Value" value={storageTest || 'Not tested'} isDark={isDark} />
                    <TouchableOpacity style={s.btn} onPress={testStorage}>
                        <Text style={s.btnText}>Test Storage</Text>
                    </TouchableOpacity>
                </Section>

                {/* Backend ping */}
                <Section label="Backend Connection" isDark={isDark}>
                    <Row label="Status" value={backendStatus} isDark={isDark} />
                    <TouchableOpacity style={s.btn} onPress={pingBackend} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={s.btnText}>Ping {BACKEND_URL}/ping</Text>
                        )}
                    </TouchableOpacity>
                </Section>

                {/* UI primitives */}
                <Section label="UI Primitives" isDark={isDark}>
                    <TextInput
                        style={s.input}
                        placeholder="Type something..."
                        // ENHANCEMENT: Added placeholder color variation for proper Dark Mode visibility
                        placeholderTextColor={isDark ? '#666' : '#999'}
                        value={inputVal}
                        onChangeText={setInputVal}
                    />
                    <View style={s.row}>
                        <Text style={s.label}>Switch</Text>
                        <Switch value={switchVal} onValueChange={setSwitchVal} />
                    </View>
                    <TouchableOpacity style={s.btn} onPress={testAlert}>
                        <Text style={s.btnText}>Test Alert</Text>
                    </TouchableOpacity>
                </Section>
            </ScrollView>
        </SafeAreaView>
    );
}

// FIX: Restored the missing return tags for the Section component
function Section({ label, children, isDark }) {
    return (
        <View style={sec.wrap}>
            {/* ENHANCEMENT: Applied inline style overrides to handle text color switches in dark mode */}
            <Text style={[sec.label, isDark && { color: '#aaa' }]}>{label}</Text>
            {children}
        </View>
    );
}

// FIX: Restored the missing return tags for the Row component
function Row({ label, value, isDark }) {
    return (
        <View style={[sec.row, isDark && { borderBottomColor: '#333' }]}>
            <Text style={[sec.key, isDark && { color: '#aaa' }]}>{label}</Text>
            <Text style={[sec.val, isDark && { color: '#fff' }]}>{value}</Text>
        </View>
    );
}

const sec = StyleSheet.create({
    wrap: { marginBottom: 24 },
    label: {
        fontSize: 11, fontWeight: '500', color: '#888',
        textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8
    },
    row: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingVertical: 6, borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e0e0e0'
    },
    key: { fontSize: 14, color: '#555' },
    val: { fontSize: 14, fontWeight: '500', color: '#222' },
});

const styles = (isDark) => StyleSheet.create({
    safe: { flex: 1, backgroundColor: isDark ? '#111' : '#f5f5f5' },
    scroll: { flex: 1 },
    container: { padding: 20 },
    title: {
        fontSize: 22, fontWeight: '500', marginBottom: 24,
        color: isDark ? '#fff' : '#111'
    },
    // ENHANCEMENT: Dynamic dark mode button color swap so buttons don't clip against a pure black background
    btn: {
        backgroundColor: isDark ? '#333' : '#222', borderRadius: 8, padding: 12,
        alignItems: 'center', marginTop: 8
    },
    btnText: { color: '#fff', fontWeight: '500', fontSize: 14 },
    // ENHANCEMENT: Input fields receive distinct border updates during theme changes
    input: {
        borderWidth: 1, borderColor: isDark ? '#444' : '#ddd', borderRadius: 8,
        padding: 10, fontSize: 14, marginBottom: 8,
        color: isDark ? '#fff' : '#111',
        backgroundColor: isDark ? '#222' : '#fff'
    },
    row: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingVertical: 8
    },
    label: { fontSize: 14, color: isDark ? '#ccc' : '#555' },
});
