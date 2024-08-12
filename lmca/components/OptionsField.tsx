import React, { useState, useCallback } from 'react';
import { FlatList, TextInput, TouchableOpacity, View, Button, StyleSheet, Text } from 'react-native';

export default function OptionsField({ defaultValue, options } : { defaultValue?: string, options: Array<{ id: string, title: string }> }) {
    const [value, setValue] = useState(defaultValue || '');
    const [visible, setVisible] = useState(false);

    // Handle button press and select an option
    const handleChoice = useCallback((choice: string) => {
        setValue(choice);
        setVisible(false); // Hide list after selection
    }, []);

    // Render function for FlatList items
    const renderItem = ({ item } : { item: { id: string, title: string } }) => (
        <TouchableOpacity style={styles.item} onPress={() => handleChoice(item.title)}>
            <Text>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.optionField}
                onPress={() => setVisible(true)}
            >

                <Text>{value}</Text>

            </TouchableOpacity>
            {visible && (
                <FlatList
                    style={styles.list}
                    data={options}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    optionField: {
        justifyContent: 'center',
        width: 200,
        height: 50,
        borderWidth: 1,
        borderColor: '#000',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    list: {
        borderWidth: 1,
        borderColor: '#ddd',
        maxHeight: 100,
        marginTop: 5,
    },
});