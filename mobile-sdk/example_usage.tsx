import React, { useEffect } from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';

// Import SDK
import {
    AnalyticsDebugger,
    DebuggerOverlay,
    enableMobileUI,
    TealiumAdapter
} from './src/index';

// 1. (Optional) Mock or provide actual Tealium instance
const mockTealium = {
    track: (request: any) => console.log('Tealium tracked:', request)
};

const tealiumAdapter = new TealiumAdapter(mockTealium);

export default function App() {
    useEffect(() => {
        // 1. Initialize Debugger early in app lifecycle
        AnalyticsDebugger.getInstance().init({
            enabled: __DEV__, // Auto-enable in DEV
            maxEvents: 500,
            desktopSync: true,
            desktopIp: '127.0.0.1', // Change to developer's local IP
            desktopPort: 8080,
        });
    }, []);

    const triggerEvent = () => {
        tealiumAdapter.trackEvent('add_to_cart', {
            product_id: '12345',
            price: 29.99,
            currency: 'USD'
        });
    };

    const triggerView = () => {
        tealiumAdapter.trackView('home_screen', {
            user_status: 'logged_in',
            session_id: 'xyz-987'
        });
    };

    const triggerError = () => {
        // Simulated error tracking
        AnalyticsDebugger.getInstance().logEvent({
            name: 'Network Failure',
            type: 'error',
            provider: 'System',
            payload: { code: 500, message: 'Internal Server Error' }
        });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, padding: 20 }}>
                <Text style={{ fontSize: 24, marginBottom: 20 }}>My RN App</Text>

                <View style={{ gap: 10, marginVertical: 20 }}>
                    <Button title="Track Event: Add to Cart" onPress={triggerEvent} />
                    <Button title="Track View: Home Screen" onPress={triggerView} />
                    <Button title="Track Error" onPress={triggerError} />
                </View>

                {__DEV__ && (
                    <View style={{ marginTop: 40, borderTopWidth: 1, paddingTop: 20, borderColor: '#ccc' }}>
                        <Text style={{ color: '#666', marginBottom: 10 }}>Dev Menu:</Text>
                        <Button
                            title="Toggle Debugger UI"
                            color="#007AFF"
                            onPress={() => enableMobileUI(!AnalyticsDebugger.getInstance().isEnabled())}
                        />
                    </View>
                )}
            </View>

            {/* 2. Add Overlay at the root level of your app */}
            <DebuggerOverlay />
        </SafeAreaView>
    );
}
