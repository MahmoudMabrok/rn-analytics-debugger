import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface JSONViewerProps {
    data: any;
    level?: number;
}

export function JSONViewer({ data, level = 0 }: JSONViewerProps) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpand = (key: string) => {
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const renderValue = (val: any) => {
        if (typeof val === 'string') return <Text style={styles.string}>"{val}"</Text>;
        if (typeof val === 'number') return <Text style={styles.number}>{val}</Text>;
        if (typeof val === 'boolean') return <Text style={styles.boolean}>{val ? 'true' : 'false'}</Text>;
        if (val === null) return <Text style={styles.null}>null</Text>;
        return <Text style={styles.default}>{String(val)}</Text>;
    };

    if (typeof data !== 'object' || data === null) {
        return <Text style={styles.default}>{renderValue(data)}</Text>;
    }

    const isArray = Array.isArray(data);
    const keys = Object.keys(data);

    return (
        <View style={{ paddingLeft: level > 0 ? 12 : 0 }}>
            {keys.map((key, index) => {
                const value = data[key as keyof typeof data];
                const isObject = typeof value === 'object' && value !== null;
                const isExp = expanded[key];

                return (
                    <View key={key} style={styles.row}>
                        <TouchableOpacity
                            disabled={!isObject}
                            onPress={() => toggleExpand(key)}
                            style={styles.keyContainer}
                        >
                            {isObject && (
                                <Text style={styles.icon}>{isExp ? '▼' : '▶'}</Text>
                            )}
                            <Text style={styles.key}>
                                {isArray ? '' : `"${key}": `}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.valueContainer}>
                            {isObject ? (
                                isExp ? (
                                    <JSONViewer data={value} level={level + 1} />
                                ) : (
                                    <Text style={styles.summary}>
                                        {Array.isArray(value) ? `Array(${value.length})` : 'Object {...}'}
                                    </Text>
                                )
                            ) : (
                                renderValue(value)
                            )}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 1,
    },
    keyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 4,
    },
    icon: {
        color: '#888',
        fontSize: 10,
        marginRight: 4,
    },
    key: {
        color: '#9CDCFE',
        fontSize: 12,
        fontFamily: 'Courier',
    },
    valueContainer: {
        flex: 1,
    },
    string: { color: '#CE9178', fontSize: 12, fontFamily: 'Courier' },
    number: { color: '#B5CEA8', fontSize: 12, fontFamily: 'Courier' },
    boolean: { color: '#569CD6', fontSize: 12, fontFamily: 'Courier' },
    null: { color: '#569CD6', fontSize: 12, fontFamily: 'Courier' },
    default: { color: '#D4D4D4', fontSize: 12, fontFamily: 'Courier' },
    summary: { color: '#888', fontSize: 12, fontFamily: 'Courier', fontStyle: 'italic' },
});
