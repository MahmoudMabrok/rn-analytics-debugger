import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { AnalyticsDebugger } from '../AnalyticsDebugger';
import { BaseEvent } from '../types';
import { TopBar } from './TopBar';
import { EventItem } from './EventItem';

export function AnalyticsDebuggerView() {
    const [events, setEvents] = useState<BaseEvent[]>([]);
    const [isPaused, setIsPaused] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'event' | 'view' | 'error'>('all');

    useEffect(() => {
        const store = AnalyticsDebugger.getInstance().getStore();

        // Subscribe to store updates
        const unsubscribe = store.subscribe((newEvents) => {
            if (!isPaused) {
                setEvents([...newEvents]);
            }
        });

        return () => unsubscribe();
    }, [isPaused]);

    const handleClear = () => {
        AnalyticsDebugger.getInstance().getStore().clearEvents();
    };

    const filteredEvents = events.filter((e) => {
        if (filter !== 'all' && e.type !== filter) return false;
        if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    return (
        <View style={styles.container}>
            <TopBar
                onClear={handleClear}
                onPauseToggle={() => setIsPaused(!isPaused)}
                isPaused={isPaused}
                onSearch={setSearch}
                onFilterChange={setFilter}
                currentFilter={filter}
            />
            {filteredEvents.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No events found</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <EventItem event={item} />}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
    },
    separator: {
        height: 1,
        backgroundColor: '#333',
    },
});
