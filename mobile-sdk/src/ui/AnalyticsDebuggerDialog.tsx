import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { AnalyticsDebuggerView } from './AnalyticsDebuggerView';

interface AnalyticsDebuggerDialogProps {
    onClose: () => void;
}

export function AnalyticsDebuggerDialog({ onClose }: AnalyticsDebuggerDialogProps) {
    return (
        <View style={styles.overlay} pointerEvents="box-none">
            <View style={styles.debuggerContainer}>
                <View style={styles.handle}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>✕ Close</Text>
                    </TouchableOpacity>
                </View>
                <AnalyticsDebuggerView />
            </View>
        </View>
    );
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 99999,
        justifyContent: 'flex-end',
    },
    debuggerContainer: {
        height: height * 0.6,
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
    },
    handle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#161B22',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    closeButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#30363D',
    },
    closeText: {
        color: '#E6EDF3',
        fontSize: 13,
        fontWeight: '600',
    },
});
