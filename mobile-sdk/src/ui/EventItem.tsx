import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BaseEvent } from '../types';
import { JSONViewer } from './JSONViewer';

interface EventItemProps {
    event: BaseEvent;
}

export function EventItem({ event }: EventItemProps) {
    const [expanded, setExpanded] = useState(false);

    const timeString = new Date(event.timestamp).toLocaleTimeString([], { hour12: false });

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'event': return '#007AFF'; // Blue
            case 'view': return '#34C759'; // Green
            case 'error': return '#FF3B30'; // Red
            default: return '#8E8E93';
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={() => setExpanded(!expanded)}
            >
                <Text style={styles.time}>{timeString}</Text>
                <View style={[styles.badge, { backgroundColor: getTypeColor(event.type) }]}>
                    <Text style={styles.badgeText}>{event.type.toUpperCase()}</Text>
                </View>
                <Text style={styles.name} numberOfLines={1}>{event.name}</Text>
            </TouchableOpacity>

            {expanded && (
                <View style={styles.details}>
                    <Text style={styles.detailText}>Provider: {event.provider}</Text>
                    <Text style={styles.detailText}>ID: {event.id}</Text>
                    {event.payload && (
                        <View style={styles.payloadContainer}>
                            <Text style={styles.payloadTitle}>Payload:</Text>
                            <JSONViewer data={event.payload} />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        backgroundColor: '#1E1E1E',
    },
    header: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    time: {
        color: '#888',
        fontSize: 12,
        marginRight: 8,
        width: 60,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 8,
        minWidth: 46,
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    name: {
        color: '#fff',
        fontSize: 14,
        flex: 1,
    },
    details: {
        padding: 10,
        paddingTop: 0,
        backgroundColor: '#1A1A1A',
    },
    detailText: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 4,
    },
    payloadContainer: {
        marginTop: 8,
        backgroundColor: '#252526',
        padding: 8,
        borderRadius: 4,
    },
    payloadTitle: {
        color: '#fff',
        fontSize: 12,
        marginBottom: 4,
        fontWeight: 'bold',
    },
});
