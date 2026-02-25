import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnalyticsDebugger } from '@mo3ta-dev/rn-analytics-debugger';
import { RootStackParamList } from '../../App';

type DetailsScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Details'>;
};

export function DetailsScreen({ navigation }: DetailsScreenProps) {
    useEffect(() => {
        // Track page view on mount
        AnalyticsDebugger.getInstance().trackView('DetailsScreen', {
            source: 'HomeScreen',
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>✅</Text>
            <Text style={styles.title}>Details Screen</Text>
            <Text style={styles.message}>
                A <Text style={styles.highlight}>View</Text> event was tracked on mount!
            </Text>
            <Text style={styles.hint}>Check your Analytics Debugger overlay or Desktop App.</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.buttonText}>← Go Back</Text>
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
        alignItems: 'center',
    },
    icon: {
        fontSize: 56,
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#1C1C1E',
    },
    message: {
        fontSize: 16,
        color: '#3A3A3C',
        textAlign: 'center',
        marginBottom: 10,
        lineHeight: 24,
    },
    highlight: {
        color: '#34C759',
        fontWeight: '700',
    },
    hint: {
        fontSize: 13,
        color: '#8E8E93',
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#5856D6',
        padding: 16,
        paddingHorizontal: 36,
        borderRadius: 14,
        shadowColor: '#5856D6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
