import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Dimensions } from 'react-native';
import { AnalyticsDebugger } from '../AnalyticsDebugger';
import { DebuggerUI } from './DebuggerUI';

export function DebuggerOverlay() {
    const [visible, setVisible] = useState(AnalyticsDebugger.getInstance().isEnabled());

    useEffect(() => {
        // Poll or subscribe to enabled state changes
        // A simple fix for native reactivity since enabled is simply a boolean in config
        const interval = setInterval(() => {
            const isEnabled = AnalyticsDebugger.getInstance().isEnabled();
            if (isEnabled !== visible) {
                setVisible(isEnabled);
            }
        }, 1000); // Check every second, or better yet, we could trigger events on change

        return () => clearInterval(interval);
    }, [visible]);

    if (!visible) return null;

    return (
        <View style={styles.overlay} pointerEvents="box-none">
            <View style={styles.debuggerContainer}>
                <DebuggerUI />
            </View>
        </View>
    );
};

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 99999,
        justifyContent: 'flex-end',
    },
    debuggerContainer: {
        height: height * 0.6, // Take bottom 60% of screen
        width: width,
        backgroundColor: '#1E1E1E',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 10,
    }
});
