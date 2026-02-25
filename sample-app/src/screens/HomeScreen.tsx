import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AnalyticsDebugger, wrapTealium } from '@mo3ta-dev/rn-analytics-debugger';

interface HomeScreenProps {
    onOpenDebugger: () => void;
}

// Mock Tealium SDK (replace with yours if you have it)
const originalTealium = {
    track: (request: any) => {
        console.log('[Tealium] Tracking:', request);
    }
};

// Wrapped so all track() calls are auto-captured by the debugger
const tealium = wrapTealium(originalTealium);

export function HomeScreen({ onOpenDebugger }: HomeScreenProps) {
    const handleDefaultTrack = () => {
        AnalyticsDebugger.getInstance().trackEvent('button_clicked', {
            source: 'HomeScreen',
            method: 'default_tracker',
        });
    };

    const handleProxyTrack = () => {
        tealium.track({
            type: 'EVENT',
            eventName: 'button_clicked_via_tealium',
            data: { source: 'HomeScreen' },
        });
    };

    const handleTrackError = () => {
        AnalyticsDebugger.getInstance().trackError('test_error', {
            message: 'Simulated error for testing',
            code: 500,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>
            <Text style={styles.subtitle}>Tap buttons to send analytics events</Text>

            <TouchableOpacity style={styles.button} onPress={handleDefaultTrack}>
                <Text style={styles.buttonText}>📊 Track Event (Default)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.proxyButton]} onPress={handleProxyTrack}>
                <Text style={styles.buttonText}>🔗 Track Event (Tealium Proxy)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.errorButton]} onPress={handleTrackError}>
                <Text style={styles.buttonText}>⚠️ Track Error</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={[styles.button, styles.debuggerButton]} onPress={onOpenDebugger}>
                <Text style={styles.buttonText}>🛠 Open Debugger UI</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#1C1C1E',
    },
    subtitle: {
        fontSize: 15,
        color: '#8E8E93',
        textAlign: 'center',
        marginBottom: 36,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    proxyButton: { backgroundColor: '#34C759', shadowColor: '#34C759' },
    errorButton: { backgroundColor: '#FF3B30', shadowColor: '#FF3B30' },
    debuggerButton: { backgroundColor: '#1C1C1E', shadowColor: '#000' },
    divider: {
        height: 1,
        backgroundColor: '#D1D1D6',
        marginVertical: 20,
        marginHorizontal: 40,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
