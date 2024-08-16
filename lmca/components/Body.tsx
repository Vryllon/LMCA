import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Body({ content } : any) {
    return (
        <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.nonScrollContainer}
        >

            {content}
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    nonScrollContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        //flex: 1,
        flexGrow: 1,
    },
});
