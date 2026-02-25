import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

interface TopBarProps {
    onClear: () => void;
    onPauseToggle: () => void;
    isPaused: boolean;
    onSearch: (text: string) => void;
    onFilterChange: (filter: 'all' | 'event' | 'view' | 'error') => void;
    currentFilter: 'all' | 'event' | 'view' | 'error';
}

export function TopBar({
    onClear,
    onPauseToggle,
    isPaused,
    onSearch,
    onFilterChange,
    currentFilter
}: TopBarProps) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.title}>Analytics Debugger</Text>
            </View>
            <View style={styles.row}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search events..."
                    placeholderTextColor="#888"
                    onChangeText={onSearch}
                />
            </View>
            <View style={styles.row}>
                <View style={styles.filterGroup}>
                    {(['all', 'event', 'view', 'error'] as const).map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterButton, currentFilter === f && styles.filterButtonActive]}
                            onPress={() => onFilterChange(f)}
                        >
                            <Text style={[styles.filterText, currentFilter === f && styles.filterTextActive]}>
                                {f.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.actionGroup}>
                    <TouchableOpacity style={styles.actionButton} onPress={onPauseToggle}>
                        <Text style={styles.buttonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.clearButton]} onPress={onClear}>
                        <Text style={styles.buttonText}>Clear</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E1E1E',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
        backgroundColor: '#ff4444',
        borderRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#2D2D2D',
        color: '#fff',
        padding: 8,
        borderRadius: 4,
        fontSize: 14,
    },
    filterGroup: {
        flexDirection: 'row',
        flex: 1,
    },
    filterButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#444',
    },
    filterButtonActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    filterText: {
        color: '#888',
        fontSize: 10,
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    actionGroup: {
        flexDirection: 'row',
    },
    actionButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#444',
        borderRadius: 4,
        marginLeft: 4,
    },
    clearButton: {
        backgroundColor: '#cc0000',
    },
});
